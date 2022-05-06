from email.policy import default
import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html, Input, Output
from dash.dependencies import Input, Output
import plotly.graph_objects as go

# Ładujemy naszą csvke
#TODO: Z niewiadomych przyczyn pd.read_csv działa u mnie tylko dla linków file:///D:/Repo/Wizualizacja_projekt/testing/testy_races/lap_times.csv
races = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/lap_times_named.csv")
races = races.sort_values(by="lap") # Sortujemy dla pewności

races2 = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/results_modified_named_by_tymek_messy.csv")

heatmap = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/heatmap_nationalities/nationalities_counted.csv")
# fig = px.choropleth(df, locations="country_code",
#                     color="value", # lifeExp is a column of gapminder
#                     hover_name="country_code", # column to add to hover information
#                     color_continuous_scale=px.colors.sequential.YlOrRd)

# Tworzymy dashową apke
app = dash.Dash()

# Tutaj layout apki
app.layout = html.Div(children=[
    html.Header(children=[
        html.Div(children=[
            html.Div(children=[
                html.H1(children=[
                    '70 L',
                    html.Span(children='AT '),
                    'F',
                    html.Span(children='ORMUŁY '),
                    '1'
                ])
            ]),
            html.Span(className='stripes'),
            html.Span(className='stripes'),
            html.Span(className='stripes')
        ]),
        html.Nav(children=
            dcc.RadioItems(
                ['Czasy okrążeń', 'Pozycje w wyścigu', 'Kierowcy świata', 'Rankingi'],
                'Czasy okrążeń',
                id='graph_select'
            )
        )
    ]),
    html.Main(children=[
        dcc.Graph(id='graph'),
        html.Nav(children=[
            html.Div(children=[
                html.Label(children='RaceId'),
                dcc.Input(id="race-dropdown", type='number', min=1, max=1096, value=1069, placeholder='raceId')
            ]),
            dcc.RadioItems(
                ['drivers', 'constructors'],
                'drivers',
                id='graph_type',
                inline=True
            ),
        ]),
    ])
])

@app.callback(
    Output(component_id="graph", component_property="figure"),
    Input('graph_select', 'value'),
    Input(component_id="race-dropdown", component_property="value"),
    Input('graph_type', 'value')
)

def display_graph(selected_graph, selected_race, graph_type):
    match selected_graph:
        case 'Czasy okrążeń':
            filtered_races = races[races["raceId"] == selected_race]

            line_fig = px.line(
                filtered_races, 
                x="lap", y="milliseconds", 
                color="DriverName2", 
                labels={"DriverName2" : "Driver"},
                markers=False, 
                template='plotly_dark',
                title=f"Lap times in race number: {selected_race}",
            )

            return line_fig
        case 'Pozycje w wyścigu':
            filtered_races = races[races["raceId"] == selected_race]

            line_fig = px.line(
                filtered_races, 
                x="lap", y="position", range_y=(20,0), # na sztywno odwrócona oś Y
                color="DriverName2", 
                labels={"DriverName2" : "Driver"},
                markers=True, 
                line_shape="linear", 
                template='plotly_dark',
                title=f"Position change by lap in race: {selected_race}",
            )

            return line_fig
        case 'Kierowcy świata':
            filtered_races = races[races["raceId"] == selected_race]
            fig = go.Figure(
                data=px.choropleth(
                    heatmap,
                    locations="country_code",
                    # animation_frame="year", #TODO: dodać/włączyć animację według roku po zrobieniu csvki co dany rok
                    color="value",  # lifeExp is a column of gapminder
                    hover_name="country_code",  # column to add to hover information
                    color_continuous_scale="Reds",
                    projection="orthographic",
                    template='plotly_dark',
                ), layout=go.Layout(geo=dict(bgcolor='rgba(0,0,0,0)'),
                                    title='The Cities Sold the Most Product',
                                    font={"size": 9, "color": "White"},
                                    titlefont={"size": 15, "color": "White"},
                                    geo_scope='usa',
                                    margin={"r": 0, "t": 40, "l": 0, "b": 0},
                                    paper_bgcolor='#4E5D6C',
                                    plot_bgcolor='#4E5D6C',
                                    )
            )

            return fig
        case 'Rankingi':
            if(graph_type == 'drivers'):
                filtered_races = races2[races2["year"] == selected_race]
                filtered_races = filtered_races.sort_values(by="raceId")
                filtered_races['csum'] = filtered_races.groupby(['driverId'])['points'].cumsum()

                line_fig = px.line(
                    filtered_races, 
                    x="raceId", y="csum", 
                    color="surname",
                    labels={"surname" : "Driver","csum" : "Championship points"}, 
                    markers=False, 
                    template='plotly_dark',
                    title=f"Driver standings in {selected_race}"
                )

                return line_fig
            if(graph_type == 'constructors'):
                filtered_races = races2[races2["year"] == selected_race]
                filtered_races = filtered_races.sort_values(by="raceId")
                filtered_races['csum'] = filtered_races.groupby(['constructorId'])['points'].cumsum()
                filtered_races = filtered_races.drop_duplicates(subset = ['constructorId','raceId'] , keep = 'last')

                line_fig = px.line(
                    filtered_races, 
                    x="raceId", y="csum", 
                    color="constructor",
                    labels={"constructor" : "Constructor","csum" : "Championship points"}, 
                    markers=False, 
                    template='plotly_dark',
                    title=f"Constructor standings in {selected_race}"
                )
                
                return line_fig


# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)