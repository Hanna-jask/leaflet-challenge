// Store our API endpoint as url
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

// Perform a GET request to the URL/
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

//marker size
function markerSize(magnitude) {
    return magnitude * 5;
}

//Marker colour equal to the mag
function markerColor(magnitude) {
    if (magnitude <= -1) {
      return "#79ff4d";
    } else if (magnitude <= 2) {
      return "#d2ff4d";
    } else if (magnitude <= 3) {
      return "#ffff4d";
    } else if (magnitude <= 4) {
      return "#ffd24d";
    } else if (magnitude <= 5) {
      return "#ffa64d";
    } else if (magnitude <= 6) {
      return "#ff794d";
    } else {
      return "#ff4d4d";
    }
};

function createFeatures(earthquake) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a tooltip that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude - ${feature.properties.mag} </p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquake, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                color: "#000",
                weight: 0.3,
                opacity: 1,
                fillOpacity: 1
            });
        },
        onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });

    //legend 
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend");
      magnitudes = [1 , 2, 3, 4, 5, 6];
      labels = [];
      legendInfo = "<strong>Magnitude</strong>";
      div.innerHTML = legendInfo;
      
      // magnitudes array
      for (var i = 0; i < magnitudes.length; i++) {
        // Get the current magnitude range
        var magnitudeRange = magnitudes[i];
        var nextMagnitude = magnitudes[i + 1];
        
        // color based on the magnitude range
        var color = markerColor((magnitudeRange + nextMagnitude) / 2);
        
        //legend  with the magnitude range and colour
        var label = '<li style="background-color:' + color + '"> <span>' + magnitudeRange + (nextMagnitude ? '&ndash;' + nextMagnitude : '+') + '</span></li>';
        
        // Add to the labels array
        labels.push(label);
      }
      
      // Add the labels to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
    
    // Add legend to the map
    legend.addTo(myMap);
    // Create a layer control.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  }