const ExifImage = require('exif').ExifImage;
const imagenet = require("./imagenet.js")
const natural = require('natural')
const {ipcMain} = require('electron');
const fs = require('fs')
class PhotoData {
    constructor(path) {
        this.path = path;
        this.metadata = null;
        this.imagenet = null;
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
        photos.get(path).imagenet = null
        target.send("update-images", [photos.get(path)])
        try {
            new ExifImage({ image : path }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else {
                    photos.get(path).metadata = exifData;
                    let [year, month, day, hour, minute, second] = exifData.exif.DateTimeOriginal.split(/[ :]/);
                    photos.get(path).date = new Date(year, month-1, day, hour, minute, second)
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
                identified = identified.concat(e[i].class.split(", "));
            }
            if(identified.length == 0) {
                console.log("aaa")  // for some reason it doesn't work unless u log smth
                photos.get(path).imagenet = ["no keyword matches :\\"]
            } else {
                console.log("bb")  // same thing
                photos.get(path).imagenet = identified;
            }
            target.send("update-images", [photos.get(path)])
        }).catch((err)=>{
            photos.get(path).imagenet = ["information unavailable :("]
            target.send("update-images", [photos.get(path)])
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