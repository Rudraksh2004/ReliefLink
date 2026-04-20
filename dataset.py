import pandas as pd

df = pd.read_parquet("train.parquet")

df.to_csv("needs_dataset.csv", index=False)

print("CSV file saved successfully")