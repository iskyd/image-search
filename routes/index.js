'use strict'

var path = require('path');
var image = require('../app/index.js');

module.exports = function(app, db) {
    app.route('/').get(function(req, res){
        res.sendFile(path.resolve('public/index.html'));
    });

    app.get('/imagesearch/:query', function(req, res){
        var query = req.params.query;
        var size = req.query.offset || 10;

        image.searchAndReturnImage(query, size, res, db);
    })
    
    app.route('/latest/images').get(function(req, res){
        var search = db.collection('search');
        search.find(
            {}, 
            {
                query: 1,
                time: 1,
                _id: 0
            }, 
            {
                sort: '-time',
                limit: 10
            }
        ).toArray(function(err, documents) {
            if (err) throw error;

            res.send(documents);
        });
    })
}