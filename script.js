// script.js

let map;
let mainPolygon21_5;
let mainPolygon22;
let mainPolygon22_5;
let elevationService;
let clickedMarker = null;
let coastlinePolylines = [];
let vbmap;
let elevation; // This is your global elevation variable
let shortestDistance;
const ro = 1.226;

// Variables for calculation inputs
let h_val = 10;
let cprob_val =0.84;
let cdir_val = 1;
let cseason_val = 1;
let qp_val = 0; // Peak Velocity Pressure

// --- Initialize Google Map - This function MUST be global for the callback ---
function initMap() {
    // Verify map div exists
    const mapDiv = document.getElementById("map");
    if (!mapDiv) {
        console.error("Error: map div not found!");
        return; // Prevent further errors if div is somehow not ready
    }

    const ukIrelandBounds = {
        north: 60.0,    // North of Scotland
        south: 49.0,    // South of England
        west: -12.0,    // West of Ireland
        east: 3.0       // East of England
    };

    map = new google.maps.Map(mapDiv, {
        center: { lat: 54.5, lng: -4.0 }, // Centered on a point within UK/Ireland
        zoom: 6,                        // A good zoom level to show both UK and Ireland
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        restriction: {
            latLngBounds: ukIrelandBounds,
            strictBounds: false // Set to true to strictly prevent panning outside, false to allow slight bounce
        }
    });

    elevationService = new google.maps.ElevationService();

    // Access globally exposed polygon data (from coords.js)
    mainPolygon21_5 = new google.maps.Polygon({
        paths: window.polygonCoords1, // Access from global scope
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        clickable: true
    });

    mainPolygon22 = new google.maps.Polygon({
        paths: window.polygonCoords2, // Access from global scope
        strokeColor: '#00FF00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00FF00',
        fillOpacity: 0.35,
        map: map,
        clickable: true
    });

    mainPolygon22_5 = new google.maps.Polygon({
        paths: window.polygonCoords3, // Access from global scope
        strokeColor: '#4B0082',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4B0082',
        fillOpacity: 0.35,
        map: map,
        clickable: true
    });
    console.log("mainPolygon22_5 loaded");

    mainPolygon21_5.addListener('click', (mapsMouseEvent) => {
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon22.addListener('click', (mapsMouseEvent) => {
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon22_5.addListener('click', (mapsMouseEvent) => {
        handleMapClick(mapsMouseEvent.latLng);
    });

    map.addListener("click", (mapsMouseEvent) => {
        handleMapClick(mapsMouseEvent.latLng);
    });

    loadCoastlineGeoJSON();
    setupInputListeners(); // Call to set up input listeners
    // calculateQp(); // Remove initial calculation here, as elevation is undefined
}

function setupInputListeners() {
    document.getElementById('h_input').addEventListener('input', (event) => {
        h_val = parseFloat(event.target.value) || 0;
        // Only calculateQp if elevation has been set (i.e., after a map click)
        if (elevation !== undefined) {
            calculateQp();
        }
    });
    document.getElementById('cprob_input').addEventListener('input', (event) => {
        cprob_val = parseFloat(event.target.value) || 0;
        if (elevation !== undefined) {
            calculateQp();
        }
    });
    document.getElementById('cdir_input').addEventListener('input', (event) => {
        cdir_val = parseFloat(event.target.value) || 0;
        if (elevation !== undefined) {
            calculateQp();
        }
    });
    document.getElementById('cseason_input').addEventListener('input', (event) => {
        cseason_val = parseFloat(event.target.value) || 0;
        if (elevation !== undefined) {
            calculateQp();
        }
    });
}

function calculateQp() {
    zs = 0.6 * h_val;

    if (h_val < 10) {
        calt = (elevation) * 0.001 + 1;
        console.log("Calt is " + calt);
    } else {
        calt = (1 + 0.001 * (elevation) * ((10 / zs) ** 0.2));
        console.log("Calt is " + calt);
    }
    console.log("vbmap is " + vbmap);
    vbo = calt * vbmap;
    console.log("vbo is " + vbo);
    vb = vbo * cprob_val * cdir_val * cseason_val;
    console.log("vb is " + vb);
    qb = 0.5 * ro * vb ** 2;
    console.log("qb is " + qb);
    console.log("shortesst distance to sea is " + 0.001*shortestDistance);
    console.log("hval is "+h_val);
    cez = interpolateValues(h_val, 0.001*shortestDistance);
    console.log("cez is " + cez);
    qp_val = cez * qb/1000;
    console.log(qp_val);

    document.getElementById('qp_output').textContent = qp_val.toFixed(3);
}


function handleMapClick(clickedLatLng) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = "Getting elevation...";
    messageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    messageBox.classList.add('show');

    if (clickedMarker) {
        clickedMarker.setMap(null);
        clickedMarker = null;
    }

    elevationService.getElevationForLocations(
        { locations: [clickedLatLng] },
        (results, status) => {
            if (status === google.maps.ElevationStatus.OK && results && results.length > 0) {
                // Assign to the global 'elevation' variable
                elevation = Math.round(results[0].elevation * 100) / 100;

                if (elevation < -3) { // Use the global 'elevation' here
                    messageBox.textContent = "The point you have selected is in water, please select another point";
                    messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
                    setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
                } else {
                    // No need to pass elevation to dropPinAndGetInfo anymore, it can access the global
                    dropPinAndGetInfo(clickedLatLng);
                }
            } else {
                messageBox.textContent = `Error getting elevation: ${status}. Please try again.`;
                messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
                setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
            }
        }
    );
}

async function loadCoastlineGeoJSON() {
    try {
        const response = await fetch('britain_coastline.geojson');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not load britain_coastline.geojson`);
        }
        const geojsonData = await response.json();
        console.log("Coastline GeoJSON loaded:", geojsonData);
        drawCoastline(geojsonData);

    } catch (error) {
        console.error("Failed to load GeoJSON coastline:", error);
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = `Error loading coastline data: ${error.message}`;
        messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
        messageBox.classList.add('show');
        setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
    }
}

function drawCoastline(geojsonData) {
    coastlinePolylines.forEach(polyline => polyline.setMap(null));
    coastlinePolylines = [];

    geojsonData.features.forEach(feature => {
        const geometryType = feature.geometry.type;
        const coordinates = feature.geometry.coordinates;

        if (geometryType === 'LineString') {
            const path = coordinates.map(coord => ({
                lat: coord[1],
                lng: coord[0]
            }));
            const polyline = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 1,
                map: map,
                zIndex: 1
            });
            coastlinePolylines.push(polyline);
        } else if (geometryType === 'MultiLineString') {
            coordinates.forEach(line => {
                const path = line.map(coord => ({
                    lat: coord[1],
                    lng: coord[0]
                }));
                const polyline = new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: '#000000',
                    strokeOpacity: 1.0,
                    strokeWeight: 1,
                    map: map,
                    zIndex: 1
                });
                coastlinePolylines.push(polyline);
            });
        } else if (geometryType === 'Polygon') {
            const path = coordinates[0].map(coord => ({
                lat: coord[1],
                lng: coord[0]
            }));
            const polyline = new google.maps.Polyline({
                path: path,
                geodesic: true,
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 1,
                map: map,
                zIndex: 1
            });
            coastlinePolylines.push(polyline);
        } else if (geometryType === 'MultiPolygon') {
            coordinates.forEach(polygonCoords => {
                const path = polygonCoords[0].map(coord => ({
                    lat: coord[1],
                    lng: coord[0]
                }));
                const polyline = new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: '#000000',
                    strokeOpacity: 1.0,
                    strokeWeight: 1,
                    map: map,
                    zIndex: 1
                });
                coastlinePolylines.push(polyline);
            });
        }
    });
}

// Removed currentElevation parameter since global 'elevation' is now used
function dropPinAndGetInfo(clickedLatLng) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = "Dropping pin and calculating data...";
    messageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    messageBox.classList.add('show');

    if (clickedMarker) {
        clickedMarker.setMap(null);
        clickedMarker = null;
    }

    clickedMarker = new google.maps.Marker({
        position: clickedLatLng,
        map: map,
        title: "Clicked Location",
        animation: google.maps.Animation.DROP
    });

    shortestDistance = Infinity; // Ensure shortestDistance is reset and assigned to the global variable
    let closestPoint = null;

    if (coastlinePolylines.length > 0) {
        coastlinePolylines.forEach(polyline => {
            const path = polyline.getPath().getArray();

            path.forEach(pathLatLng => {
                const distance = google.maps.geometry.spherical.computeDistanceBetween(clickedLatLng, pathLatLng);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    closestPoint = pathLatLng;
                }
            });
        });
    }

    let distanceMessage = "";
    if (shortestDistance !== Infinity) {
        distanceMessage = ` | Coastline: ${shortestDistance.toFixed(2)}m away`;
    } else {
        distanceMessage = " | Coastline not loaded";
    }

    let combinedMessage = "";
    let backgroundColor = 'rgba(255, 255, 255, 0.9)';

    if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon21_5)) {
        vbmap = 21.5;
        combinedMessage = "Polygon: 21.5 (Inner)";
        backgroundColor = 'rgba(144, 238, 144, 0.8)';
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon22)) {
        vbmap = 22;
        combinedMessage = "Polygon: 22 (Central)";
        backgroundColor = 'rgba(255, 255, 0, 0.8)';
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon22_5)) {
        vbmap = 22.5;
        combinedMessage = "Polygon: 22.5 (Outer)";
        backgroundColor = 'rgba(255, 255, 0, 0.8)';
    } else {
        vbmap = undefined; // Set vbmap to undefined if outside polygons to avoid NaN in qp_val later
        combinedMessage = "Polygon: Outside Polygons";
    }
    // Now 'elevation' and 'shortestDistance' are global and correctly set
    calculateQp();
    combinedMessage += ` | Elevation: ${elevation}m`; // Use the global 'elevation' here
    console.log(`Elevation for ${clickedLatLng.lat()},${clickedLatLng.lng()}: ${elevation} meters`);

    messageBox.textContent = combinedMessage + distanceMessage;
    messageBox.style.backgroundColor = backgroundColor;

    setTimeout(() => {
        messageBox.classList.remove('show');
    }, 5000);
}