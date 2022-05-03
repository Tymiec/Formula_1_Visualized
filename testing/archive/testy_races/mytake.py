# Solution to line plot challenge.
# Changes made to code lines: 22, 30-32, 50, 56, 59-68

import pandas as pd
import plotly.express as px  # (version 4.7.0)

import dash  # (version 1.12.0) pip install dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output

app = dash.Dash(__name__)

# ------------------------------------------------------------------------------
# Import and clean data (importing csv into pandas)
df = pd.read_csv("D:\Repo\Wizualizacja_projekt\testing\testy_races\lap_times.csv")

df = df.groupby(['State', 'ANSI', 'raceId', 'Year', 'state_code'])[['Pct of Colonies Impacted']].mean()
df.reset_index(inplace=True)

lap = list(range(1, 88))

# ------------------------------------------------------------------------------
# App layout
app.layout = html.Div([

    html.H1("Web Application Dashboards with Dash", style={'text-align': 'center'}),

    dcc.Dropdown(id="select_lap",
                 options=[{"label": x, "value":x} for x in lap],
                 value="1",
                 multi=False,
                 style={'width': "40%"}
                 ),

    html.Div(id='output_container', children=[]),
    html.Br(),

    dcc.Graph(id='my_bee_map', figure={})

])


# ------------------------------------------------------------------------------
# Connect the Plotly graphs with Dash Components
@app.callback(
    [Output(component_id='output_container', component_property='children'),
     Output(component_id='my_bee_map', component_property='figure')],
    [Input(component_id='select_lap', component_property='value')]
)
def update_graph(option_slctd):
    print(option_slctd)
    print(type(option_slctd))

    container = "The bee-killer chosen by user was: {}".format(option_slctd)

    dff = df.copy()
    dff = dff[dff["raceId"] == option_slctd] #Affected by -> RaceID
    dff = dff[(dff["driverID"] == "20") | (dff["driverID"] == "1") | (dff["driverID"] == "17")]

    fig = px.line(
        data_frame=dff,
        x='lap',
        y='time',
        color='driverID',
        template='plotly_dark'
    )

    return container, fig


# ------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run_server(debug=True)

# TODO: zmienic zmienne, sprawdzic czy lapy jako inty działają jako select lap w ostatecznej wersji