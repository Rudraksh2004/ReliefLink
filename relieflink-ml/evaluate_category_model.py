import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import os

def evaluate():
    # Load dataset
    dataset_path = 'dataset/needs_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)
    X = df['description']
    y = df['category']

    # Load model and vectorizer
    model = joblib.load('model.pkl')
    vectorizer = joblib.load('vectorizer.pkl')

    # Split (Same seed as training for consistency)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Transform test data
    X_test_tfidf = vectorizer.transform(X_test)

    # Predict
    y_pred = model.predict(X_test_tfidf)

    # Metrics
    print("--- CATEGORY CLASSIFICATION MODEL EVALUATION ---")
    print(f"Total Test Samples: {len(y_test)}")
    print(f"Accuracy Score: {accuracy_score(y_test, y_pred):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

if __name__ == "__main__":
    evaluate()
