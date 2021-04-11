const ExifImage = require('exif').ExifImage;
const imagenet = require("./imagenet.js")
const natural = require('natural')
const {ipcMain} = require('electron');
class PhotoData {
    constructor(path) {
        this.path = path;
        this.metadata = null;
        this.imagenet = null;
    }

    match(query) {
        if(query === null) {
            return true;
        }
        if(this.imagenet !== null) {
            console.log(this.imagenet)
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
            let identified = [];
            var tokenizer = new natural.WordTokenizer()
            for(let i = 0; i<e.length; i++) { // Do we want to filter away low-probability identifications?
                // identified = identified.concat(e[i].className.split(", "));
                var tokens = tokenizer.tokenize(e[i].className)
                for(let j = 0; j<tokens.length; j++) {
                    identified.push(tokens[j])
                }
            }
            photos.get(path).imagenet = identified;
            console.log(identified);
            target.send("update-images", [photos.get(path)])
        });
    }

    addPhotos(paths) {
        for (path in paths) {
            this.addImage(path);
        }
    }

    filter(query) {
        this.query = query;
        let results = [];
        for(const [path, photo] of this.photos.entries()){
            if(photo.match(query)){
                results.push(photo);
            }
        }
        this.target.send("replace-images", results);
    }

    // searchPhotos(queries, photopaths) {
    //     // queries is an array of search terms, photopaths is an array of paths
    //     // assuming photos.get(path).imagenet returns an array of keywords associated with photo
    //     // returns a sorted array of paths
    //     var photos = this.photos
    //     var matches = []
    //     for(var path in photopaths) {
    //         var match_count = 0
    //         var keywords = photos.get(path).imagenet
    //         if(keyword != null) {
    //             for(keyword in keywords) {
    //                 for(query in queries) {
    //                     if(natural.PorterStemmer.stem(query) == natural.PorterStemmer.stem(keyword)) {
    //                         match_count += 1
    //                     }
    //                 }
    //             }
    //             if(match_count > 0) {
    //                 matches.push([match_count, path])
    //             }
    //         }
    //     }
    //     matches = matches.sort(function(a, b) {
    //         return b[0]-a[0]
    //     })
    //     for(var i=0; i<matches.length; i++) {
    //         matches[i] = matches[i][1]
    //     }
    //     return matches
    // }
}