import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib
import os

def train():
    # Load dataset
    dataset_path = 'dataset/region_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)
    
    # Features for clustering
    features = ['latitude', 'longitude', 'urgencyScore', 'totalNeeds']
    X = df[features]

    # Normalize
    print("Normalizing features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train KMeans
    print("Training KMeans (4 clusters)...")
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(X_scaled)

    # Calculate cluster ranking based on urgency and needs
    # We want to map cluster labels to meaningful priority levels
    cluster_stats = df.groupby('cluster').agg({
        'urgencyScore': 'mean',
        'totalNeeds': 'mean'
    }).reset_index()

    # Sort clusters by a combined metric (urgency * needs) to rank them
    cluster_stats['rank_score'] = cluster_stats['urgencyScore'] * cluster_stats['totalNeeds']
    cluster_stats = cluster_stats.sort_values('rank_score').reset_index(drop=True)

    # Map sorted ranks to labels
    priority_labels = ['low', 'medium', 'high', 'critical']
    cluster_mapping = {int(row['cluster']): priority_labels[i] for i, row in cluster_stats.iterrows()}

    print("Cluster Mapping:")
    for cluster, label in cluster_mapping.items():
        print(f"  Cluster {cluster} -> {label}")

    # Save model, scaler and mapping
    print("Saving model, scaler, and mapping...")
    joblib.dump(kmeans, 'region_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(cluster_mapping, 'cluster_mapping.pkl')
    
    print("Files saved: region_model.pkl, scaler.pkl, cluster_mapping.pkl")

if __name__ == "__main__":
    train()
