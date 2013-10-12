var map,
    heatmap,
    initialLocation,
    browserSupportFlag =  new Boolean();

var firstLoad = true
var views = {
    BASIC: 0,
    HEAT_ISSUE_COUNT: 1,
    HEAT_ISSUE_BY_TOWN: 2,
    HEAT_ISSUE_BY_TOWN_DENSITY: 3
}
var activeView = views.BASIC;
var pointArray;
var lastInfoWindow = null;

function changeView(view)  {
    activeView = view;
    console.log("Initializing new view: " + view);
    initialize();
}

function loadPointArray() {
    // pointArray is used for the heatmaps - so no need to populate it if it's the basic view
    pointArray = new google.maps.MVCArray([]);
    switch(activeView) {
        case views.BASIC:
            /*addPoint("44.4899859","-73.1852290");
            addPoint("44.4899859","-73.1853400");
            addPoint("44.4899859","-73.1854510");
            addPoint("44.4899859","-73.1855620");
            addPoint("44.4899859","-73.1856730");
            addPoint("44.4899859","-73.1857840");
            addPoint("44.4899859","-73.1858950");
            addPoint("44.4899859","-73.1859060");
            addPoint("44.4899859","-73.1860170");
            addPoint("44.4899859","-73.1861280");
            addPoint("44.4899859","-73.1862390");*/
            $.ajax({
                url: '/report/basic',
                data: { },
                type: 'get',
                dataType: 'json'
            }).done(function(data) {
                    /*var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(44.489,-73.1862390),
                        map: map,
                        id: 'id1',
                        title: "test"
                    });
                    attachMarkerInfo(marker, map);

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(44.488,-73.1862390),
                        map: map,
                        id: 'id1',
                        title: "test"
                    });
                    attachMarkerInfo(marker, map);*/


                for(var x = 0; x < data.length; x++) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                        map: map,
                        id: data[x].id,
                        title: data[x].description
                    });
                    attachMarkerInfo(marker, map);
                }
                finalizeLoading();
            });
            break;
        case views.HEAT_ISSUE_COUNT:
            finalizeLoading();
            break;
        case views.HEAT_ISSUE_BY_TOWN:
            finalizeLoading();
            break;
        case views.HEAT_ISSUE_BY_TOWN_DENSITY:
            finalizeLoading();
            break;
    }
}

function attachMarkerInfo(marker, number) {
    var infowindow = new google.maps.InfoWindow(
        {
            content: "cool",
            size: new google.maps.Size(1,1)
        });
    google.maps.event.addListener(marker, 'click', function() {
        if(lastInfoWindow)
            lastInfoWindow.close();
        lastInfoWindow = infowindow;
        infowindow.content = '<div class="ui segment" style="width: 100px; height: 100px;"><div class="ui active inverted dimmer"><div class="ui text loader">Loading</div></div></div>';
        infowindow.open(map,marker);
        $.ajax({
            url: '/issue/'+marker.id,
            data: { },
            type: 'get',
            dataType: 'json'
        }).done(function(data) {
            if(lastInfoWindow)
                lastInfoWindow.close();
            lastInfoWindow = infowindow;
            var infowindow = new google.maps.InfoWindow(
                {
                    content: data.image ? "<img src='"+data.image+"' />" : "<b>No image available</b>",
                    size: new google.maps.Size(1,1)
                });
            infowindow.open(map, marker);
        });

    });
}

function initialize() {
    //if(firstLoad) {  // may want to get this working so it doesn't flash when reloading
    var mapOptions = {
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: firstLoad ? new google.maps.LatLng(43.77716516064871, -72.39696075703125): map.getCenter(),
        streetViewControl: false,
        mapTypeControl: false
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    google.maps.event.addListener(map, 'click', function() {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        console.log("Current Center: " + map.getCenter().lb + ", " + map.getCenter().mb + " at Zoom Level -> " + map.getZoom());
    });
    //}
    loadPointArray();

} // initialize

function finalizeLoading() {
    if(activeView != views.BASIC) {
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointArray
        });
        toggleHeatmap(true);
    } else {
        toggleHeatmap(false);
    }

    if(firstLoad) {
        centerMapOnLocation();
    }
    firstLoad = false;
}

function centerMapOnLocation() {
    /*if(firstLoad) {
        // Try HTML5 geolocation
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = new google.maps.LatLng(position.coords.latitude,
                    position.coords.longitude);

                lastInfoWindow = new google.maps.InfoWindow({
                    map: map,
                    position: pos,
                    content: 'Your location'
                });

                map.setCenter(pos);
            }, function() {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
    }  */
}

function addPoint(lat, long, weightOfPoint) {
    if(weightOfPoint)
        pointArray.push({location: new google.maps.LatLng(lat, long), weight: weightOfPoint});
    else
        pointArray.push(new google.maps.LatLng(lat,long));
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}


function toggleHeatmap(turnOn) {
    if(heatmap)
        heatmap.setMap(turnOn ? map : null);
}

function activateButton(btn) {
    $( "#google-map-view-box a.item" ).each(function() {
        $( this ).removeClass( "active" );
    });
    $(btn).addClass("active");
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.setOptions({
        gradient: heatmap.get('gradient') ? null : gradient
    });
}

function changeRadius() {
    heatmap.setOptions({radius: heatmap.get('radius') ? null : 20});
}

function changeOpacity() {
    heatmap.setOptions({opacity: heatmap.get('opacity') ? null : 0.2});
}

