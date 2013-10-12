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
var vermontCenter = new google.maps.LatLng(43.77716516064871, -72.39696075703125);
var markersArray = [];

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

                for(var x = 0; x < data.length; x++) {
                    if(!data[x].id)
                        console.log("null id");
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data[x].latitude,data[x].longitude),
                        map: map,
                        id: data[x].id,
                        title: data[x].description
                    });
                    attachMarkerInfo(marker, map);
                    markersArray.push(marker);
                }
                finalizeLoading();
            });
            break;
        case views.HEAT_ISSUE_COUNT:
            $.ajax({
                url: '/report/basicHeatMap',
                data: { },
                type: 'get',
                dataType: 'json'
            }).done(function(data) {
                addHashMapToHeatMap(data);
                finalizeLoading();
            });
            break;
        case views.HEAT_ISSUE_BY_TOWN:
            $.ajax({
                url: '/report/heatMapByTown',
                data: { },
                type: 'get',
                dataType: 'json'
            }).done(function(data) {
                addHashMapToHeatMapByTown(data);
                finalizeLoading();
            });
            break;
        case views.HEAT_ISSUE_BY_TOWN_DENSITY:
            $.ajax({
                url: '/report/basic',
                data: { },
                type: 'get',
                dataType: 'json'
            }).done(function(data) {
                addDataToHeatMap(data);
                finalizeLoading();
            });
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
            var popupContent = "";
            popupContent += (data.image) ? "<img id='popup-info-image' src='"+data.image+"' />" : "";
            popupContent += (data.issueTypeId) ? "<div id='popup-info-type'>"+issueTypeMap[data.issueTypeId].description + " in " + data.townName + "</div>" : "";

            var infowindow = new google.maps.InfoWindow(
                {
                    content: data.image || data.issueTypeId ? popupContent : "<b>No image available</b>",
                    size: new google.maps.Size(1,1)
                });
            lastInfoWindow = infowindow;
            infowindow.open(map, marker);
        });

    });
}

function initialize() {
    if(firstLoad) {  // may want to get this working so it doesn't flash when reloading
        var mapOptions = {
            zoom: firstLoad? 8 : map.getZoom(),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: firstLoad ? vermontCenter : map.getCenter(),
            streetViewControl: false,
            mapTypeControl: false
        };

        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    } else {
        clearMarkers();
        toggleHeatmap(false);
    }

    loadPointArray();

} // initialize

function finalizeLoading() {
    if(activeView != views.BASIC) {

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointArray
        });
        heatmap.setOptions({
            radius: 15
        });
        toggleHeatmap(true);
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

function isNumber(n) {
    return (n && !isNaN(parseFloat(n)) && isFinite(n));
}

function addHashMapToHeatMap(data) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            addPoint(key.split(":")[0],
                key.split(":")[1],
                isNumber(data[key]) ? calculateBasicHeatMapSize(data[key]) : null);
        }
    }
}

function addHashMapToHeatMapByTown(data) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            addPoint(key.split(":")[0],
                key.split(":")[1],
                isNumber(data[key]) ? calculateHeatMapByTownSize(data[key]) : null);
        }
    }
}

function addDataToHeatMap(data) {
    for(var x = 0; x < data.length; x++) {
        addPoint(data[x].latitude,
            data[x].longitude,
                isNumber(data[x].weight) ? calculateRealWeight(data[x].weight) : null);
    }
}

function calculateRealWeight(weight) {
    return weight;
}

function calculateBasicHeatMapSize(weight) {
    return weight * 5;
}

function calculateHeatMapByTownSize(weight) {
    return weight * 10;
}

function addPoint(lat, long, weightOfPoint) {
    if(weightOfPoint) {
        pointArray.push({location: new google.maps.LatLng(lat, long), weight: weightOfPoint});
    }
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

function clearMarkers() {
    if(markersArray) {
            for (var i = 0; i < markersArray.length; i++ ) {
                markersArray[i].setMap(null);
            }
    }
}

//function openMarkerById(id) {
//    for (var i = 0; i < markersArray.length; i++ ) {
//        if(markersArray[i].id == id)
//            markersArray[i].trigger('click');
//    }
//}
