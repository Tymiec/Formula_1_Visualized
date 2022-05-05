import plotly.express as px
import pandas as pd

df = pd.read_csv(r"D:\Repo\Wizualizacja_projekt\testing\heatmap_narodowosci\nationalities_counted.csv")
fig = px.choropleth(df, locations="country_code",
                    color="value", # lifeExp is a column of gapminder
                    hover_name="country_code", # column to add to hover information
                    color_continuous_scale=px.colors.sequential.Plasma)
fig.show()