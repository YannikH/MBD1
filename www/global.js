var options = {
  distance: 5
};
$( document ).not('#browse').on( "pageinit", function() {
	$(document).swiperight(function() {
		if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
			$( "#menuPanel" ).panel( "open" );
		}
	});
    if($(window).width() > 768) {
    //        $( "#menuPanel" ).panel( "open" );
    }
});

$('#menuPanel').enhanceWithin().panel();
function menuToggle() {
  if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
        $( "#menuPanel" ).panel( "open" );
  } else {
        $( "#menuPanel" ).panel( "close" );
  }
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    getStoredUser(true);
    navigator.geolocation.getCurrentPosition(setUserLocation, failedGeolocation);
}

var setUserLocation = function(position) {
    userpos = position;
    locationFound();
    /*
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
  */
}

var failedGeolocation = function(error) {
}

function hardCodeLocation() {
  userpos = {coords: {
    latitude : '51.690507',
    longitude: '5.210189'
  }};
  locationFound();
}

$("[data-role=page]").on("pagebeforeshow", function(event) {
  page = $(event.target);
  console.log(page);
  navleft = page.attr('data-nav-left');
  navright = page.attr('data-nav-right');
  title = page.attr('data-title');
  console.log('beforeshow ', navleft, title);
  clearnav();
  navrightConfig(navright);
  navleftConfig(navleft);
  if(title != null) {
    $('#navbar-title').html(title);
  }
});

function clearnav() {
  $('#navbar-left-icon').attr('class', '');
  $('#navbar-left-icon').removeAttr('onClick');
  $('#navbar-left').removeAttr('data-rel');
  $('#navbar-title').html('Eet.nu');
  $('#navbar-right').html('');
  $('#navbar-right').removeAttr('href');
  $('#navbar-right').removeAttr('onClick');
}

function backbutton() {
  $('#navbar-left-icon').attr('class', 'fa fa-angle-left');
  $('#navbar-left').attr('data-rel', 'back');
}

function menubutton() {
  $('#navbar-left-icon').attr('class', 'fa fa-cog');
  $('#navbar-left-icon').attr('onClick', 'menuToggle()');
}

function navleftConfig(navleft) {
  if(navleft == "menu") {
    menubutton();
  } else if (navleft == "back") {
    backbutton();
  }

}

function navrightConfig(navright) {
  if(navright == "list") {
    $('#navbar-right').html('list');
    $('#navbar-right').attr('href', '#list');
  } else if(navright == "reset") {
    $('#navbar-right').html('reset');
    $('#navbar-right').attr('onClick', 'resetBrowse()');
  }
}

$('#distanceOption').change(function() {
  console.log('distance setting');
  distance = $('#distanceOption').val()
  window.localStorage.setItem('distance', distance);
  options.distance = distance;
});

loadOptions();
function loadOptions() {
  if(window.localStorage.getItem("distance") != null) {
    dist = window.localStorage.getItem("distance");
    console.log('loading distance', dist);
    options.distance = dist;
    $('#distanceOption').val(parseInt(dist));
    $('#distanceOption').change();
  }
}