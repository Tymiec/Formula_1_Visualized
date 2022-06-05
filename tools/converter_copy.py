import pandas as pd

# df2 = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/raw/status.csv")

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/results_modified.csv", usecols = ['year','statusId'], low_memory = True)

# df2 = df.groupby(["statusId"])["year"].sum()
# print(df)

df.to_csv("status_named.csv", index=False)