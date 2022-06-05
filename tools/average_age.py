import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/results_modified_with_ages.csv')
df = df.sort_values(by="raceId")

df2 = df[["raceId","year","Age"]]
df2=df.groupby(["raceId","year"])["Age"].mean()

print(df2)

df2.to_csv("average_age.csv", index=True)