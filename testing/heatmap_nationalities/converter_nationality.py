import io
import pandas as pd
df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/heatmap_nationalities/drivers_country_code.csv")
df2 = df[["country_code"]]
df2["occurences"] = 1 # można wpisać cokolwiek bo liczy i tak tylko wystąpienia
df2 = df2.groupby(["country_code"])["occurences"].count()

print(df2)
# df2.to_csv("testing.csv")
