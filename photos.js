const ExifImage = require('exif').ExifImage;
const imagenet = require("./imagenet.js")
const geoc = require('./reverse-geocode.js')
const natural = require('natural')
const {ipcMain} = require('electron');
const fs = require('fs')
class PhotoData {
    constructor(path) {
        this.path = path;
        this.metadata = null;
        this.imagenet = null;
        this.location = null;
        this.date = fs.statSync(path).ctime;
    }

    match(queries) {
        if(queries === null) {
            return 1;
        }
        var match_count = 0
        for(let i in this.imagenet) {
            let keyword = this.imagenet[i];
            var hasTerms = false;
            for(let j in queries){
                let query = queries[j];
                if(query.includes(":")){
                    // This is a special one.
                    let parts = query.split(/\s*:\s*/, 2)
                    let type = parts[0]
                    let value = parts[1]
                    if(type == "date") {
                        let date_search = new Date(value);
                        if(this.date !== null && !sameDay(date_search, this.date)) {
                            return 0;
                        }
                    }
                    if(type == "before") {
                        let date_search = new Date(value);
                        if(this.date !== null && date_search.getTime() < this.date.getTime()) {
                            return 0;
                        }
                    }
                    if(type == "after") {
                        let date_search = new Date(value);
                        if(this.date !== null && date_search.getTime() > this.date.getTime()) {
                            return 0;
                        }
                    }
                }
                else {
                    hasTerms = true;
                    if(natural.PorterStemmer.stem(query) == natural.PorterStemmer.stem(keyword)) {
                        match_count += 1
                    }
                }
            }
        }
        if(hasTerms) {
            return match_count;
        }
        else {
            return 1;
        }
    }
}

module.exports.Photos = class {
    constructor(target) {
        this.photos = new Map();
        this.target = target;
        this.query = null;
    }
    
    addPhoto(path) {
        var photos = this.photos;
        var target = this.target;
        photos.set(path, new PhotoData(path));
        var photo = photos.get(path);
        photo.imagenet = null
        target.send("update-images", [photo])
        try {
            new ExifImage({ image : path }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else {
                    photo.metadata = exifData;
                    var gps_meta = exifData["gps"]
                    if("GPSLatitudeRef" in gps_meta && "GPSLatitude" in gps_meta && "GPSLongitudeRef" in gps_meta && "GPSLongitude" in gps_meta) {
                        var dms_lat = gps_meta["GPSLatitude"]
                        var dms_long = gps_meta["GPSLongitude"]
                        var latitude = Number(dms_lat[0]) + Number(dms_lat[1])/60 + Number(dms_lat[2])/3600
                        var longitude = Number(dms_long[0]) + Number(dms_long[1])/60 + Number(dms_long[2])/3600
                        if(gps_meta["GPSLatitudeRef"] == "S") {
                            latitude *= -1
                        }
                        if(gps_meta["GPSLongitudeRef"] == "W") {
                            longitude *= -1
                        }
                        photo.latitude = latitude;
                        photo.longitude = longitude
                        geoc.getLocation(latitude, longitude).then((e) => {
                            photo.location = e[0];
                        })
                    }
                    if ("exif" in exifData && "DateTimeOriginal" in exifData.exif) {
                      let [year, month, day, hour, minute, second] = exifData.exif.DateTimeOriginal.split(/[ :]/);
                      photos.get(path).date = new Date(year, month-1, day, hour, minute, second)
                    }
                    target.send("update-images", [photo])
                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
        imagenet.classify(path).then((e)=>{
            let identified = [];
            for(let i = 0; i<e.length; i++) { // Do we want to filter away low-probability identifications?
                identified = identified.concat(e[i].class.split(", "));
            }
            photo.imagenet = identified;
            if(identified.length == 0) {
                console.log("aaa")
                photos.get(path).imagenet = ["no keyword matches :\\"]
            } else {
                console.log("bb")
                photos.get(path).imagenet = identified;
            }
            target.send("update-images", [photo])
        }).catch((err)=>{
            photo.imagenet = ["information unavailable :("]
            target.send("update-images", [photo])
        });
    }

    addPhotos(paths) {
        for (path in paths) {
            this.addImage(path);
        }
    }

    // filter(query) {
    //     this.query = query;
    //     let results = [];
    //     for(const [path, photo] of this.photos.entries()){
    //         if(photo.match(natural.PorterStemmer.stem(query))){
    //             results.push(photo);
    //         }
    //     }
    //     this.target.send("replace-images", results);
    // }

    filter(query) {
        // queries is an array of search terms, photopaths is an array of paths
        // assuming photos.get(path).imagenet returns an array of keywords associated with photo
        // returns a sorted array of paths
        if(query == "") {
            this.resetFilter();
            return;
        }
        var queries = query.split(", ")
        var matches = []
        for(var [path, photo] of this.photos) {
            let match_count = photo.match(queries);
            if(match_count > 0) {
                matches.push([match_count, photo])
            }
        }
        matches = matches.sort(function(a, b) {
            return b[0]-a[0]
        })
        for(var i=0; i<matches.length; i++) {
            matches[i] = matches[i][1]
        }
        this.target.send("replace-images", matches);
    }

    resetFilter() {
        this.target.send("replace-images", Array.from(this.photos.values()));
    }
}

// Lifted from https://stackoverflow.com/questions/43855166/how-to-tell-if-two-dates-are-in-the-same-day
function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }