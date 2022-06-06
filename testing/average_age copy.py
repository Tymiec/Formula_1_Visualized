import pandas as pd
import plotly.express as px

df = pd.read_csv(r'C:\Repo_v1\Formula_1_Visualized\avgage.csv')

fig = px.line(df, x="year", y="Age", line_shape="spline", render_mode="svg")
fig.show()