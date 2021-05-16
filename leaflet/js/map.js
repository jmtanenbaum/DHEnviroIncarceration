// Global variables
let map;
let lat = 38.5816;
let lon = -121.4944;
let zl = 6;
let path = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_4ZPtBXvaVqamLlQTgNZp9-3pcJakjqoT6mDbsF4wL-wb2qRCMsx0jT-1vqtP7PKy6p_oXJNqtA4k/pub?gid=0&single=true&output=csv";
let enviroShapePath = "https://raw.githubusercontent.com/jmtanenbaum/DHEnviroIncarceration/main/leaflet/data/CES3Results.json";
let markers = L.featureGroup();
let markersLayer = L.featureGroup();
let prisondata;
//create layergroups
let prisonMarkers = L.layerGroup();
let prisonpop; //TO CHANGE MARKER SIZE ACC TO PRISON POPULATION
let pollPolys;
let gwPolys;
let hazPolys;

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
	//JSON waits for web
	//BYPASS FOR NOW loadJSONFile(); 
		
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

function shapesLoaded() {
	//when file is ready, read it 
	if (this.readyState == 4 && this.status == "200") { //check file is good 
		enviroShape = JSON.parse(this.responseText); //convert file into js
		
		//add Haz Waste poly layer 
		hazPolys = L.geoJSON(enviroShape,{
			style: colorEnviroHazMat
		})
		hazPolys.addTo(map);	//apply style settings and add shapes to map

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
			"Hazardous Wastes": hazPolys, 
			"Groundwater Threats": gwPolys,
			"Pollution": pollPolys
		}

		//layer controls
		L.control.layers(null,layers).addTo(map)

		//add layergroups to map 
		prisonMarkers.addTo(map)

	}
}

//return color based on percent of Hazardous Wastes 
function colorEnviroHazMat(poly) {
	//poly is the enviro poly loaded above.
	var Haz_pctl = poly.properties.Haz_pctl
	if ( Haz_pctl > 74.99) {
		return {color: "#fabc05",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( 74.99 >= Haz_pctl > 49.99) {
		return {color: "#fbf500",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( 49.99 >= Haz_pctl > 24.99) {
		return {color: "#fffd3d",
				weight: "1",
				fillOpacity: 0.65}
	}
	else if ( Haz_pctl <= 24.99 ) {
		return {color: "#edff5f",
				weight: "1",
				fillOpacity: 0.65}
	}
	else {
		return {
			opacity: 0
		}
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
