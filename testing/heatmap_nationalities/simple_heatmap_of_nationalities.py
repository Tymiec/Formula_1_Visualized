import plotly.express as px
import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/heatmap_nationalities/nationalities_counted.csv")
# fig = px.choropleth(df, locations="country_code",
#                     color="value", # lifeExp is a column of gapminder
#                     hover_name="country_code", # column to add to hover information
#                     color_continuous_scale=px.colors.sequential.YlOrRd)

fig = px.choropleth(df, locations="country_code",
                    # animation_frame="year", #TODO: dodać/włączyć animację według roku po zrobieniu csvki co dany rok
                    color="value", # lifeExp is a column of gapminder
                    hover_name="country_code", # column to add to hover information
                    color_continuous_scale=px.colors.sequential.YlOrRd,
                    projection="orthographic")

fig.show()