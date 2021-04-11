const NodeGeocoder = require('node-geocoder')
const options = {
    provider: "openstreetmap"
}
const geocoder = NodeGeocoder(options)

async function getLocation(lat, lon){
    var result = null;
    while(result === null) {
        try{
            result = geocoder.reverse({lat: lat, lon: lon})
        }
        catch(error) {
            console.log(error)
        }
    }
    return result;
}

exports.getLocation = getLocation