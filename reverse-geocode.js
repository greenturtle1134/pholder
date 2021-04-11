const NodeGeocoder = require('node-geocoder')
const options = {
    provider: "openstreetmap"
}
const geocoder = NodeGeocoder(options)

async function getLocation(lat, lon){
    return geocoder.reverse({lat: lat, lon: lon});
}

exports.getLocation = getLocation