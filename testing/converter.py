import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/lap_times_named.csv")
df2 = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/drivers.csv")

for i in range(1,100):
    df.loc[i,'driverId'] = df2.loc[df.loc[i,'driverId'],'surname']
    print(df.loc[i,'driverId'])
    if(i%10000 == 0):
        print(i)


print(df)
# df.to_csv("lap_times_named.csv", index=False)