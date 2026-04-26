import pandas as pd
import numpy as np
import joblib
from sklearn.metrics import silhouette_score
import os

def evaluate():
    # Load dataset
    dataset_path = 'dataset/region_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)
    
    # Load model and scaler
    model = joblib.load('region_model.pkl')
    scaler = joblib.load('scaler.pkl')
    mapping = joblib.load('cluster_mapping.pkl')

    # Features for clustering
    features = ['latitude', 'longitude', 'urgencyScore', 'totalNeeds']
    X = df[features]

    # Normalize
    X_scaled = scaler.transform(X)

    # Predict clusters
    clusters = model.predict(X_scaled)
    df['cluster'] = clusters
    df['priority'] = df['cluster'].map(mapping)

    # Metrics
    sil_score = silhouette_score(X_scaled, clusters)

    print("--- REGION CLUSTERING MODEL EVALUATION ---")
    print(f"Silhouette Score: {sil_score:.4f} (Higher is better, range -1 to 1)")
    
    print("\nCluster Distribution:")
    dist = df['priority'].value_counts()
    for label, count in dist.items():
        print(f"  {label.capitalize()}: {count} regions")

    print("\nCluster Centers (Original Scale):")
    # Inverse transform cluster centers to see what they represent
    centers_scaled = model.cluster_centers_
    centers_orig = scaler.inverse_transform(centers_scaled)
    
    centers_df = pd.DataFrame(centers_orig, columns=features)
    centers_df['cluster'] = range(len(centers_df))
    centers_df['priority'] = centers_df['cluster'].map(mapping)
    
    # Sort by priority order for readability
    priority_order = {'low': 0, 'medium': 1, 'high': 2, 'critical': 3}
    centers_df = centers_df.sort_values(by='priority', key=lambda x: x.map(priority_order))
    
    print(centers_df[['priority', 'urgencyScore', 'totalNeeds', 'latitude', 'longitude']])

if __name__ == "__main__":
    evaluate()
