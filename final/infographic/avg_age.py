import pandas as pd
import plotly.express as px

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/avgage.csv")

fig = px.line(df, x="year", y="val", color='type', line_shape="spline", render_mode="svg")
fig.show()