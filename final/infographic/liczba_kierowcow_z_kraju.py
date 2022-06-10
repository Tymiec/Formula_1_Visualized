import plotly.express as px
import pandas as pd

df = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/nationalities_with_country_no_zeroes.csv")
df = df.sort_values(by="Year")
# print(df)
# fig = px.choropleth(df, locations="country_code",
#                     color="value", # lifeExp is a column of gapminder
#                     hover_name="country_code", # column to add to hover information
#                     color_continuous_scale=px.colors.sequential.YlOrRd)

fig = px.choropleth(df, locations="Country",
                    locationmode = 'country names',
                    animation_frame="Year",
                    color="Liczba_kierowcow", # lifeExp is a column of gapminder
                    hover_name="Country", # column to add to hover information
                    color_continuous_scale=px.colors.sequential.YlOrRd,
                    # projection="orthographic"
                    )

fig.show()