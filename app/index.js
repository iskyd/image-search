var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "b727a98ab01fe051fff29de6be955b69",
      secret: "64896c16d9e84b68"
    };


var util = require('util');

module.exports = {
    searchAndReturnImage: function(query, offset, res, db) {
        module.exports.persist(query, db)
        Flickr.authenticate(flickrOptions, function(error, flickr) {
            flickr.photos.search({
                text: query,
                page: 1,
                per_page: offset
            }, function(err, result){
                result = module.exports.parseResult(result.photos.photo)
                res.send(result)
            });
        });
    },
    parseResult: function(photos) {
        var result = [];
        for(var i = 0; i < photos.length; i++) {
            var url = "https://farm" + photos[i].farm + ".staticflickr.com/" + photos[i].server + "/" + photos[i].id + "_" + photos[i].secret + ".jpg"
            result.push({
                url: url
            });
        }

        return result
    },
    persist: function(query, db) {
        var obj = {
            query: query,
            time: new Date()
        }
        var search = db.collection('search');
        search.save(obj, function(err, result){
            if (err) throw err;
            console.log('Saved ' + result)
        })
    },
}