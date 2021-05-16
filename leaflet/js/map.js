// Global variables
let map;
let lat = 38.5816;
let lon = -121.4944;
let zl = 6;
let path = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_4ZPtBXvaVqamLlQTgNZp9-3pcJakjqoT6mDbsF4wL-wb2qRCMsx0jT-1vqtP7PKy6p_oXJNqtA4k/pub?gid=0&single=true&output=csv";
let enviroShapePath = "https://raw.githubusercontent.com/jmtanenbaum/DHEnviroIncarceration/main/leaflet/data/CES3Results.json";
let markers = L.featureGroup();
let markersLayer = L.featureGroup();
let legend = L.control({position: 'bottomright'});
let prisondata;
let brew = new classyBrew();
let fieldToMap; //brew fields
//create layergroups
let prisonMarkers = L.layerGroup();
let pollPolys;
let gwPolys;


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

//classybrew function
function refillLayers(field) {
	// clear layers in case it has been mapped already
	if (gwPolys){
		gwPolys.clearLayers()
	}
	if (pollPolys){
		pollPolys.clearLayers()
	}
	
	// globalize the field to map
	fieldToMap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	
}

//load up the choropleth layers
function shapesLoaded() {
	//when file is ready, read it 
	if (this.readyState == 4 && this.status == "200") { //check file is good 
		enviroShape = JSON.parse(this.responseText); //convert file into js

		//add Groundwater Threat poly layer
		gwPolys = L.geoJSON(enviroShape,{
			style: colorEnviroGW
		})
		gwPolys.addTo(map);

		//add Pollution poly layer
		pollPolys = L.geoJSON(enviroShape,{
			style: colorEnviroPollu
		})
		pollPolys.addTo(map);
		
		//create layers
		let layers = {
			"Prison Locations": prisonMarkers, 
			"Groundwater Threats": gwPolys,
			"Pollution": pollPolys
		}

		//layer controls
		L.control.layers(null,layers).addTo(map)

		//add layergroups to map 
		prisonMarkers.addTo(map)

		refillLayers('')

	}
}

//return color based on percent of Groundwater Threats 
function colorEnviroGW(poly) {
	var GW_pctl = poly.properties.GW_pctl
	if ( GW_pctl > 74.99) {
		return {color: "#0014ff",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( 74.99 >= GW_pctl > 49.99) {
		return {color: "#2d3dff",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( 49.99 >= GW_pctl > 24.99) {
		return {color: "#5b67ff",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( GW_pctl <= 24.99 ) {
		return {color: "#7681ff",
				weight: "1",
				fillOpacity: 0.65}
	}
	else {
		return {
			opacity: 0
		}
	}
}

//return color based on Pollution percentiles 
function colorEnviroPollu(poly) {
	var Poll_pctl = poly.properties.Poll_pctl
	if ( Poll_pctl > 74.99) { 
		return {color: "#ff3100",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( 74.99 >= Poll_pctl > 49.99) {
		return {color: "#ff4e25",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( 49.99 >= Poll_pctl > 24.99) {
		return {color: "##ff7454",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( Poll_pctl <= 24.99 ) {
		return {color: "#ffa793",
				weight: "1",
				fillOpacity: 0.65}	
	}
	else {
		return {
			opacity: 0
		}
	}
}

// legend settings
function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(from) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
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
		fillColor: 'black',
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

	// create the legend
	createLegend();

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
