import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html, Input, Output
from dash.dependencies import Input, Output

# Ładujemy naszą csvke

races = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/results_modified_named_by_tymek_messy_2.csv")
#races = races.sort_values(by="lap") # Sortujemy dla pewności


# Tworzymy dashową apke
app = dash.Dash()

# Tutaj layout apki
app.layout = html.Div(children=[
    html.H1(children="F1 Visualized"), 
    dcc.Dropdown(id="race-dropdown",
                 options=[{"label": i, "value": i} for i in races["year_x"].unique()],
                 value="2021",
                 style={"background-color" : "#ff0"}, 
                 ),
    dcc.Graph(id="driver_standings")
], style={"background-color" : "#ff0"})

# Set up the callback function

@app.callback(
    Output(component_id="driver_standings", component_property="figure"),
    Input(component_id="race-dropdown", component_property="value")
)
def update_graph(selected_race):
    filtered_races = races[races["year_x"] == selected_race]
    filtered_races = filtered_races.sort_values(by="raceId")
    filtered_races['csum'] = filtered_races.groupby(['driverId'])['points'].cumsum()
    line_fig = px.line(filtered_races, 
    x="raceId", y="csum", 
    color="surname",
    labels={"surname" : "Driver","csum" : "Championship points", "raceId" : "Race number in the season"}, 
    markers=False, 
    height=900, 
    template='plotly_dark',
    title=f"Driver standings in {selected_race}")
    return line_fig

# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)