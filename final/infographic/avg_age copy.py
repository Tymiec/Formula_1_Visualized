import pandas as pd
import plotly.express as px

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/average_youngest_oldest.csv")


fig = px.line(df, x="year", y=["Age","Youngest","Oldest"], line_shape="spline", render_mode="svg")

fig.show()