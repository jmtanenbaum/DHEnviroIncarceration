// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/covid.csv";
let markers = L.featureGroup();

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
			
			// map the data
			mapCSV(data);

		}
	});
}

function mapCSV(data){

	// circle options
	let circleOptions = {
		radius: 3,
		weight: 1,
		color: 'white',
		fillColor: 'red',
		fillOpacity: 1
	}

	// loop through each entry
	data.data.forEach(function(item,index){
		// create a marker
		let marker = L.circleMarker([item.lat,item.lon],circleOptions)
		.on('mouseover',function(){
			this.bindPopup(`Facility name: ${item.name} <div> Prisoner Covid-19 cases: ${item.cases}<div>Prisoner deaths: ${item.deaths}<div>Incarcerated Population: ${item.pop}<div> Staff Covid-19 cases: ${item.staffcases} <div> Staff deaths: ${item.staffdeaths}`).openPopup()
		})
			// add entry to sidebar
        $('.sidebar').append(`<div onmousemove="panToImage(${index})"><br>${item.name}<br><br></div>`)
		
		// add marker to featuregroup
			markers.addLayer(marker)

	})

	// add featuregroup to map
	markers.addTo(map)

	// fit map to markers
	map.fitBounds(markers.getBounds())
}
function panToImage(index){
	map.setZoom(17);
	// pan to the marker
	map.panTo(markers.getLayers()[index]._latlng);
	map.openPopup(marker)
}

