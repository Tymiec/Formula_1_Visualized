import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html, Input, Output
from dash.dependencies import Input, Output

# Tworzymy dashową apke
app = dash.Dash()

# Tutaj layout apki
app.layout = html.Div(children=[
    html.Header(children=[
        html.Div(children=[
            html.Div(children=
                html.H1(children=[
                    '70 L',
                    html.Span(children='AT '),
                    'F',
                    html.Span(children='ORMUŁY '),
                    '1'
                ])
            ),
            html.Span(className='stripes'),
            html.Span(className='stripes'),
            html.Span(className='stripes')
        ]),
        html.Nav(children=
            html.Ul(children=[
                html.Li(children='Lorem Ipsum'),
                html.Li(children='Lorem Ipsum'),
                html.Li(children='Lorem Ipsum'),
                html.Li(children='Lorem Ipsum'),
                html.Li(children='Lorem Ipsum')
            ])
        )
    ])
])

# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)
