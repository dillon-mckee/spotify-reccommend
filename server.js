var unirest = require('unirest');
var express = require('express');
var events = require('events');

var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    unirest.get('https://api.spotify.com/v1/' + endpoint)
        .qs(args)
        .end(function(response) {
            if (response.ok) {
                emitter.emit('end', response.body);
            }
            else {
                emitter.emit('error', response.code);
            }
        });
    return emitter;
};

var app = express();
app.use(express.static('public'));

app.get('/search/:name', function(req, res) {
    var searchReq = getFromApi('search', {
        q: req.params.name,
        limit: 1,
        type: 'artist'
    });

    searchReq.on('end', function(item) {
        var artist = item.artists.items[0];
        console.log(item.artists);
        res.json(artist);
    });

    searchReq.on('error', function(code) {
        res.sendStatus(code);
    });



    // var relatedEndpoint = 'artists/' + artistId + '/related-artists';
    // console.log(relatedEndpoint);
    //
    // var relatedReq = getFromApi(relatedEndpoint, {
    //     limit:1
    // });
    //
    // relatedReq.on('end',function(item){
    //     console.log('I am relatedartists response ' + res.body);
    // })
    //
    // relatedReq.on('error', function(code) {
    //     res.sendStatus(code);
    // });
});

app.listen(8080, 'localhost');
