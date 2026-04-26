import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import os

def evaluate():
    # Load dataset
    dataset_path = 'dataset/urgency_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)
    
    # Load model and transformers
    model = joblib.load('urgency_model.pkl')
    vectorizer = joblib.load('urgency_vectorizer.pkl')
    encoder = joblib.load('category_encoder.pkl')

    # Preprocessing test data
    X_text = vectorizer.transform(df['description']).toarray()
    
    # Category encoding (Handling potentially unseen categories in the same way as prediction)
    try:
        X_cat = encoder.transform(df['category']).reshape(-1, 1)
    except Exception:
        # Fallback if there are unseen categories in test
        X_cat = np.array([encoder.transform([c if c in encoder.classes_ else 'other'])[0] for c in df['category']]).reshape(-1, 1)

    X_num = df['peopleAffected'].values.reshape(-1, 1)
    X = np.hstack((X_text, X_cat, X_num))
    y = df['urgencyScore'].values

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Predict
    y_pred = model.predict(X_test)

    # Metrics
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print("--- URGENCY REGRESSION MODEL EVALUATION ---")
    print(f"Mean Absolute Error (MAE): {mae:.4f}")
    print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
    print(f"R-squared Score: {r2:.4f}")

if __name__ == "__main__":
    evaluate()
