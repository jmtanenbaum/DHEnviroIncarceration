// Global variables
let map;
let lat = 38.5816;
let lon = -121.4944;
let zl = 6;
let path = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_4ZPtBXvaVqamLlQTgNZp9-3pcJakjqoT6mDbsF4wL-wb2qRCMsx0jT-1vqtP7PKy6p_oXJNqtA4k/pub?gid=0&single=true&output=csv";
let enviroShapePath = "https://raw.githubusercontent.com/jmtanenbaum/DHEnviroIncarceration/main/leaflet/data/CES3Results.json";
let markers = L.featureGroup();
let markersLayer = L.featureGroup();
let legend = L.control({position: 'topright'}); //legend object
let info_panel = L.control();
let prisondata;
let brew = new classyBrew();
//create layergroups
let prisonMarkers = L.layerGroup();
let prisonpop; //TO CHANGE MARKER SIZE ACC TO PRISON POPULATION
let polys; //polygons layer




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
function refillLayers(fields) {
	// clear layers in case it has been mapped already
	if (polys){
		polys.clearLayers()
	}

	console.log(fields)
	
	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	enviroShape.features.forEach(function(item,index){
		values.push(item.properties[fields])
	})
	

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(6);
	brew.setColorCode('YlOrRd');
	brew.classify('quantiles');

	function polyStyle(feature){
		return {
			stroke: true,
			weight: 1,
			fill: true,
			fillColor: brew.getColorInRange(feature.properties[fields]),
			fillOpacity: 0.5
		}
	}

	// create the layer and add to map
	polys = L.geoJson(enviroShape, {
		style: polyStyle //call a function to style each feature
	}).addTo(map);

	//remove from map
	prisonMarkers.remove();
	prisonMarkers.addTo(map);

	// create the legend
	createLegend();
	// create the infopanel
	createInfoPanel();

}

//load up the choropleth layers
function shapesLoaded() {
	//when file is ready, read it 
	if (this.readyState == 4 && this.status == "200") { //check file is good 
		enviroShape = JSON.parse(this.responseText); //convert file into js
		//add layergroups to map 
		prisonMarkers.addTo(map)

	}
}
//create legend
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
					'<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(_feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: '#666',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info_panel.update(layer.feature.properties)
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	pollPolys.resetStyle(e.target);
	info_panel.update() // resets infopanel
}

function resetHighlight(e) {
	gwPolys.resetStyle(e.target);
	info_panel.update() // resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function createInfoPanel(){

	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if(properties){
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else
		{
			this._div.innerHTML = 'Hover over a California environmental tract';
		}
	};

	info_panel.addTo(map);
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
                radius:  8,
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
