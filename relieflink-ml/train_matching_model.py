import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def train():
    # Load dataset
    dataset_path = 'dataset/matching_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)
    
    # Preprocessing
    encoders = {}
    categorical_cols = ['needCategory', 'volunteerSkills', 'availability']
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le

    # Features and Target
    X = df[['needCategory', 'urgencyScore', 'volunteerSkills', 'availability', 'distanceKm']]
    y = df['matchLabel']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Model Training
    print("Training GradientBoostingClassifier...")
    model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    model.fit(X_train, y_train)

    # Evaluation
    y_pred = model.predict(X_test)
    print(f"Model Accuracy: {accuracy_score(y_test, y_pred):.2f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save models and encoders
    print("Saving model and encoders...")
    joblib.dump(model, 'matching_model.pkl')
    joblib.dump(encoders, 'matching_encoders.pkl')
    print("Files saved: matching_model.pkl, matching_encoders.pkl")

if __name__ == "__main__":
    train()
