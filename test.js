const {Photos} = require("./photos.js")

var photos = new Photos();

photos.addPhoto("./test.jpg");

setTimeout(function(){
    console.log(photos.photos.get("./test.jpg").metadata);
}, 1000);