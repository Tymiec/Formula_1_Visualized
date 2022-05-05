import io
import pandas as pd
df = pd.read_csv(r"D:\Repo\Wizualizacja_projekt\testing\heatmap_narodowosci\drivers_country_code.csv")
df2 = df[["country_code"]]
df2["value"] = 1
df2=df2.groupby(["country_code"])["value"].sum()

# df['freq'] = df.groupby('country_code').sum()

print(df2)
df2.to_csv("testing.csv")
