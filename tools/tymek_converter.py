import pandas as pd

df_left = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/results_modified_named_by_tymek_messy.csv")
df_right = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/raw/races.csv")

combined = pd.merge(df_left, df_right, left_on="raceId", right_on="raceId", how="left", copy=False)
print(df_left)
print(combined.tail)

combined.to_csv("results_modified_named_by_tymek_messy_2.csv", index=False)