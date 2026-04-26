import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
import os

def evaluate():
    # Load dataset
    dataset_path = 'dataset/matching_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)
    
    # Load model and encoders
    model = joblib.load('matching_model.pkl')
    encoders = joblib.load('matching_encoders.pkl')

    # Preprocessing
    categorical_cols = ['needCategory', 'volunteerSkills', 'availability']
    for col in categorical_cols:
        le = encoders[col]
        # Handle unseen labels by mapping them to the first class
        df[col] = df[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else le.transform([le.classes_[0]])[0])

    X = df[['needCategory', 'urgencyScore', 'volunteerSkills', 'availability', 'distanceKm']]
    y = df['matchLabel']

    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Predict
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    # Metrics
    print("--- VOLUNTEER MATCHING MODEL EVALUATION ---")
    print(f"Accuracy Score: {accuracy_score(y_test, y_pred):.4f}")
    print(f"ROC AUC Score: {roc_auc_score(y_test, y_prob):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

if __name__ == "__main__":
    evaluate()
