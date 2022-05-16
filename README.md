# Projekt "Formula 1 Visualized " 
> Autorzy: Tymiec, Michalinh0, WiśniaN7

## Cel projektu

Stworzenie strony internetowej które zwizualizuje 70 lat Formuły 1.

Proponowane wizualizacje:
- [x] Graf pokazujący zmiany czasów według okrążenia (lap_times_graph)
- [x] Graf pokazujący zmiany pozycji według okrążenia (position_graph)
- [X] Graf pokazujący liczbę punktów kierowców w czasie sezonu
- [X] Graf pokazujący liczbę punktów zespołu w czasie sezonu
- [ ] Animacja pokazująca pozycje na torze w czasie wyścigu
- [ ] Pit stopy na danym wyścigu
- [ ] Czasy kwalifikacji dla danego wyścigu z podziałem na Q1/Q2/Q3
- [ ] Heatmap jako mapa świata pokazujący w czasie ile wyścigów odbyło się w danym kraju
- [ ] Heatmap jako mapa świata pokazujący w czasie ile wyścigów odbyło się na danym kontynencie
- [ ] Heatmap/Graf ilości kierowców z danego kraju
- [ ] Graf/PieChart dla danego wyścigu/sezonu/całych 70 lat pokazujący statusId czyli czy ktoś skończył czy nie skończył a jeśli nie skończył to dlaczego nie skończył
- [ ] Ilość punktów zdobywana przez kierowcę co sezon
- [ ] Suma okrążeń przejechanych przez kierowcę od początku kariery i pokazywać wszystkich kierowców 
- [ ] Graf pokazujący średni wiek kierowców w danym sezonie (?)

<!-- 
Odrzucone propozycje:
- [ ] Najszybsze okrążenia na danym torze w ciągu 70 lat 
-->

## Foldery
Sources:
 - Czysty kod z neta
 - Czyste bazy danych
 - Grafiki bazowe

Testing:
 - Testy działania Dash Plotly (Tymiec) 

 ## Roadmap

```mermaid
%%{init: {'theme': light 'base', 'themeVariables': { 'primaryColor': '#ffcccc', 'edgeLabelBackground':'#ffffee', 'tertiaryColor': '#fff0f0'}}}%%
graph 
Start1[Wybór Tematu] -- F1--> Koncept
Koncept --> Wybor
Koncept --> Podzial
Koncept --> Plany[Zaplanowanie prac] --> Start_prac
Wybor[Wybór języka programowania] -- Python --> Wybor2[Wybór biblioteki]-- Plotly -->Start_prac
Podzial[Podział ról] --> Start_prac
Start_prac[Start prac]
Start_prac --> Graf[Pierwsze dwa grafy]
Start_prac --> Strona[Odsłona wizualna V1] --> Merge
Graf --> Przyciski[Opcje wyboru] --> Merge
Merge[Połączenie progresu V2]
Merge --> Grafy_dodanie[Pozostałe wizualizacje]
Grafy_dodanie --> Grafiki[Grafy]--> Debugowanie
Grafy_dodanie --> Heatmapy[Heat mapy]--> Debugowanie
Grafy_dodanie --> Porownania[Porównania szczegółowe]--> Debugowanie
Debugowanie --> Merge2
Merge --> Wiz2[Prace nad wyglądem] --> Merge2
Merge --> PBoczny[Panel boczny] --> Merge2
Merge2[Odsłona wizualna V3]
Merge2 --> Testy[Testy projektu]
Testy --> Finish[Przedstawienie projektu]

subgraph Zrobione
 Start1
 Koncept
 Start_prac
 Podzial
 Wybor2
 Plany
 Wybor
 Graf
 Przyciski
 Strona
 Merge
end

style Merge fill:#32751B
style Start1 fill:#32751B
style Koncept fill:#32751B
style Start_prac fill:#32751B
style Podzial fill:#32751B
style Wybor2 fill:#32751B
style Plany fill:#32751B
style Wybor fill:#32751B
style Graf fill:#32751B
style Przyciski fill:#32751B
style Strona fill:#32751B
```

> Zaktualizowano 04.05.2022
