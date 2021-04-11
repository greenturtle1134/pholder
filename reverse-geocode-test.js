geoc = require('./reverse-geocode.js')

geoc.getLocationName(38.915391, -77.405827).then((res)=>{
    console.log(res)
}).catch((e) => {
    console.log(e)
})