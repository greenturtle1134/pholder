var ExifImage = require('exif').ExifImage;
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
    }

    addPhotos(paths) {
        for (path in paths) {
            this.addImage(path);
        }
    }
}