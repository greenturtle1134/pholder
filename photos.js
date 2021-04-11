const ExifImage = require('exif').ExifImage;
const imagenet = require("./imagenet.js")
const geoc = require('./reverse-geocode.js')
const natural = require('natural')
const {ipcMain} = require('electron');
class PhotoData {
    constructor(path) {
        this.path = path;
        this.metadata = null;
        this.imagenet = null;
    }

    match(query) {
        if(query === null || query == "") {
            return true;
        }
        if(this.imagenet !== null) {
            return this.imagenet.includes(query);
        }
        else{
            return false;
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
        photos.get(path).imagenet = null
        target.send("update-images", [photos.get(path)])
        try {
            new ExifImage({ image : path }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else {
                    photos.get(path).metadata = exifData;
                    target.send("update-images", [photos.get(path)])
                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
        imagenet.classify(path).then((e)=>{
            console.log(e);
            let identified = [];
            for(let i = 0; i<e.length; i++) { // Do we want to filter away low-probability identifications?
                identified = identified.concat(e[i].className.split(", "));
            }
            photos.get(path).imagenet = identified;
            target.send("update-images", [photos.get(path)])
        }).catch((err)=>{
            photos.get(path).imagenet = ["information unavailable :("]
            target.send("update-images", [photos.get(path)])
        });
        if(photos.get(path).metadata != null) {
            let data = photos.get(path).metadata
            var gps_meta = data["gps"]
            if("GPSLatitudeRef" in gps_meta && "GPSLatitude" in gps_meta && "GPSLongitudeRef" in gps_meta && "GPSLongitude" in gps_meta) {
                var dms_lat = gps_meta["GPSLatitude"]
                var dms_long = gps_meta["GPSLongitude"]
                console.log(dms_lat)
                var latitude = Number(dms_lat[0]) + Number(dms_lat[1])/60 + Number(dms_lat[2])/3600
                var longitude = Number(dms_long[0]) + Number(dms_long[1])/60 + Number(dms_long[2])/3600
                if(gps_meta["GPSLatitudeRef"] == "S") {
                    latitude *= -1
                }
                if(gps_meta["GPSLongitudeRef"] == "W") {
                    longitude *= -1
                }
                var loc = geoc.getLocationName(latitude, longitude)
                console.log(loc)
                photos.get(path).location = loc
                target.send("update-images", [photos.get(path)])
            }
        }
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
            var match_count = 0
            var keywords = photo.imagenet
            if(keywords !== null) {
                for(let i in keywords) {
                    let keyword = keywords[i];
                    for(let j in queries) {
                        let q = queries[j]
                        if(natural.PorterStemmer.stem(q) == natural.PorterStemmer.stem(keyword)) {
                            match_count += 1
                        }
                    }
                }
                if(match_count > 0) {
                    matches.push([match_count, photo])
                }
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