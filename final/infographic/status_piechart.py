import plotly.express as px
import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/heatmap_nationalities/nationalities_counted.csv")

fig = px.pie(df,
             values="value", 
             names="status", 
             hole=.3,
             title="Złośliwość rzeczy martwych i nie tylko",
             labels="country_code")
fig.update_traces(textposition='inside', textinfo='percent+label')

fig.show()