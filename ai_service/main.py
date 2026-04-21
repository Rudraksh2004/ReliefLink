import uvicorn
from fastapi import FastAPI, HTTPException, Body
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import numpy as np
import joblib
import os
from typing import List, Dict
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Initialize Firebase
try:
    cred = credentials.Certificate("../serviceAccount.json")
    firebase_admin.initialize_app(cred)
except Exception:
    firebase_admin.initialize_app()

db = firestore.client()
app = FastAPI(title="ReliefLink Semantic AI Service")

# 2. Load Models
MODEL_PATH = "models"
urgency_model = joblib.load(os.path.join(MODEL_PATH, "urgency_model.pkl"))
matching_model = joblib.load(os.path.join(MODEL_PATH, "matching_model.pkl"))
forecast_model = joblib.load(os.path.join(MODEL_PATH, "region_forecast_model.pkl"))

# 3. Load Semantic Embedding Model
print("Loading Semantic Embedding Model...")
embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# --- Shared Helper Functions ---

def calculate_semantic_score(source_skills: List[str], target_skills: List[str]) -> float:
    if not source_skills or not target_skills:
        return 0.0
    
    # Generate embeddings (Simplified: Average of skill embeddings)
    source_emb = embedder.encode([" ".join(source_skills)])
    target_emb = embedder.encode([" ".join(target_skills)])
    
    # Compute Cosine Similarity
    similarity = cosine_similarity(source_emb, target_emb)
    return float(similarity[0][0])

# --------------------------
# 5) Semantic Match Endpoint
# --------------------------
@app.post("/semantic-match")
async def semantic_match(payload: Dict = Body(...)):
    volunteer_skills = payload.get("volunteer_skills", [])
    task_skills = payload.get("task_skills", [])
    
    score = calculate_semantic_score(volunteer_skills, task_skills)
    return {"semantic_skill_match_score": round(score, 4)}

# --------------------------
# 2) Hybrid Volunteer Recommendation Model (Updated)
# --------------------------
@app.get("/recommend-volunteers/{task_id}")
async def recommend_volunteers(task_id: str, limit: int = 5):
    task_doc = db.collection("tasks").document(task_id).get()
    if not task_doc.exists:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = task_doc.to_dict()
    required_skills = task_data.get("requiredSkills", [])
    task_urgency = task_data.get("taskUrgency", 50)
    task_location = task_data.get("location")

    volunteers = db.collection("volunteers").where("isActive", "==", True).limit(50).stream()
    
    scored_volunteers = []
    for v in volunteers:
        v_data = v.to_dict()
        v_skills = v_data.get("skills", [])
        
        # A) ML Match Score (Structural factors)
        # Using placeholder inputs for missing fields if necessary
        match_features = np.array([[
            0.5, # Placeholder for structural overlap
            10.0, # Placeholder for distance
            v_data.get("availability_hours", 24),
            v_data.get("past_acceptance_rate", 0.5),
            v_data.get("completion_rate", 0.8),
            task_urgency / 100
        ]])
        ml_prob = matching_model.predict(match_features)[0]
        
        # B) Semantic Match Score (NLP meaning)
        semantic_score = calculate_semantic_score(v_skills, required_skills)
        
        # C) COMBINED SCORE (STEP 4)
        final_match_score = (0.6 * ml_prob) + (0.4 * semantic_score)
        
        scored_volunteers.append({
            "id": v.id,
            "name": v_data.get("name"),
            "final_match_score": round(final_match_score, 4),
            "ml_score": round(float(ml_prob), 4),
            "semantic_score": round(semantic_score, 4)
        })

    results = sorted(scored_volunteers, key=lambda x: x["final_match_score"], reverse=True)[:limit]
    
    # STEP 6: Update Matches collection automatically
    for res in results:
        db.collection("matches").add({
            "task_id": task_id,
            "volunteer_id": res["id"],
            "score": res["final_match_score"],
            "status": "AI_SUGGESTED",
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
    return {"task_id": task_id, "recommendations": results}

# --- Keep existing Urgency and Forecast endpoints ---
@app.post("/predict-urgency/{need_id}")
async def predict_urgency(need_id: str):
    doc_ref = db.collection("community_needs").document(need_id)
    doc = doc_ref.get()
    if not doc.exists: raise HTTPException(status_code=404)
    data = doc.to_dict()
    features = np.array([[data.get("severity", 1), data.get("peopleAffected", 1), data.get("resourceShortage", 1), 
                         data.get("deadlineUrgency", 1), data.get("locationPriority", 1), 20]]) # 20 is placeholder for pastCases
    score = urgency_model.predict(features)[0]
    urgency_score = int(np.clip(score, 0, 100))
    doc_ref.update({"urgency_score": urgency_score, "ai_analyzed": True})
    return {"need_id": need_id, "score": urgency_score}

@app.get("/forecast-demand/{region_prefix}")
async def forecast_service(region_prefix: str):
    forecast_features = np.array([[15.5, 72.0, 5.0, 2.5]]) 
    prediction = forecast_model.predict(forecast_features)
    return {"region": region_prefix, "predicted_priority": round(float(prediction[0]), 2)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
