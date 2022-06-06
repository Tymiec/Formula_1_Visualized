import plotly.express as px
import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/heatmap_nationalities/nationalities_counted.csv")

fig = px.pie(df,
    values="value", 
    names="country_code", 
    hole=.3,
    title="Narodowości Formuły 1",
    labels="country_code")
fig.update_traces(textposition='inside', textinfo='percent+label')

fig.show()