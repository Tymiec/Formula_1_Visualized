
import dash
import pandas as pd
import plotly.express as px
from dash import dcc, html, Input, Output
import plotly.graph_objects as go

# Ładujemy naszą csvke
races = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/lap_times_named.csv")
races = races.sort_values(by="lap") # Sortujemy dla pewności

races2 = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/results_modified_named_by_tymek_messy.csv")

heatmap = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/nationalities_with_country.csv")
heatmap = heatmap.sort_values(by="Year")

nationalities = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/testing/heatmap_nationalities/nationalities_counted.csv")

winners = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/winners.csv")

finish = pd.read_csv("https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/status_over_years.csv")
finish = finish.loc[finish["Tabela9.Rok"]==2022]
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
        ]),  #TODO: Dodać switch'a na przełączanie pomiędzy erami, latami
        html.Nav(children=
            dcc.RadioItems(
                ['Czasy okrążeń', 'Pozycje w wyścigu', 'Rankingi',  'Kierowcy świata', 'Narodowości', 'Zwyciężcy', 'Finisze'],
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
                dcc.Input(id="universal_input", type='number', min=1, max=1096, value=1069, placeholder='raceId')
            ]),
            dcc.RadioItems(
                ['drivers', 'constructors'],
                'drivers',
                id='graph_type',
                inline=True
            ),
        ]),
    ]),
    html.Section()
])

@app.callback(
    Output(component_id="graph", component_property="figure"),
    Input('graph_select', 'value'),
    Input(component_id="universal_input", component_property="value"),
    Input('graph_type', 'value')
)

def display_graph(selected_graph, selected_race, graph_type):
    match selected_graph:
        case 'Czasy okrążeń':
            filtered_races = races[races["raceId"] == selected_race]

            line_fig = px.line(
                filtered_races, 
                x="lap", y="milliseconds", #TODO: Zmienić milisekundy na timedelte
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
        case 'Kierowcy świata': #FIXME: trzeba to dodać jako osobny case albo coś bo zostaje opis do wybranego wyścigu
            fig = go.Figure(
                data = px.choropleth(
                    heatmap, 
                    locations="Country",
                    locationmode='country names',
                    animation_frame="Year",
                    color="Liczba_Kierowców",  # lifeExp is a column of gapminder
                    hover_name="Country",  # column to add to hover information
                    color_continuous_scale="Reds",
                    # projection="orthographic",
                    template='plotly_dark',
                ), layout=go.Layout(
                    geo=dict(bgcolor='rgba(0,0,0,0)'),
                    title='Kierowcy Świata',
                    font={"size": 9, "color": "White"},
                    titlefont={"size": 15, "color": "White"},
                    margin={"r": 0, "t": 40, "l": 0, "b": 0},
                    paper_bgcolor='#4E5D6C',
                    plot_bgcolor='#4E5D6C',
                )
            )

            return fig
        case 'Narodowości':
            fig = px.pie(nationalities,
                values="value",
                names="country_code",
                hole=.3,
                title="Narodowości Formuły 1",
                labels="country_code",
                template='plotly_dark',
            )

            fig.update_traces(textposition='inside', textinfo='percent+label')

            return fig
        case 'Finisze':
            fig = px.pie(
                finish,
                values="rsum",
                names="Status",
                hole=.3,
                title="Złośliwość rzeczy martwych i nie tylko",
                labels="Status",
                template='plotly_dark',
            )

            fig.update_traces(textposition='inside', textinfo='percent+label')

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
        case 'Zwyciężcy':
            if(graph_type == 'drivers'):
                winners2 = winners['Name_and_surname'].value_counts()
                fig = px.bar(
                    winners2,
                    template='plotly_dark',
                )
                return fig
            if(graph_type == 'constructors'):
                winners2 = winners['constructor'].value_counts()
                fig = px.bar(
                    winners2,
                    template='plotly_dark',
                )
                return fig

            return fig


# Run local server

if __name__ == "__main__":
    app.run_server(debug=True)