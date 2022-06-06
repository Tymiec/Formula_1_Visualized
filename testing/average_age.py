import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/results_modified_with_ages.csv')
df = df.sort_values(by="raceId")

df2 = df[["raceId","year","Age","position"]]
df2 = df2.filter(like="1" , axis = 0)
print(df2)
df2=df.groupby(["raceId","year"])["Age"].mean()