var map;
var service;
  initMap = function() {
    var Portland = {lat: 45.5200, lng: -122.64};
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.5200, lng: -122.64},
    zoom: 12
    });

    infowindow = new google.maps.InfoWindow();

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: Portland,
      radius: 20000,
      types: ['bar', 'night_club']
    }, callback);

  };
  // var infoWindow = new google.maps.InfoWindow({map: map});

  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     var pos = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };
  //
  //     infoWindow.setPosition(pos);
  //     infoWindow.setContent('Location found.');
  //     map.setCenter(pos);
  //   }, function() {
  //     handleLocationError(true, infoWindow, map.getCenter());
  //   });
  // } else {
  //   // Browser doesn't support Geolocation
  //   handleLocationError(false, infoWindow, map.getCenter());
  // }
// }

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(browserHasGeolocation ?
//                         'Error: The Geolocation service failed.' :
//                         'Error: Your browser doesn\'t support geolocation.');
// }


callback = function(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
};

// TODO: create getDetails method to get the details of each place
// Next step: use global service var
// Place Details documentation - https://developers.google.com/maps/documentation/javascript/places#place_details
// Place Details example - https://developers.google.com/maps/documentation/javascript/examples/place-details
// Library of Place properties - https://developers.google.com/maps/documentation/javascript/3.exp/reference#PlaceResult



// service.getDetails({
//   placeId: 'place.place_id'
// }, function(place, status) {
//   if (status === google.maps.places.PlacesServiceStatus.OK) {
//     var marker = new google.maps.Marker({
//       map: map,
//       position: place.geometry.location
//     });
//   }
// });

createMarker = function (place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          'Place ID: ' + place.place_id + '<br>' +
          place.formatted_address + '</div>');
    infowindow.open(map, this);
  });
};


exports.map = map;
