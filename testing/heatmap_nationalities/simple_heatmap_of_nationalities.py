import plotly.express as px
import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/heatmap_nationalities/nationalities_counted.csv")
fig = px.choropleth(df, locations="country_code",
                    color="value", # lifeExp is a column of gapminder
                    hover_name="country_code", # column to add to hover information
                    color_continuous_scale=px.colors.sequential.YlOrRd)
fig.show()