# DHEnviroIncarceration

# Introduction
Our team's name is Environmental Racism in Carceral California. We will be focusing on investigating the relationship between mass incarceration in California and environmental racism using 2018 data from CalEnviroScreen,  UCLA's Covid Behind Bars, and our own research. 

# Team Members
Hannah Lien: Leaflet technical lead
Hannah (she/her) is a second year Master of Library and Information Sciences student with a BA in English. Before coming to UCLA, she worked in web content creation. She’s interested in learning more about coding and GIS and how these tools can help engage audiences with social issues.

<img src="https://raw.githubusercontent.com/hanarama/DH151/main/Photos/Hannah_Pic.jpg">

Julia Tanenbaum: Web Designer  
Julia (she/her) is a second year Master of Library and Information Sciences student who co-created the Rebel Archives in the Golden Gulag Project with the Freedom Archives and California Coalition for Women Prisoners. She is interested in the history of mass incarceration and abolitionist resistance in California.

<img src="https://user-images.githubusercontent.com/81833154/114326099-f72d5c00-9ae7-11eb-9810-108288df69e2.png"  width="250" height="250">


Lisa Kahn: Data Cleaner & Geocoder  
Lisa (she/her) is a second year Master of Library and Information Sciences student with a BA in History. She is interested in environmental justice and racial justice, and is excited to show how these separate crises are interconnected. Additionally, as a person looking to work as an Instructional Librarian or Archivist, she is looking to build skills that enliven and democratize historical resources to new audiences. 

<img src="https://scontent.xx.fbcdn.net/v/t1.15752-0/p403x403/126133095_374132144011379_6891948301111871349_n.jpg?_nc_cat=103&ccb=1-3&_nc_sid=f79d6e&_nc_ohc=E1dS_NpcLyoAX8lm7Qf&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&tp=6&oh=ef0a5eca1209e8ae83d222b0771628d0&oe=6098B545">

# Overview
# Our Data Sets
1. [COVID Behind Bars](https://docs.google.com/spreadsheets/d/1X6uJkXXS-O6eePLxw2e4JeRtM41uPZ2eRcOA_HkPVTk/edit#gid=1197647409)
  --> [Cleaned data set for California use (https://docs.google.com/spreadsheets/d/1c3hDs6m1iY5e3jKKdtiNYBWJbrvAHtZ6615qWFR-MTY/edit#gid=0)] 
2. [California Environmental Conditions](https://data.ca.gov/dataset/calenviroscreen-3-0-results)

# Our Plan 
The COVID Behind Bars data provides the latitude and longitude of prisons, jails, and detention centers in the US. We will be using the Google sheet to plot markers for the prisons, jails, and detention centers in California. Because the CSV file contains data from all 50 states, we first filtered the data so that only California data is used. Key value sets we used include the occupancy of each facility as of February 2020 and the name of each facility. We are choosing a point before Covid-19 releases because our other data set is from 2019, before the onset of the pandemic and at a higher point of overcrowding. When users click on each facility on the map, they will be able to see the population data and type of facility. We want each prison location marker to vary in size depending on how many people are incarcerated there. 

The Cal Environmental data contains information by city and county on different environmental risk factors up to 2019. CalEnviroScreen uses environmental, health, and socioeconomic information to measure environmental justice impacts across the state, specifically by census tracts. The cumulative impact score measures “exposures and public health or environmental effects from all sources of pollution in a geographic area” and is a useful way to see the correlation between mass incarceration and environmental injustice. We applied the shapefile of this data to our map to provide dynamic visuals of the different environmental risks included in this dataset, such as Air Quality and Groundwater Threats. If we find any matches we will map the Toxic Releases from Facilities data to the institutions. 

We converted the shapefile to geojson layers which then become polygons in leaflet. We shade the polygons to show the percentage of enviornmental hazards, with darker shades of a color signifying greater toxicity. 

# Methodology
Abolitionist geographer Ruth Wilson Gilmore reminds us that prisons are forgotten places, and the same goes for the communities that surround them. The abolitionist movement has recently focused on the environmental impact of mass incarceration, particularly in Central California, and struggled against both prisons and pollution. Web mapping is an ideal medium to illustrate these interlocking systems of violence and further the movement’s struggle.

# Workflow
| Week       | Task     |
| :------------- | :----------: |
|  2 | Complete Project Proposal   |
| 3   | Meet with GIS librarian and investigate how to import data into Leaflet |
| 4 | Geocode jail data, clean data for CA focus |
| 5 | User interface design, import data into Leaflet, add featured stories & about pages |
| 6 | [midterm presentation!] |
| 7 | Make search bar functionally integrated with map |
| 8 | Webpage design, likely still making map |
| 9 | Interactive features |
| 10 | Finalize |

# Technical Scope
Technologies that will be used include:  
HTML will establish the basic text and structure of the website, while CSS will elevate the web design, and Javascript will stylize the website design and boost interactivity
Leaflet will provide us with an opensource map technology foundation. The data from incarceration trends and Reuters is in csv format, and can be imported into leaflet using javascript. We will use the leaflet shapefile plugin here to import the California Environmental Screen data. From there, we will need javascript and html to edit the map. 
Github pages will host our website and we will also use git to track changes and work as a group. 

User Interface Plans: 
<br>
We are using bootstrap for the user interface to create a menu bar and the about page. The map itself contains a html and js based search bar that will allow us to search for a facility and layers for each geojson file of enviornmental hazards. We will add data for facilities that have been fined by the EPA or are toxic sites based on additional research. 
<br>
![image](https://user-images.githubusercontent.com/63215658/116908164-6e41a600-abf7-11eb-8ad6-d6a05ffeca88.png)
