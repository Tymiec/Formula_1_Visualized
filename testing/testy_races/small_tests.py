# lap = list(range(1, 88))
# print (lap)
import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/lap_times.csv")

print(df.to_string()) 