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
      keyword: ("brewery")
    }, callback);

  };



callback = function(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i <=9; i++) {
      createMarker(results[i]);
    }
  }
};





// TODO: create getDetails method to get the details of each place
// Next step: use global service var
// Place Details documentation - https://developers.google.com/maps/documentation/javascript/places#place_details
// Place Details example - https://developers.google.com/maps/documentation/javascript/examples/place-details
// Library of Place properties - https://developers.google.com/maps/documentation/javascript/3.exp/reference#PlaceResult


function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  service.getDetails(place, function(place, status) {
    google.maps.event.addListener(marker, 'click', function() {
      var isItOpen;
      if (place.opening_hours.open_now) {
        isItOpen = "Open now!";
      } else {
        isItOpen = "Not open just yet!";
      }
      infowindow.setContent("<strong> ????? </strong><br />" + place.formatted_address +"<br />" + place.rating + " stars<br />" + isItOpen + "<br /> <span id='clickableTitle'>Hours:</span><span id='hours'>" +
      place.opening_hours.weekday_text[0] + "<br />" +
      place.opening_hours.weekday_text[1] + "<br />" +
      place.opening_hours.weekday_text[2] + "<br />" +
      place.opening_hours.weekday_text[3] + "<br />" +
      place.opening_hours.weekday_text[4] + "<br />" +
      place.opening_hours.weekday_text[5] + "<br />" +
      place.opening_hours.weekday_text[6] + "</span>");
      infowindow.open(map, this);
      console.log(place.opening_hours);
    });
  });
}

exports.map = map;
