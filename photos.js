const ExifImage = require('exif').ExifImage;
const imagenet = require("./imagenet.js")
class PhotoData {
    constructor() {
        this.metadata = null;
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
}