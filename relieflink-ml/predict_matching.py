import joblib
import pandas as pd
import sys
import os

def predict_match_probability(needCategory, urgencyScore, volunteerSkills, availability, distanceKm):
    try:
        # Resolve paths
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'matching_model.pkl')
        encoders_path = os.path.join(script_dir, 'matching_encoders.pkl')

        if not os.path.exists(model_path) or not os.path.exists(encoders_path):
            return "Error: Model files missing. Run train_matching_model.py first."

        # Load model and encoders
        model = joblib.load(model_path)
        encoders = joblib.load(encoders_path)

        # Prepare input data
        input_data = {
            'needCategory': needCategory,
            'urgencyScore': float(urgencyScore),
            'volunteerSkills': volunteerSkills,
            'availability': availability,
            'distanceKm': float(distanceKm)
        }

        # Encode categorical variables
        for col, le in encoders.items():
            try:
                # Handle unseen categories by taking the first known category as fallback
                if input_data[col] not in le.classes_:
                    input_data[col] = le.classes_[0]
                input_data[col] = le.transform([input_data[col]])[0]
            except Exception:
                input_data[col] = 0

        # Create DataFrame for prediction
        X = pd.DataFrame([input_data])
        
        # Ensure column order matches training
        X = X[['needCategory', 'urgencyScore', 'volunteerSkills', 'availability', 'distanceKm']]

        # Predict probability
        probabilities = model.predict_proba(X)[0]
        match_probability = probabilities[1] # Probability of class 1 (match)

        return round(match_probability, 2)

    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) >= 6:
        cat = sys.argv[1]
        urgency = sys.argv[2]
        skills = sys.argv[3]
        avail = sys.argv[4]
        dist = sys.argv[5]
        
        result = predict_match_probability(cat, urgency, skills, avail, dist)
        print(f"Match probability: {result}")
    else:
        print("Usage: python predict_matching.py needCategory urgencyScore volunteerSkills availability distanceKm")
        print("Example: python predict_matching.py medical 9 medical anytime 3")
