import pandas as pd

df_left = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/results_modified_named_by_tymek_messy.csv")
df_right = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/races.csv")

combined = pd.merge(df_left, df_right, left_on="raceId", right_on="raceId", how="left")
print(df_left)
print(combined.tail)

combined.to_csv("results_modified_named_by_tymek_messy_2.csv", index=False)