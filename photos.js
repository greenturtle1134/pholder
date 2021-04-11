const ExifImage = require('exif').ExifImage;
const imagenet = require("./imagenet.js")
const natural = require('natural')
class PhotoData {
    constructor() {
        this.metadata = null;
        this.imagenet = null;
    }
}

module.exports.Photos = class {
    constructor() {
        this.photos = new Map();
    }
    
    addPhoto(path) {
        var photos = this.photos;
        photos.set(path, new PhotoData);
        try {
            new ExifImage({ image : path }, function (error, exifData) {
                if (error)
                    console.log('Error: '+error.message);
                else {
                    photos.get(path).metadata = exifData;
                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
        imagenet.classify(path).then((e)=>{
            let identified = [];
            for(let i = 0; i<e.length; i++) { // Do we want to filter away low-probability identifications?
                identified = identified.concat(e[i].className.split(", "));
            }
            photos.get(path).imagenet = identified;
            console.log(identified);
        });
    }

    addPhotos(paths) {
        for (path in paths) {
            this.addImage(path);
        }
    }

    searchPhotos(queries, photopaths) {
        // queries is an array of search terms, photopaths is an array of paths
        // assuming photos.get(path).imagenet returns an array of keywords associated with photo
        // returns a sorted array of paths
        var photos = this.photos
        var matches = []
        for(var path in photopaths) {
            var match_count = 0
            var keywords = photos.get(path).imagenet
            if(keyword != null) {
                for(keyword in keywords) {
                    for(query in queries) {
                        if(natural.PorterStemmer.stem(query) == natural.PorterStemmer.stem(keyword)) {
                            match_count += 1
                        }
                    }
                }
                if(match_count > 0) {
                    matches.push([match_count, path])
                }
            }
        }
        matches = matches.sort(function(a, b) {
            return b[0]-a[0]
        })
        for(var i=0; i<matches.length; i++) {
            matches[i] = matches[i][1]
        }
        return matches
    }
}