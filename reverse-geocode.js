const NodeGeocoder = require('node-geocoder')
const options = {
    provider: "openstreetmap"
}
const geocoder = NodeGeocoder(options)

async function getLocationName(lat, lon){
    return geocoder.reverse({lat: lat, lon: lon}).formattedAddress
}

exports.getLocationName = getLocationName