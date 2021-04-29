// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_4ZPtBXvaVqamLlQTgNZp9-3pcJakjqoT6mDbsF4wL-wb2qRCMsx0jT-1vqtP7PKy6p_oXJNqtA4k/pub?gid=0&single=true&output=csv";
let markers = L.featureGroup();
let prisondata;

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
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

    })

	// add featuregroup to map
	markers.addTo(map)

	// fit map to markers
	map.fitBounds(markers.getBounds())
}

function panToImage(index){
	map.setZoom(4);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);
	map.openPopup(marker)
}
