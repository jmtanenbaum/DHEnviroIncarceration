// Global variables
let map;
let lat = 38.5816;
let lon = -121.4944;
let zl = 6;
let path = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_4ZPtBXvaVqamLlQTgNZp9-3pcJakjqoT6mDbsF4wL-wb2qRCMsx0jT-1vqtP7PKy6p_oXJNqtA4k/pub?gid=0&single=true&output=csv";
let enviroShapePath = "https://raw.githubusercontent.com/jmtanenbaum/DHEnviroIncarceration/main/leaflet/data/CES3Results.json";
let markers = L.featureGroup();
let prisondata;
//create layergroups
let prisonMarkers = L.layerGroup();
let enviroPolys;

//Shape Style Test Code 
var myStyle = {
    "color": "#ff7800",
    "weight": 1,
    "opacity": 0.65
};

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
	//JSON waits for web
	loadJSONFile(); 
		
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
						
			prisondata = data;

            //call map
			mapCSV(data);

		}
	});
}

function shapesLoaded() {
	//when file is ready, read it 
	if (this.readyState == 4 && this.status == "200") { //check file is good 
		enviroShape = JSON.parse(this.responseText); //convert file into js

		enviroPolys = L.geoJSON(enviroShape,{
			style: myStyle
		})
		enviroPolys.addTo(map);	//apply style settings and add shapes to map
		//create layers
		let layers = {
			"Prison Locations": prisonMarkers,
			"Environmental Risks": enviroPolys
		}

		//layer controls
		L.control.layers(null,layers).addTo(map)

		//add layergroups to map 
		prisonMarkers.addTo(map)

	}
}

//function to read json data from html
function loadJSONFile() {   
	//for code to interact with file on server
    var xmlobj = new XMLHttpRequest();

	//prepare file from server to be read
    xmlobj.open('GET', enviroShapePath, true); 

	// when the webpage is ready, call shapesLoaded
    xmlobj.onreadystatechange = shapesLoaded;

    xmlobj.send();  //sends request
}

function mapCSV(data){
	
	//clear layers in case calling more than once
	markers.clearLayers();
	
	// circle options
	let circleOptions = {
		radius: 4,
		weight: 1,
		color: 'white',
		fillColor: 'red',
		fillOpacity: 1
	}
    //loop
    prisondata.data.forEach(function(item,index){
        
		// marker create
		let marker = L.circleMarker([item.Latitude,item.Longitude],circleOptions)
		.on('mouseover',function(){
			this.bindPopup(`${item['County / Name of Facility']} <br> Prison Population:
			${item['Resident Population (On February 1st, 2020)']}`).openPopup()
		})

		// add marker to featuregroup
		markers.addLayer(marker)
		
		//add to layergroup
		prisonMarkers.addLayer(marker)
    }) 

	// add featuregroup to map
	// markers.addTo(map)
	
	// fit map to markers 
	map.fitBounds(markers.getBounds())	
}

function panToImage(index){
	map.setZoom(4);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);
	map.openPopup(marker)
}
