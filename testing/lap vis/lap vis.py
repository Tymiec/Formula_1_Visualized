from email.policy import default
import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html, Input, Output
from dash.dependencies import Input, Output

# Ładujemy naszą csvke
races = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/lap_times_named.csv")
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
        html.Div(children=[
            html.Canvas(width=1000, height=1000, id='track'),
            html.Canvas(width=1000, height=1000, id='driver'),
        ], className='wrapper'),
        html.Nav(children=[
            html.Div(children=[
                html.Label(children='Rok'),
                dcc.Input(type='number', min='1950', max='2022', step='1', placeholder='Rok wyścigu', value='2009')
            ], id='yearSelector'),
            html.Div(children=[
                html.Label(children='Tor'),
                html.Select(children=[

                ])
            ], id='trackSelector'),
            html.Div(children=[
                html.Label(children='Prędkość symulacji'),
                dcc.Input(type='range', min='0', max='5', step='1', value='0'),
                html.Span(children='x1')
            ], id='speedSelector')
        ])
    ])
])

# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)