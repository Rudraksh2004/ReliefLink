from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI(title="ReliefLink ML Integration Service")

# --- Model Loading ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_pkl(filename):
    path = os.path.join(BASE_DIR, filename)
    if os.path.exists(path):
        return joblib.load(path)
    return None

# Model 1: Category Classification
model1 = load_pkl('model.pkl')
vectorizer1 = load_pkl('vectorizer.pkl')

# Model 2: Urgency Regression
model2 = load_pkl('urgency_model.pkl')
vectorizer2 = load_pkl('urgency_vectorizer.pkl')
encoder2 = load_pkl('category_encoder.pkl')

# Model 3: Volunteer Matching
model3 = load_pkl('matching_model.pkl')
encoders3 = load_pkl('matching_encoders.pkl')

# Model 4: Region Priority
model4 = load_pkl('region_model.pkl')
scaler4 = load_pkl('scaler.pkl')
mapping4 = load_pkl('cluster_mapping.pkl')

# --- Request Models ---

class CategoryRequest(BaseModel):
    description: str

class UrgencyRequest(BaseModel):
    description: str
    peopleAffected: float
    category: str

class MatchRequest(BaseModel):
    needCategory: str
    urgencyScore: float
    volunteerSkills: str
    availability: str
    distanceKm: float

class RegionRequest(BaseModel):
    latitude: float
    longitude: float
    urgencyScore: float
    totalNeeds: float

# --- Endpoints ---

@app.post("/predict-category")
async def predict_category(request: CategoryRequest):
    if not model1 or not vectorizer1:
        raise HTTPException(status_code=500, detail="Category model not loaded")
    
    text_vec = vectorizer1.transform([request.description])
    prediction = model1.predict(text_vec)
    return {"predictedCategory": prediction[0]}

@app.post("/predict-urgency")
async def predict_urgency(request: UrgencyRequest):
    if not all([model2, vectorizer2, encoder2]):
        raise HTTPException(status_code=500, detail="Urgency model not loaded")
    
    text_vec = vectorizer2.transform([request.description]).toarray()
    try:
        cat_enc = encoder2.transform([request.category]).reshape(-1, 1)
    except:
        cat_enc = encoder2.transform(['other']).reshape(-1, 1)
    
    num_feat = np.array([[request.peopleAffected]])
    X = np.hstack((text_vec, cat_enc, num_feat))
    
    prediction = model2.predict(X)[0]
    final_score = int(round(prediction))
    return {"urgencyScore": max(1, min(10, final_score))}

@app.post("/predict-match")
async def predict_match(request: MatchRequest):
    if not model3 or not encoders3:
        raise HTTPException(status_code=500, detail="Matching model not loaded")
    
    input_data = {
        'needCategory': request.needCategory,
        'urgencyScore': request.urgencyScore,
        'volunteerSkills': request.volunteerSkills,
        'availability': request.availability,
        'distanceKm': request.distanceKm
    }

    # Encode
    for col, le in encoders3.items():
        if input_data[col] not in le.classes_:
            input_data[col] = le.classes_[0]
        input_data[col] = le.transform([input_data[col]])[0]

    X = pd.DataFrame([input_data])
    X = X[['needCategory', 'urgencyScore', 'volunteerSkills', 'availability', 'distanceKm']]
    
    probabilities = model3.predict_proba(X)[0]
    return {"matchProbability": round(float(probabilities[1]), 2)}

@app.post("/predict-region-priority")
async def predict_region_priority(request: RegionRequest):
    if not all([model4, scaler4, mapping4]):
        raise HTTPException(status_code=500, detail="Region priority model not loaded")
    
    X = np.array([[request.latitude, request.longitude, request.urgencyScore, request.totalNeeds]])
    X_scaled = scaler4.transform(X)
    cluster = model4.predict(X_scaled)[0]
    
    return {"priorityLevel": mapping4.get(int(cluster), "unknown")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
