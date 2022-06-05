import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/results_modified_with_ages.csv')
df = df.sort_values(by="raceId")

df2 = df[["raceId","Wiek"]]
print("It does something")
df2=df.groupby(["raceId"])["Wiek"].mean()
print("It did something")



#print(df2)