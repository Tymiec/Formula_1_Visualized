import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html, Input, Output
from dash.dependencies import Input, Output

# Ładujemy naszą csvke
races = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/winners.csv")
#races = races.sort_values(by="lap") # Sortujemy dla pewności


# Tworzymy dashową apke
app = dash.Dash()

# Tutaj layout apki
app.layout = html.Div(children=[
    html.H1(children="F1 Visualized"), 
    dcc.RadioItems(
                ['drivers', 'constructors'],
                'drivers',
                id='graph_type',
                inline=True
                ),
    dcc.Graph(id="driver_standings")
], style={"background-color" : "#ff0"})

# Set up the callback function

@app.callback(
    Output(component_id="driver_standings", component_property="figure"),
    Input(component_id='graph_type' , component_property='value')
)
def update_graph(graph_type):
    print(graph_type)
    if(graph_type == 'drivers'):
        winners = races['name_and_surname'].value_counts()
        print(winners)
        fig = px.bar(winners)
        return fig
    if(graph_type == 'constructors'):
        winners = races['constructor'].value_counts()
        print(winners)
        fig = px.bar(winners)
        return fig

# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)