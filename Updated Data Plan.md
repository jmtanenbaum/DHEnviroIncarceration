# Our Data Sets
1. [COVID Behind Bars](https://docs.google.com/spreadsheets/d/1X6uJkXXS-O6eePLxw2e4JeRtM41uPZ2eRcOA_HkPVTk/edit#gid=1197647409)
2. [California Environmental Conditions](https://data.ca.gov/dataset/calenviroscreen-3-0-results)

# Our Plan 
The COVID Behind Bars data provides the latitude and longitude of prisons, jails, and detention centers in the US. We will be using the csv file to plot markers 
for the prisons, jails, and detention centers in California. Because the CSV file contains data from all 50 states, we will need to first filter the data so that only California data is used. We will also use the occupancy of each facility as of February 2020 and the type of facility data from this csv. We are choosing a point before Covid-19 releases because our other data set is from 2019, before the onset of the pandemic and at a higher point of overcrowding. When users click on each facility on the map, they will be able to see the population data and type of facility. We will also implement a filter by type of facility, ie state or federal. 

The Cal Environmental data contains information by city and county on different environmental risk factors up to 2019. CalEnviroScreen uses environmental, health, and socioeconomic information to measure environmental justice impacts across the state, specifically by census tracts. The cumulative impact score measures “exposures and public health or environmental effects from all sources of pollution in a geographic area” and is a useful way to see the correlation between mass incarceration and environmental injustice. We will be applying the shapefile of this data to our map to provide dynamic visuals of the different environmental risks included in this dataset, such as Air Quality and Groundwater Threats. If we find any matches we will map the Toxic Releases from Facilities data to the institutions. 

We will use this plugin to import convert the shapefile to geojson. https://github.com/calvinmetcalf/shapefile-js Next, this plugin will let us import it into leaflet. 
https://github.com/calvinmetcalf/leaflet.shapefile It also might require Catiline. https://github.com/calvinmetcalf/catiline 
