import io
import pandas as pd

df = pd.read_csv(r"D:\Repo\Wizualizacja_projekt\testing\heatmap_narodowosci\only_nationalities.csv")

filtered_column_names = (df == "GER").any(axis=0)
subset = df[df.columns[filtered_column_names]]

print(subset.stack().value_counts())