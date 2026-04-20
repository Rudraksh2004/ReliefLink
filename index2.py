import pandas as pd
import json

df = pd.read_csv("needs_dataset.csv")

df.to_json("needs_firestore.json", orient="records", indent=2)

print("Firestore JSON ready")