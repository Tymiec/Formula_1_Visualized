from email.policy import default
import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html, Input, Output
from dash.dependencies import Input, Output

# Ładujemy naszą csvke
#TODO: Z niewiadomych przyczyn pd.read_csv działa u mnie tylko dla linków file:///D:/Repo/Wizualizacja_projekt/testing/testy_races/lap_times.csv
races = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/lap_times_named.csv")
races = races.sort_values(by="lap") # Sortujemy dla pewności

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
                ['Lorem ispum1', 'Lorem ispum2', 'Lorem ispum3', 'Lorem ispum4', 'Lorem ispum5'],
                'Lorem ispum1',
                id='graph_select'
            )
        )
    ]),
    html.Main(children=[
        dcc.Graph(id='graph')
    ])
])

@app.callback(
    Output(component_id="graph", component_property="figure"),
    Input('graph_select', 'value')
)

def display_graph(selected_graph):
    match selected_graph:
        case 'Lorem ispum1':
            filtered_races = races[races["raceId"] == 1069]
            line_fig = px.line(
                filtered_races, 
                x="lap", y="milliseconds", 
                color="DriverName2", 
                labels={"DriverName2" : "Driver"},
                markers=False, 
                template='plotly_dark',
                title=f"Lap times in race number: {1069}"
            )
            return line_fig
        case _:
            filtered_races = races[races["raceId"] == 1069]
            line_fig = px.line(
                filtered_races, 
                x="lap", y="position", range_y=(20,0), # na sztywno odwrócona oś Y
                color="DriverName2", 
                labels={"DriverName2" : "Driver"},
                markers=True, 
                line_shape="linear", 
                template='plotly_dark',
                title=f"Position change by lap in race: {1069}"
            )
            return line_fig


# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)