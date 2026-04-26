import joblib
import numpy as np
import sys
import os

def predict_urgency(description, peopleAffected, category):
    try:
        # Resolve paths
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'urgency_model.pkl')
        vectorizer_path = os.path.join(script_dir, 'urgency_vectorizer.pkl')
        encoder_path = os.path.join(script_dir, 'category_encoder.pkl')

        if not all(os.path.exists(p) for p in [model_path, vectorizer_path, encoder_path]):
            return "Error: Model files missing. Run train_urgency_model.py first."

        # Load models
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        encoder = joblib.load(encoder_path)

        # Preprocess inputs
        # 1. Text
        text_vec = vectorizer.transform([description]).toarray()
        
        # 2. Category (Handle unseen categories gracefully)
        try:
            cat_enc = encoder.transform([category]).reshape(-1, 1)
        except ValueError:
            # Fallback to 'other' or mean if unknown
            cat_enc = encoder.transform(['other']).reshape(-1, 1)

        # 3. Numeric
        num_feat = np.array([[float(peopleAffected)]])

        # Combine
        X = np.hstack((text_vec, cat_enc, num_feat))

        # Predict
        prediction = model.predict(X)[0]
        
        # Round and clamp between 1 and 10
        final_score = int(round(prediction))
        return max(1, min(10, final_score))

    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) >= 4:
        desc = sys.argv[1]
        affected = sys.argv[2]
        cat = sys.argv[3]
        
        result = predict_urgency(desc, affected, cat)
        print(f"Predicted urgency score: {result}")
    else:
        print("Usage: python predict_urgency.py \"description\" peopleAffected \"category\"")
        print("Example: python predict_urgency.py \"Flood destroyed houses\" 120 \"shelter\"")
