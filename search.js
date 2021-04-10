var natural = require('natural')

// arguments: string array of keywords, array of javascript objects with images and descriptors
function search_keywords(keywords, database){

    console.log("searching database")

    // array storing [number of matches, javascript object]
    var matches = []

    // go through all the image objects
    for(var obj in database) {
        // keep track of the number of keyword matches
        var match_count = 0

        // iterate through image classifiers
        for(var key in obj) {
            var val = obj[key]

            if(val.isArray()) {
                for(var x in val) {
                    for(var keyword in keywords) {
                        if(natural.PorterStemmer.stem(x) == natural.PorterStemmer.stem(keyword)) {
                            match_count += 1
                        }
                    }
                }
            }
            else {
                for(var keyword in keywords) {
                    if(natural.PorterStemmer.stem(val) == natural.PorterStemmer.stem(keyword)) {
                        match_count += 1
                    }
                }
            }
        }

        // add to array of matches
        if(match_count > 0) {
            matches.push([match_count, obj])
        }
    }

    // sort matching images by number of matches
    matches = matches.sort(function(a, b) {
        return b[0]-a[0]
    })
    for(var i=0; i<matches.length; i++) {
        matches[i] = matches[i][1]
    }

    return matches
}


// search by keyword type(a specific image classifier)
function search_keywords(keywords, type, database){

    console.log("searching database")

    // array storing [number of matches, javascript object]
    var matches = []

    // go through all the image objects
    for(var obj in database) {
        // keep track of the number of keyword matches
        var match_count = 0

        // iterate through image classifiers
        var val = obj[type]

        if(val.isArray()) {
            for(var x in val) {
                for(var keyword in keywords) {
                    if(natural.PorterStemmer.stem(x) == natural.PorterStemmer.stem(keyword)) {
                        match_count += 1
                    }
                }
            }
        }
        else {
            for(var keyword in keywords) {
                if(natural.PorterStemmer.stem(val) == natural.PorterStemmer.stem(keyword)) {
                    match_count += 1
                }
            }
        }
    }

    // add to array of matches
    if(match_count > 0) {
        matches.push([match_count, obj])
    }

    // sort matching images by number of matches
    matches = matches.sort(function(a, b) {
        return b[0]-a[0]
    })
    for(var i=0; i<matches.length; i++) {
        matches[i] = matches[i][1]
    }

    return matches
}