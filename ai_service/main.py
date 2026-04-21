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
from geofire_common import distanceBetween # For distance calculation

# 1. Initialize Firebase
try:
    cred = credentials.Certificate("../serviceAccount.json")
    firebase_admin.initialize_app(cred)
except Exception:
    firebase_admin.initialize_app()

db = firestore.client()
app = FastAPI(title="ReliefLink Explainable AI Service")

# 2. Load Models
MODEL_PATH = "models"
urgency_model = joblib.load(os.path.join(MODEL_PATH, "urgency_model.pkl"))
matching_model = joblib.load(os.path.join(MODEL_PATH, "matching_model.pkl"))

# 3. Load Semantic Model
embedder = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# --------------------------
# STEP 3: Explainable AI Logic
# --------------------------
def generate_match_explanation(v_data: dict, task_data: dict, scores: dict) -> List[str]:
    explanations = []
    
    # 1. Skill Match
    if scores['semantic'] > 0.8:
        explanations.append(f"{int(scores['semantic']*100)}% semantic skill similarity (Expert level)")
    elif scores['semantic'] > 0.6:
        explanations.append(f"Strong skill alignment ({int(scores['semantic']*100)}%)")
        
    # 2. Proximity
    dist = scores.get('distance_km', 99)
    if dist < 5:
        explanations.append(f"Very close proximity ({round(dist, 1)} km away)")
    elif dist < 15:
        explanations.append(f"Local volunteer ({round(dist, 1)} km)")

    # 3. Availability
    avail = v_data.get('availability_hours', 0)
    if avail > 24:
        explanations.append("High availability for the requested period")

    # 4. Reliability
    comp_rate = v_data.get('completion_rate', 0)
    if comp_rate > 0.85:
        explanations.append("Outstanding past completion rate")
    elif comp_rate > 0.7:
        explanations.append("Reliable track record")

    # 5. Urgency Context
    urgency = task_data.get('urgency_score', 0)
    if urgency > 75:
        explanations.append("Selected to match CRITICAL task urgency")

    return explanations

# --------------------------
# STEP 4 & 5: Matching Endpoint with XAI
# --------------------------
@app.post("/match-volunteer/{task_id}")
async def explainable_match(task_id: str, payload: Dict = Body(...)):
    task_doc = db.collection("tasks").document(task_id).get()
    if not task_doc.exists:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = task_doc.to_dict()
    task_loc = task_data.get('location', {})
    required_skills = task_data.get('requiredSkills', [])
    task_urgency = task_data.get('urgency_score', 50)
    
    # Simple search for volunteers (In production, use GeoFirestore)
    volunteers = db.collection("volunteers").where("isActive", "==", True).limit(20).stream()
    
    recommendations = []
    for v in volunteers:
        v_data = v.to_dict()
        v_loc = v_data.get('location', {})
        
        # Calculate Distance
        dist_km = 99
        if v_loc and task_loc:
            dist_km = distanceBetween(
                 [v_loc.get('lat', 0), v_loc.get('lng', 0)],
                 [task_loc.get('lat', 0), task_loc.get('lng', 0)]
            )

        # 1. ML Probability
        match_features = np.array([[
            0.5, # skill overlap placeholder
            dist_km,
            v_data.get("availability_hours", 24),
            v_data.get("past_acceptance_rate", 0.5),
            v_data.get("completion_rate", 0.8),
            task_urgency / 100
        ]])
        ml_prob = float(matching_model.predict(match_features)[0])
        
        # 2. Semantic Score
        sem_score = 0
        if required_skills and v_data.get('skills'):
            v_emb = embedder.encode([" ".join(v_data['skills'])])
            t_emb = embedder.encode([" ".join(required_skills)])
            sem_score = float(cosine_similarity(v_emb, t_emb)[0][0])

        # 3. Final Hybrid Score
        final_score = (0.6 * ml_prob) + (0.4 * sem_score)
        
        # 4. Generate Explanations
        scores_for_xai = {'semantic': sem_score, 'distance_km': dist_km}
        explanation_list = generate_match_explanation(v_data, task_data, scores_for_xai)

        recommendations.append({
            "volunteer_id": v.id,
            "name": v_data.get("name"),
            "match_score": round(final_score * 100, 2),
            "semantic_score": round(sem_score, 4),
            "distance_km": round(dist_km, 2),
            "explanation": explanation_list
        })

    # Sort and return top match
    best_matches = sorted(recommendations, key=lambda x: x["match_score"], reverse=True)[:3]

    # Store in Firestore matches collection
    for m in best_matches:
        db.collection("matches").add({
            "taskId": task_id,
            "volunteerId": m["volunteer_id"],
            "score": m["match_score"],
            "explanation": m["explanation"],
            "status": "ai_recommended",
            "timestamp": firestore.SERVER_TIMESTAMP
        })

    return {"task_id": task_id, "best_matches": best_matches}

# --- Keep existing helper code ---

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
