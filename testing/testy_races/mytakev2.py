# import dash_html_components as html
# import dash_core_components as dcc
import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html, Input, Output
from dash.dependencies import Input, Output

# Ładujemy naszą csvke
races = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/lap_times.csv")
races = races.sort_values(by="lap")
#FIXME: Z niewiadomych przyczyn pd.read_csv działa u mnie tylko dla linków file:///D:/Repo/Wizualizacja_projekt/testing/testy_races/lap_times.csv

# Tworzymy dashową apke
app = dash.Dash()

# Tutaj layout apki
app.layout = html.Div(children=[
    html.H1(children="Czasy okrążeń"), 
    dcc.Dropdown(id="race-dropdown",
                 options=[{"label": i, "value": i} for i in races["raceId"].unique()],
                 value="1",
                 ),
    dcc.Graph(id="lap-times-graph")#TODO: przerobić tak aby zajmował 50% wysokości strony
])

# Set up the callback function

@app.callback(
    Output(component_id="lap-times-graph", component_property="figure"),
    Input(component_id="race-dropdown", component_property="value")
)
def update_graph(selected_race):
    filtered_races = races[races["raceId"] == selected_race]
    line_fig = px.line(filtered_races, x="lap", y="milliseconds", color="driverId", markers=False, template='plotly_dark', title=f"Lap times in race number {selected_race}")
    return line_fig
#FIXME: z niewiadomych przyczyn wykres jest nieczytelny, a w sumie to z wiadomych, trzeba po prostu go zwiększyć na całą stronę i będzie dobrze

# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)