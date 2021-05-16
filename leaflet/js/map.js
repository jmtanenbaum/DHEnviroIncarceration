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
//create layergroups
let prisonMarkers = L.layerGroup();
let prisonpop; //TO CHANGE MARKER SIZE ACC TO PRISON POPULATION
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

			//get prison population and put in global variable
			prisonpop = prisondata.meta.fields[prisondata.meta.fields.length-10];

            //call map
			mapCSV(prisonpop);

		}
	});
}

//classybrew function
function refillLayers() {
	// clear layers in case it has been mapped already
	if (gwPolys){
		gwPolys.clearLayers()
	}
	if (pollPolys){
		pollPolys.clearLayers()
	}
	
	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	enviroShape.features.forEach(function(item,index){
		values.push(item.properties["GW_pctl"])
	})
	enviroShape.features.forEach(function(item,index){
		values.push(item.properties["Poll_pctl"])
	})

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(5);
	brew.setColorCode('YlOrRd');
	brew.classify('quantiles');

	// create the layer and add to map
	gwPolys = L.geoJson(enviroShape, {
		style: gwStyle //call a function to style each feature
	}).addTo(map);

	pollPolys = L.geoJson(enviroShape, {
		style: pollStyle //call a function to style each feature
	}).addTo(map);

	//remove from map
	toggleLayers.remove();

	//create layers
	let layers = {
		"Prison Locations": prisonMarkers, 
		"Groundwater Threats": gwPolys,
		"Pollution": pollPolys
	}

	//layer controls
	toggleLayers = L.control.layers(null,layers).addTo(map);
}

function gwStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties["GW_pctl"]),
		fillOpacity: 0.8
	}
}

function pollStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: brew.getColorInRange(feature.properties["Poll_pctl"]),
		fillOpacity: 0.8
	}
}

//load up the choropleth layers
function shapesLoaded() {
	//when file is ready, read it 
	if (this.readyState == 4 && this.status == "200") { //check file is good 
		enviroShape = JSON.parse(this.responseText); //convert file into js
		
		//create layers
		let layers = {
		}

		//layer controls
		toggleLayers = L.control.layers(null,layers);
		toggleLayers.addTo(map)

		//add layergroups to map 
		prisonMarkers.addTo(map)

		refillLayers()

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

function mapCSV(pop){ //using pop(ulation) instead of data
    
    //clear layers in case calling more than once
    markers.clearLayers();
    console.log(prisondata)
    //loop
    prisondata.data.forEach(function(item,index){
        if(item.Latitude != undefined){
			console.log('Population')
            // circle options
            let circleOptions = {
                radius:  10,
				//radius: getRadiusSize(item['Population']),
                weight: 1,
                color: 'white',
                fillColor: 'black',
                fillOpacity: 0.75
            }
        
        // marker create
        let marker = L.circleMarker([item.Latitude,item.Longitude],circleOptions)
        .on('mouseover',function(){
            this.bindPopup(`${item['County / Name of Facility']} <br> Prison
            ${pop}: ${item['Population']}`).openPopup()
        })

        // add marker to featuregroup
        markers.addLayer(marker)
        
        //add to layergroup
        prisonMarkers.addLayer(marker)
		}
    }) 

    // add featuregroup to map
    markers.addTo(map)

    // fit map to markers 
    map.fitBounds(markers.getBounds())  
}

//function to adjust radius size of markers according to popsize, doesn't appear to have any impact
function getRadiusSize(value){

    let values = [];

    // get the min and max
    prisondata.data.forEach(function(item,index){
        if(item[prisonpop] != undefined){
            values.push(Number(item[prisonpop]))
        }
    })
    let min = Math.min(...values);
    let max = Math.max(...values)
    
    // per pixel if 100 pixel is the max range
    perpixel = max/10;
    return value/perpixel
}



function panToImage(index){
	map.setZoom(4);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);
	map.openPopup(marker)
}
