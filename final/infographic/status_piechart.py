import plotly.express as px
import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/status_over_years.csv")
df = df.loc[df["Tabela9.Rok"]==2022]
fig = px.pie(df,
             values="rsum", 
             names="Status", 
             hole=.3,
             title="Złośliwość rzeczy martwych i nie tylko",
             labels="Status")
fig.update_traces(textposition='inside', textinfo='percent+label')

fig.show()