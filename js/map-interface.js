var map;
var service;
var infowindow;

  initMap = function() {

    var styles = [
      {
        featureType: "poi.business",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];
    var styledMap = new google.maps.StyledMapType(styles,
      {name: "Styled Map"});


    var Portland = {lat: 45.5200, lng: -122.64};
    var mapOptions = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.5200, lng: -122.64},
    zoom: 12,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
    });

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var input = (document.getElementById('pac-input'));

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    infowindow = new google.maps.InfoWindow();
    var cityMarker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      cityMarker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      if (place.geometry.viewport) {
         map.fitBounds(place.geometry.viewport);
       } else {
         map.setCenter(place.geometry.location);
         map.setZoom(17);
       }
       cityMarker.setIcon(/** @type {google.maps.Icon} */({
         url: place.icon,
         size: new google.maps.Size(71, 71),
         origin: new google.maps.Point(0, 0),
         anchor: new google.maps.Point(17, 34),
         scaledSize: new google.maps.Size(35, 35)
       }));
       cityMarker.setPosition(place.geometry.location);

       service = new google.maps.places.PlacesService(map);
       service.nearbySearch({
         location: place.geometry.location,
         radius: 20000,
         keyword: ("brewery")
       }, callback);
    });

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: Portland,
      radius: 20000,
      keyword: ("brewery")
    }, callback);

    // $("#open-now").click(function() {
    //   map.addListener('place_changed', function(){
    //     var place = map.getPlace(places_changed);
    //     service = new google.maps.places.PlacesService(map);
    //     service.nearbySearch({
    //       location: Portland,
    //       radius: 20000,
    //       keyword: ("brewery")
    //       openNow: true;
    //     });
    //   });
    // });

  };

callback = function(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i <=9; i++) {
      createMarker(results[i]);
    }
  }
};

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
      infowindow.setContent("<strong> ????? </strong><br />" + place.formatted_address +"<br />" + place.rating + " stars<br />" + isItOpen + "<br /> Hours:<br />" +
      place.opening_hours.weekday_text[0] + "<br />" +
      place.opening_hours.weekday_text[1] + "<br />" +
      place.opening_hours.weekday_text[2] + "<br />" +
      place.opening_hours.weekday_text[3] + "<br />" +
      place.opening_hours.weekday_text[4] + "<br />" +
      place.opening_hours.weekday_text[5] + "<br />" +
      place.opening_hours.weekday_text[6]);
      infowindow.open(map, this);
    });
  });
}
