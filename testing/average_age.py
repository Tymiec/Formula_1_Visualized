import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/results_modified_with_ages.csv')
df = df.sort_values(by="raceId")

df2 = df[["raceId","year","Age"]]
print(df2)
df2=df.groupby(["year"])["Age"].mean()
print(df2)