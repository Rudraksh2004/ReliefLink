import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression
import joblib
import os

# Create directory for models
os.makedirs("models", exist_ok=True)

def generate_urgency_data(n=500):
    print("Generating Urgency Data...")
    severity = np.random.randint(1, 11, n)
    people = np.random.randint(1, 1001, n)
    shortage = np.random.randint(1, 11, n)
    deadline = np.random.randint(1, 11, n)
    risk = np.random.randint(1, 11, n)
    past_cases = np.random.randint(1, 51, n)
    
    # Target formula with noise
    score = (severity * 4) + (np.log10(people) * 10) + (shortage * 2) + (deadline * 2) + (risk * 1) + (past_cases * 0.1)
    score = np.clip(score + np.random.normal(0, 5, n), 0, 100)
    
    df = pd.DataFrame({
        'severity': severity, 'peopleAffected': people, 'resourceShortage': shortage,
        'deadlineUrgency': deadline, 'locationRisk': risk, 'pastSimilarCases': past_cases,
        'urgency_score': score
    })
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(df.drop('urgency_score', axis=1), df['urgency_score'])
    joblib.dump(model, "models/urgency_model.pkl")
    return df

def generate_matching_data(n=500):
    print("Generating Matching Data...")
    skill = np.random.uniform(0, 1, n)
    dist = np.random.uniform(1, 50, n)
    avail = np.random.randint(1, 48, n)
    acc_rate = np.random.uniform(0, 1, n)
    comp_rate = np.random.uniform(0, 1, n)
    urgency = np.random.randint(0, 101, n)
    
    # Target probability
    prob = (skill * 0.5) + (acc_rate * 0.2) + (comp_rate * 0.2) - (dist / 100)
    prob = np.clip(prob + np.random.normal(0, 0.1, n), 0, 1)
    
    df = pd.DataFrame({
        'skill_overlap': skill, 'distance_km': dist, 'availability_hours': avail,
        'past_acceptance_rate': acc_rate, 'completion_rate': comp_rate, 
        'task_urgency_score': urgency, 'match_probability': prob
    })
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(df.drop('match_probability', axis=1), df['match_probability'])
    joblib.dump(model, "models/matching_model.pkl")
    return df

def generate_forecast_data(n=500):
    print("Generating Forecast Data...")
    density = np.random.uniform(0, 100, n)
    avg_urg = np.random.uniform(0, 100, n)
    shortage = np.random.uniform(0, 50, n)
    trend = np.random.uniform(-10, 10, n)
    
    # Target priority score
    future = (density * 0.4) + (avg_urg * 0.3) + (shortage * 0.2) + (trend * 0.1)
    future = np.clip(future + np.random.normal(0, 5, n), 0, 100)
    
    df = pd.DataFrame({
        'recent_task_density': density, 'recent_average_urgency': avg_urg,
        'volunteer_shortage': shortage, 'trend_last_7_days': trend,
        'future_priority_score': future
    })
    
    model = LinearRegression()
    model.fit(df.drop('future_priority_score', axis=1), df['future_priority_score'])
    joblib.dump(model, "models/region_forecast_model.pkl")
    return df

if __name__ == "__main__":
    generate_urgency_data()
    generate_matching_data()
    generate_forecast_data()
    print("All models trained and saved in ai_service/models/")
