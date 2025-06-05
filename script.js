// script.js

let map;
let mainPolygon21_5;
let mainPolygon22;
let mainPolygon22_5;
let mainPolygon23;
let mainPolygon23_5;
let mainPolygon24;
let mainPolygon24_5;
let mainPolygon25;
let mainPolygon25_5;
let mainPolygon26;
let mainPolygon26_5;
let mainPolygon27;
let mainPolygon27_5;
let mainPolygon28;
let mainPolygon28_5;
let mainPolygon29;
let mainPolygon29_5;
let mainPolygon31;
let elevationService;
let clickedMarker = null;
let coastlinePolylines = [];

// Global variables for outputs and calculations
let vbmap;
let elevation;
let shortestDistance; // This is in meters
let qb_val = 0;   // Added global for basic velocity
let cez_val = 0;  // Added global for cez
const ro = 1.226;

// Variables for calculation inputs
let h_val = 10;
let cprob_val = 0.84;
let cdir_val = 1;
let cseason_val = 1;
let qp_val = 0; // Peak Velocity Pressure

// --- Initialize Google Map - This function MUST be global for the callback ---
function initMap() {
    console.log("initMap function started."); // Diagnostic Log

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
        east: 3.0      // East of England
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
    console.log("Google Map initialized."); // Diagnostic Log

    elevationService = new google.maps.ElevationService();
    console.log("ElevationService initialized."); // Diagnostic Log

    // Access globally exposed polygon data (from coords.js)
    mainPolygon21_5 = new google.maps.Polygon({
        paths: window.polygonCoords21_5,
        strokeColor: '#FF0000', // Red
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon22 = new google.maps.Polygon({
        paths: window.polygonCoords22,
        strokeColor: '#00FF00', // Green
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#00FF00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon22_5 = new google.maps.Polygon({
        paths: window.polygonCoords22_5,
        strokeColor: '#4B0082', // Dark Purple
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#4B0082',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon23 = new google.maps.Polygon({
        paths: window.polygonCoords23,
        strokeColor: '#008080', // Teal
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#008080',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon23_5 = new google.maps.Polygon({
        paths: window.polygonCoords23_5,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon24 = new google.maps.Polygon({
        paths: window.polygonCoords24,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon24_5 = new google.maps.Polygon({
        paths: window.polygonCoords24_5,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });
    mainPolygon25 = new google.maps.Polygon({
        paths: window.polygonCoords25,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon25_5 = new google.maps.Polygon({
        paths: window.polygonCoords25_5,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });
    mainPolygon26 = new google.maps.Polygon({
        paths: window.polygonCoords26,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });
    mainPolygon26_5 = new google.maps.Polygon({
        paths: window.polygonCoords26_5,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });
    mainPolygon27 = new google.maps.Polygon({
        paths: window.polygonCoords27,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });
    mainPolygon27_5 = new google.maps.Polygon({
        paths: window.polygonCoords27_5,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });
    mainPolygon28 = new google.maps.Polygon({
        paths: window.polygonCoords28,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });
    mainPolygon28_5 = new google.maps.Polygon({
        paths: window.polygonCoords28_5,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });
    mainPolygon29 = new google.maps.Polygon({
        paths: window.polygonCoords29,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon29_5 = new google.maps.Polygon({
        paths: window.polygonCoords29_5,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    mainPolygon31 = new google.maps.Polygon({
        paths: window.polygonCoords31,
        strokeColor: '#FF8C00', // Dark Orange
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: '#FF8C00',
        fillOpacity: 0,
        map: map,
        clickable: true
    });

    console.log("All polygons loaded and assigned."); // Diagnostic Log

    // --- Add click listeners for all polygons and the map ---
    mainPolygon21_5.addListener('click', (mapsMouseEvent) => {
        console.log("Click detected on mainPolygon21_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon22.addListener('click', (mapsMouseEvent) => {
        console.log("Click detected on mainPolygon22"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon22_5.addListener('click', (mapsMouseEvent) => {
        console.log("Click detected on mainPolygon22_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon23.addListener('click', (mapsMouseEvent) => { // Listener for the new polygon
        console.log("Click detected on mainPolygon23"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon23_5.addListener('click', (mapsMouseEvent) => { // Listener for polygonCoords5
        console.log("Click detected on mainPolygon23_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });
    mainPolygon24.addListener('click', (mapsMouseEvent) => {
        console.log("Click detected on mainPolygon24"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon24_5.addListener('click', (mapsMouseEvent) => {
        console.log("Click detected on mainPolygon24_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon25.addListener('click', (mapsMouseEvent) => { // Listener for the new polygon
        console.log("Click detected on mainPolygon25"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon25_5.addListener('click', (mapsMouseEvent) => { // Listener for polygonCoords5
        console.log("Click detected on mainPolygon25_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon26.addListener('click', (mapsMouseEvent) => {
        console.log("Click detected on mainPolygon26"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon26_5.addListener('click', (mapsMouseEvent) => {
        console.log("Click detected on mainPolygon26_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon27.addListener('click', (mapsMouseEvent) => { // Listener for the new polygon
        console.log("Click detected on mainPolygon27"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon27_5.addListener('click', (mapsMouseEvent) => { // Listener for polygonCoords5
        console.log("Click detected on mainPolygon27_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });
    mainPolygon28.addListener('click', (mapsMouseEvent) => { // Listener for the new polygon
        console.log("Click detected on mainPolygon28"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon28_5.addListener('click', (mapsMouseEvent) => { // Listener for polygonCoords5
        console.log("Click detected on mainPolygon28_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });
    mainPolygon29.addListener('click', (mapsMouseEvent) => { // Listener for the new polygon
        console.log("Click detected on mainPolygon29"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    mainPolygon29_5.addListener('click', (mapsMouseEvent) => { // Listener for polygonCoords5
        console.log("Click detected on mainPolygon29_5"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });
    mainPolygon31.addListener('click', (mapsMouseEvent) => { // Listener for polygonCoords5
        console.log("Click detected on mainPolygon31"); // Diagnostic Log
        handleMapClick(mapsMouseEvent.latLng);
    });

    map.addListener("click", (mapsMouseEvent) => {
        console.log("Click detected on base map."); // Diagnostic Log
        // This will catch clicks outside of any defined polygons
        handleMapClick(mapsMouseEvent.latLng);
    });
    console.log("All map and polygon click listeners attached."); // Diagnostic Log

    loadCoastlineGeoJSON1();
    loadCoastlineGeoJSON2();
    loadCoastlineGeoJSON3();
    loadCoastlineGeoJSON4();
    console.log("Coastline GeoJSON loading initiated."); // Diagnostic Log

    setupInputListeners();
    console.log("Input listeners set up."); // Diagnostic Log

    // Initialize display with N/A or default values
    updateDisplayedValues();
    console.log("initMap function finished."); // Diagnostic Log
}

function setupInputListeners() {
    document.getElementById('h_input').addEventListener('input', (event) => {
        h_val = parseFloat(event.target.value) || 0;
        // Only recalculate if a location has already been selected (i.e., vbmap and elevation are set)
        if (vbmap !== undefined && elevation !== undefined) {
            calculateQp();
        } else {
            updateDisplayedValues(); // Update inputs on screen even if calculations can't run yet
        }
    });
    document.getElementById('cprob_input').addEventListener('input', (event) => {
        cprob_val = parseFloat(event.target.value) || 0;
        if (vbmap !== undefined && elevation !== undefined) {
            calculateQp();
        } else {
            updateDisplayedValues();
        }
    });
    document.getElementById('cdir_input').addEventListener('input', (event) => {
        cdir_val = parseFloat(event.target.value) || 0;
        if (vbmap !== undefined && elevation !== undefined) {
            calculateQp();
        } else {
            updateDisplayedValues();
        }
    });
    document.getElementById('cseason_input').addEventListener('input', (event) => {
        cseason_val = parseFloat(event.target.value) || 0;
        if (vbmap !== undefined && elevation !== undefined) {
            calculateQp();
        } else {
            updateDisplayedValues();
        }
    });
}

function calculateQp() {
    console.log("Calculating Qp..."); // Diagnostic Log

    // Ensure vbmap and elevation are set before proceeding
    if (vbmap === undefined || elevation === undefined) {
        console.warn("vbmap or elevation is undefined, cannot calculate Qp fully.");
        // Reset output values to N/A if inputs are missing
        qp_val = undefined; qb_val = undefined; cez_val = undefined;
        updateDisplayedValues();
        return;
    }

    const zs = 0.6 * h_val;

    let calt;
    if (h_val < 10) {
        calt = (elevation) * 0.001 + 1;
        console.log("Calt (h<10) is " + calt);
    } else {
        calt = (1 + 0.001 * (elevation) * ((10 / zs) ** 0.2));
        console.log("Calt (h>=10) is " + calt);
    }
    console.log("vbmap is " + vbmap);
    const vbo = calt * vbmap;
    console.log("vbo is " + vbo);
    const vb = vbo * cprob_val * cdir_val * cseason_val;
    console.log("vb is " + vb);

    // Calculate qb and assign to global qb_val, converted to kN/m²
    qb_val = 0.5 * ro * vb ** 2 / 1000;
    console.log("qb_val is " + qb_val);

    console.log("shortest distance to sea (m) is " + shortestDistance);
    console.log("hval is "+h_val);

    // Ensure shortestDistance is a valid number before using in interpolateValues
    const shortestDistanceKm = shortestDistance !== Infinity ? shortestDistance / 1000 : 0;
    try {
        // Call to interpolateValues from countryInterpolation.js and assign to global cez_val
        cez_val = interpolateValues(h_val, shortestDistanceKm);
        console.log("cez_val is " + cez_val);
    } catch (error) {
        console.error("Error during cez interpolation:", error);
        cez_val = undefined; // Set to undefined on error
    }

    // Calculate qp_val using global qb_val (already in kN/m²) and cez_val
    qp_val = (cez_val !== undefined && qb_val !== undefined) ? cez_val * qb_val : undefined;
    console.log("qp_val calculated:", qp_val); // Diagnostic Log

    // Update all displayed values
    updateDisplayedValues();
}

/**
 * Updates all the output fields on the left panel with current calculated values.
 * Formats numbers to a maximum of 3 decimal places.
 */
function updateDisplayedValues() {
    document.getElementById('qp_output').textContent = qp_val !== undefined && !isNaN(qp_val) ? qp_val.toFixed(3) + ' kN/m²' : 'N/A';
    document.getElementById('vbmap_output').textContent = vbmap !== undefined && !isNaN(vbmap) ? vbmap.toFixed(3) + ' m/s' : 'N/A';
    document.getElementById('altitude_output').textContent = elevation !== undefined && !isNaN(elevation) ? elevation.toFixed(3) + ' m' : 'N/A';
    document.getElementById('qb_output').textContent = qb_val !== undefined && !isNaN(qb_val) ? qb_val.toFixed(3) + ' kN/m²' : 'N/A';
    document.getElementById('shortest_distance_output').textContent = shortestDistance !== Infinity && !isNaN(shortestDistance) ? (shortestDistance / 1000).toFixed(3) + ' km' : 'N/A';
    document.getElementById('cez_output').textContent = cez_val !== undefined && !isNaN(cez_val) ? cez_val.toFixed(3) : 'N/A';
    console.log("All output values updated on screen.");
}


function handleMapClick(clickedLatLng) {
    console.log("handleMapClick entered at:", clickedLatLng.lat(), clickedLatLng.lng()); // Diagnostic Log

    const messageBox = document.getElementById('message-box');
    messageBox.textContent = "Getting elevation...";
    messageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    messageBox.classList.add('show');
    console.log("Message box set to 'Getting elevation'."); // Diagnostic Log

    if (clickedMarker) {
        clickedMarker.setMap(null);
        clickedMarker = null;
        console.log("Existing marker cleared."); // Diagnostic Log
    }

    elevationService.getElevationForLocations(
        { locations: [clickedLatLng] },
        (results, status) => {
            console.log("Elevation service response - Status:", status, "Results:", results); // Diagnostic Log

            if (status === google.maps.ElevationStatus.OK && results && results.length > 0) {
                elevation = Math.round(results[0].elevation * 100) / 100;
                console.log("Elevation retrieved:", elevation); // Diagnostic Log

                if (elevation < -3) {
                    messageBox.textContent = "The point you have selected is in water, please select another point";
                    messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
                    setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
                    console.log("Point is in water message displayed."); // Diagnostic Log
                    // Reset all values to N/A when in water
                    vbmap = undefined; qb_val = undefined; cez_val = undefined; shortestDistance = Infinity; qp_val = undefined; elevation = undefined;
                    updateDisplayedValues(); // Update display to reflect N/A
                } else {
                    console.log("Calling dropPinAndGetInfo..."); // Diagnostic Log
                    dropPinAndGetInfo(clickedLatLng);
                }
            } else {
                messageBox.textContent = `Error getting elevation: ${status}. Please try again.`;
                messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
                setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
                console.log(`Elevation error: ${status}`); // Diagnostic Log
                // Reset all values to N/A on elevation error
                elevation = undefined; vbmap = undefined; qb_val = undefined; cez_val = undefined; shortestDistance = Infinity; qp_val = undefined;
                updateDisplayedValues(); // Update display to reflect N/A
            }
        }
    );
}

async function loadCoastlineGeoJSON1() {
    try {
        const response = await fetch('britain_coastline1.geojson');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - Could not load britain_coastline1.geojson`);
        }
        const geojsonData1 = await response.json();
        console.log("Coastline1 GeoJSON loaded:", geojsonData1); // Diagnostic Log
        drawCoastline(geojsonData1);

    } catch (error) {
        console.error("Failed to load GeoJSON coastline1:", error); // Diagnostic Log
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = `Error loading coastline data: ${error.message}`;
        messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
        messageBox.classList.add('show');
        setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
    }
}
async function loadCoastlineGeoJSON2() {
    try {
        const response2 = await fetch('britain_coastline2.geojson');
        if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status} - Could not load britain_coastline2.geojson`);
        }
        const geojsonData2 = await response2.json();
        console.log("Coastline2 GeoJSON loaded:", geojsonData2); // Diagnostic Log
        drawCoastline(geojsonData2);

    } catch (error) {
        console.error("Failed to load GeoJSON coastline2:", error); // Diagnostic Log
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = `Error loading coastline data: ${error.message}`;
        messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
        messageBox.classList.add('show');
        setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
    }
}

async function loadCoastlineGeoJSON3() {
    try {
        const response3 = await fetch('britain_coastline3.geojson');
        if (!response3.ok) {
            throw new Error(`HTTP error! status: ${response3.status} - Could not load britain_coastline3.geojson`);
        }
        const geojsonData3 = await response3.json();
        console.log("Coastline3 GeoJSON loaded:", geojsonData3); // Diagnostic Log
        drawCoastline(geojsonData3);

    } catch (error) {
        console.error("Failed to load GeoJSON coastline3:", error); // Diagnostic Log
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = `Error loading coastline data: ${error.message}`;
        messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
        messageBox.classList.add('show');
        setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
    }
}
async function loadCoastlineGeoJSON4() {
    try {
        const response4 = await fetch('britain_coastline4.geojson');
        if (!response4.ok) {
            throw new Error(`HTTP error! status: ${response4.status} - Could not load britain_coastline4.geojson`);
        }
        const geojsonData4 = await response4.json();
        console.log("Coastline4 GeoJSON loaded:", geojsonData4); // Diagnostic Log
        drawCoastline(geojsonData4);

    } catch (error) {
        console.error("Failed to load GeoJSON coastline4:", error); // Diagnostic Log
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = `Error loading coastline data: ${error.message}`;
        messageBox.style.backgroundColor = 'rgba(255, 99, 71, 0.8)';
        messageBox.classList.add('show');
        setTimeout(() => { messageBox.classList.remove('show'); }, 5000);
    }
}

function drawCoastline(geojsonData) {
    // This clears existing polylines. If you intend to draw all four sets and keep them,
    // you would adjust this logic to *not* clear, but instead add to the array.
    // For now, it will clear previous if loadCoastlineGeoJSON is called multiple times.
    coastlinePolylines.forEach(polyline => polyline.setMap(null));
    coastlinePolylines = [];
    console.log("Drawing coastline segments..."); // Diagnostic Log

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
    console.log("Coastline segments drawn."); // Diagnostic Log
}

function dropPinAndGetInfo(clickedLatLng) {
    console.log("Entering dropPinAndGetInfo function."); // Diagnostic Log

    const messageBox = document.getElementById('message-box');
    messageBox.textContent = "Dropping pin and calculating data...";
    messageBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    messageBox.classList.add('show');
    console.log("Message box updated to 'Dropping pin...'."); // Diagnostic Log


    if (clickedMarker) {
        clickedMarker.setMap(null);
        clickedMarker = null;
        console.log("Marker cleared in dropPinAndGetInfo."); // Diagnostic Log
    }

    clickedMarker = new google.maps.Marker({
        position: clickedLatLng,
        map: map,
        title: "Clicked Location",
        animation: google.maps.Animation.DROP
    });
    console.log("Marker created and set on map."); // Diagnostic Log

    shortestDistance = Infinity; // Ensure shortestDistance is reset
    let closestPoint = null;

    if (coastlinePolylines.length > 0) {
        console.log("Checking coastline distance..."); // Diagnostic Log
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
        console.log("Shortest distance to coastline calculated:", shortestDistance); // Diagnostic Log
    } else {
        console.log("No coastline polylines loaded for distance calculation."); // Diagnostic Log
    }


    let distanceMessage = "";
    if (shortestDistance !== Infinity) {
        distanceMessage = ` | Coastline: ${(shortestDistance / 1000).toFixed(3)} km away`; // Formatted to km, 3 decimals
    } else {
        distanceMessage = " | Coastline not loaded or no points found";
    }

    let combinedMessage = "";
    let backgroundColor = 'rgba(255, 255, 255, 0.9)';

    // These checks determine 'vbmap' and message.
    // Ensure these polygons have valid paths from coords.js!
    if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon21_5)) {
        vbmap = 21.5;
        combinedMessage = "Vbmap: 21.5 (Inner)";
        backgroundColor = 'rgba(144, 238, 144, 0.8)'; // Light Green
        console.log("Clicked inside Polygon 21.5"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon22)) {
        vbmap = 22;
        combinedMessage = "Vbmap: 22 (Central)";
        backgroundColor = 'rgba(255, 255, 0, 0.8)'; // Yellow
        console.log("Clicked inside Polygon 22"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon22_5)) {
        vbmap = 22.5;
        combinedMessage = "Vbmap: 22.5 (Outer)";
        backgroundColor = 'rgba(255, 165, 0, 0.8)'; // Orange
        console.log("Clicked inside Polygon 22.5"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon23)) {
        vbmap = 23;
        combinedMessage = "Vbmap: 23";
        backgroundColor = 'rgba(0, 128, 128, 0.8)'; // Teal
        console.log("Clicked inside Polygon 23"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon23_5)) {
        vbmap = 23.5;
        combinedMessage = "Vbmap: 23.5 (Outermost)";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 23.5"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon24)) {
        vbmap = 24;
        combinedMessage = "Vbmap: 24";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 24"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon24_5)) {
        vbmap = 24.5;
        combinedMessage = "Vbmap: 24.5";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 24.5"); // Diagnostic Log
    }
    else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon25)) {
        vbmap = 25;
        combinedMessage = "Vbmap: 25";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 25"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon25_5)) {
        vbmap = 25.5;
        combinedMessage = "Vbmap: 25.5";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 25.5"); // Diagnostic Log
    }
    else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon26)) {
        vbmap = 26;
        combinedMessage = "Vbmap: 26";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 26"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon26_5)) {
        vbmap = 26.5;
        combinedMessage = "Vbmap: 26.5";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 26.5"); // Diagnostic Log
    }
    else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon27)) {
        vbmap = 27;
        combinedMessage = "Vbmap: 27";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 27"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon27_5)) {
        vbmap = 27.5;
        combinedMessage = "Vbmap: 27.5";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 27.5"); // Diagnostic Log
    }
    else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon28)) {
        vbmap = 28;
        combinedMessage = "Vbmap: 28";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 28"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon28_5)) {
        vbmap = 28.5;
        combinedMessage = "Vbmap: 28.5";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 28.5"); // Diagnostic Log
    }
    else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon29)) {
        vbmap = 29;
        combinedMessage = "Vbmap: 29";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 29"); // Diagnostic Log
    } else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon29_5)) {
        vbmap = 29.5;
        combinedMessage = "Vbmap: 29.5";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 29.5"); // Diagnostic Log
    }
    else if (google.maps.geometry.poly.containsLocation(clickedLatLng, mainPolygon31)) {
        vbmap = 31;
        combinedMessage = "Vbmap: 31";
        backgroundColor = 'rgba(255, 215, 0, 0.8)'; // Gold
        console.log("Clicked inside Polygon 31"); // Diagnostic Log
    }

    else {
        vbmap = undefined; // Set to undefined if outside all polygons
        combinedMessage = "Polygon: Outside Defined Zones";
        backgroundColor = 'rgba(255, 255, 255, 0.9)'; // Default
        console.log("Clicked outside any specific polygon zone."); // Diagnostic Log
    }

    // Always call calculateQp to ensure all related values are updated
    calculateQp();
    
    // The message box combines text and elevation from the initial elevation service call
    combinedMessage += ` | Elevation: ${elevation !== undefined ? elevation.toFixed(2) : 'N/A'}m`;
    console.log(`Final message for display: ${combinedMessage}`); // Diagnostic Log

    messageBox.textContent = combinedMessage + distanceMessage;
    messageBox.style.backgroundColor = backgroundColor;
    console.log("Message box text and background updated."); // Diagnostic Log

    setTimeout(() => {
        messageBox.classList.remove('show');
        console.log("Message box hidden after timeout."); // Diagnostic Log
    }, 5000);
    console.log("dropPinAndGetInfo function finished."); // Diagnostic Log
}