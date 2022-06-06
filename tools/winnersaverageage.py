import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/winners.csv')
df = df.sort_values(by="raceId")

df2 = df[["raceId","year","Wiek","position"]]
pd.set_option('display.max_rows', None)
df2 = df2.loc[df2["position"] == 1]
df2=df.groupby("year")["Wiek"].mean()
print(df2)