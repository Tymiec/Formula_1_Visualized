# Projekt "Formula 1 Visualized " 
> Autorzy: Tymiec, Michalinh0, WiśniaN7

## Cel projektu

Stworzenie strony internetowej które zwizualizuje 70 lat Formuły 1.

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
Graf --> Przyciski[Opcji wyboru] --> Merge
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
```

> Zaktualizowano 02.05.2022
