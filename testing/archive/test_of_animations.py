import matplotlib.animation as pan
import matplotlib.pyplot as ppl
import pandas as pd

df = pd.read_csv(r'https://github.com/Tymiec/Formula_1_Visualized/blob/master/sources/raw/lap_times.csv')

df2 = df.loc[df['raceId'] == 1000]
df2 = df2.reset_index()

fig = ppl.figure()
ppl.ylabel("Lap times")
ppl.xlabel("Lap number")

print(len(df2))
print(df2)

for i in range(len(df2)) :
    lap1 = df.loc[i,'lap']
    lap2 = df.loc[i+1,'lap']
    time1 = df.loc[i,'milliseconds']
    time2 = df.loc[i+1,'milliseconds']
    driver1 = df.loc[i,'driverId']
    driver2 = df.loc[i+1,'driverId']
    if(driver1 != driver2):
        ppl.plot(lap1,time1)
    else:
        ppl.plot( [lap1 , lap2] , [time1 , time2] )
    if(i < 3):
        print(lap1)
        print(time1)
        print(lap2)
        print(time2)
        print("-------------------")



ppl.show()
