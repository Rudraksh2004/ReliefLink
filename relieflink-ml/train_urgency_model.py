import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

def train():
    # Load dataset
    dataset_path = 'dataset/urgency_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)
    
    # Preprocessing
    # 1. Text Feature (Description)
    print("Vectorizing description text...")
    vectorizer = TfidfVectorizer(stop_words='english', max_features=500)
    X_text = vectorizer.fit_transform(df['description']).toarray()

    # 2. Categorical Feature (Category)
    print("Encoding categories...")
    encoder = LabelEncoder()
    X_cat = encoder.fit_transform(df['category']).reshape(-1, 1)

    # 3. Numerical Feature (People Affected)
    X_num = df['peopleAffected'].values.reshape(-1, 1)

    # Combine all features
    X = np.hstack((X_text, X_cat, X_num))
    y = df['urgencyScore'].values

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Model Training
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluation
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"Model MAE: {mae:.2f}")
    print(f"Model R2 Score: {r2:.2f}")

    # Save models
    print("Saving models and transformers...")
    joblib.dump(model, 'urgency_model.pkl')
    joblib.dump(vectorizer, 'urgency_vectorizer.pkl')
    joblib.dump(encoder, 'category_encoder.pkl')
    print("Files saved: urgency_model.pkl, urgency_vectorizer.pkl, category_encoder.pkl")

if __name__ == "__main__":
    train()
