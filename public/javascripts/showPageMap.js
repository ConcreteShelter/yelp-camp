mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/light-v11", // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 12, // starting zoom
});

const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);

// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    })
);
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());