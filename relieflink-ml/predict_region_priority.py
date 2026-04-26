import joblib
import numpy as np
import sys
import os

def predict_region_priority(lat, lng, urgency, needs):
    try:
        # Resolve paths
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'region_model.pkl')
        scaler_path = os.path.join(script_dir, 'scaler.pkl')
        mapping_path = os.path.join(script_dir, 'cluster_mapping.pkl')

        if not all(os.path.exists(p) for p in [model_path, scaler_path, mapping_path]):
            return "Error: Model files missing. Run train_region_model.py first."

        # Load
        kmeans = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        mapping = joblib.load(mapping_path)

        # Prepare input
        X = np.array([[float(lat), float(lng), float(urgency), float(needs)]])
        
        # Scale
        X_scaled = scaler.transform(X)

        # Predict cluster
        cluster = kmeans.predict(X_scaled)[0]

        # Return human-readable label
        return mapping.get(cluster, "unknown")

    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) >= 5:
        lat = sys.argv[1]
        lng = sys.argv[2]
        urgency = sys.argv[3]
        needs = sys.argv[4]
        
        result = predict_region_priority(lat, lng, urgency, needs)
        print(result)
    else:
        print("Usage: python predict_region_priority.py lat lng urgencyScore totalNeeds")
        print("Example: python predict_region_priority.py 22.57 88.36 8 12")
