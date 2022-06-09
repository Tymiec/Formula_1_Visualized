import pandas as pd
import plotly.express as px

df = pd.read_csv('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/results_modified_with_ages.csv')
df = df.sort_values(by="year")

df2 = df[["year","Age",]]
# df2 = df2.filter(like="1" , axis = 0)

df2=df.groupby(["year"])["Age"].mean()
print(df2)

df2.to_csv("avgage.csv", index=True)
# fig = px.line(df2, x="year", line_shape="spline", render_mode="svg")
# fig.show()
