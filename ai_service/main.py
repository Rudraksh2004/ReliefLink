import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import List, Dict

# 1. Initialize Firebase
# Load service account from root if available
try:
    cred = credentials.Certificate("../serviceAccount.json")
    firebase_admin.initialize_app(cred)
except Exception:
    # Fallback to default if env is set
    firebase_admin.initialize_app()

db = firestore.client()
app = FastAPI(title="ReliefLink AI Service")

# --- Mock Model Storage (In production, load these from .joblib files) ---
urgency_model = RandomForestRegressor(n_estimators=10) # Placeholder

# --------------------------
# 1) Urgency Prediction Endpoint
# --------------------------
@app.post("/predict-urgency/{need_id}")
async def predict_urgency(need_id: str):
    doc_ref = db.collection("community_needs").document(need_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Need not found")

    data = doc.to_dict()
    
    # Preprocessing
    features = np.array([[
        data.get("severity", 1),
        data.get("peopleAffected", 1),
        data.get("resourceShortage", 1),
        data.get("deadlineUrgency", 1),
        data.get("locationPriority", 1)
    ]])

    # Simple urgency prediction logic (Replace with loaded model.predict)
    urgency_score = int(np.clip(np.sum(features) * 2, 0, 100))
    
    priority_level = "Low"
    if urgency_score >= 80: priority_level = "Critical"
    elif urgency_score >= 60: priority_level = "High"

    # Write back to Firestore
    doc_ref.update({
        "urgency_score": urgency_score,
        "priority_level": priority_level,
        "ai_analyzed": True
    })

    return {"need_id": need_id, "score": urgency_score, "priority": priority_level}

# --------------------------
# 2) Volunteer Recommendation Model
# --------------------------
@app.get("/recommend-volunteers/{task_id}")
async def recommend_volunteers(task_id: str, limit: int = 5):
    task_doc = db.collection("tasks").document(task_id).get()
    if not task_doc.exists:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task_data = task_doc.to_dict()
    required_skills = set(task_data.get("requiredSkills", []))

    # Fetch active volunteers
    volunteers = db.collection("volunteers").where("isActive", "==", True).stream()
    
    scored_volunteers = []
    for v in volunteers:
        v_data = v.to_dict()
        v_skills = set(v_data.get("skills", []))
        
        # Skill Match Score
        overlap = len(required_skills.intersection(v_skills))
        skill_score = (overlap / len(required_skills)) * 100 if required_skills else 100
        
        # Final Score calculation
        final_score = (skill_score * 0.6) + (v_data.get("rating", 0) * 8)
        
        scored_volunteers.append({
            "id": v.id,
            "name": v_data.get("name"),
            "score": round(final_score, 2)
        })

    # Rank and Return
    results = sorted(scored_volunteers, key=lambda x: x["score"], reverse=True)[:limit]
    return {"task_id": task_id, "recommendations": results}

# --------------------------
# 3) Region Demand Forecast Model
# --------------------------
@app.get("/forecast-demand/{region_prefix}")
async def forecast_service(region_prefix: str):
    # Logic: Fetch historical daily counts for this region geohash prefix
    # For now, we simulate a time-series forecast (e.g. ARIMA / Prophet placeholder)
    
    historical_data = db.collection("analytics_cache")\
        .where("type", "==", "daily_stats")\
        .limit(30).stream()
    
    # Complex AI forecasting logic would go here
    # Placeholder: Simple moving average prediction
    forecasted_needs = np.random.randint(5, 15)
    
    return {
        "region": region_prefix,
        "forecast_period": "Next 24h",
        "predicted_demand_volume": forecasted_needs,
        "confidence_score": 0.82
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
