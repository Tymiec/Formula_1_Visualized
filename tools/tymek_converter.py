import pandas as pd

df_lap = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/results_modified.csv")
df_drivers = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/drivers.csv")

combined = pd.merge(df_lap, df_drivers, left_on="driverId", right_on="driverId", how="left")
print(df_lap)
print(combined.tail)

combined.to_csv("results_modified_named_by_tymek_messy.csv", index=False)