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
    html.H1(children="F1 Visualized"), 
    dcc.Dropdown(id="race-dropdown",
                 options=[{"label": i, "value": i} for i in races["raceId"].unique()],
                 value="1065",
                 style={"background-color" : ""}, 
                 ),
    dcc.Graph(id="lap-times-graph")
], style={"background-color" : ""})

# Set up the callback function

@app.callback(
    Output(component_id="lap-times-graph", component_property="figure"),
    Input(component_id="race-dropdown", component_property="value")
)
def update_graph(selected_race):
    filtered_races = races[races["raceId"] == selected_race]
    line_fig = px.line(filtered_races, 
    x="lap", y="position", range_y=(20,0), # na sztywno odwrócona oś Y
    color="DriverName2", 
    labels={"DriverName2" : "Driver"},
    markers=True, 
    height=900,
    line_shape="spline", 
    template='plotly_dark',
    title=f"Zmiany pozycji na poszczególnych okrążeniach: {selected_race}")
    return line_fig
# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)