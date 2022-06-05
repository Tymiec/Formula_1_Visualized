#%%
import pandas as pd

df = pd.read_csv('https://raw.githubusercontent.com/Tymiec/Formula_1_Visualized/master/sources/modified/lap_tunes_named_3.csv')

#%%
years = []

for year in df.year.unique():
    years.append(df[ df['year'] == year ])

#%%
GPs = []

for year_df in years:
    for GP in year_df.name_x.unique():
        GPs.append(year_df[ year_df['name_x'] == GP ])

#%%
for GPs_df in GPs:
    GPs_df_export = GPs_df.drop(columns=['year', 'name_x', 'raceId'])
    GPs_df_export.to_csv('GPs/' + str(GPs_df.year.unique()[0]) + ' ' + str(GPs_df.name_x.unique()[0]) + '.csv', index=False)

# %%
