var express = require('express');
var app = express();
var path = require('path');
var Delaunay = require('delaunay-triangulation');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/delaunay', jsonParser, function(req, res) {
    let vertices = req.body.map(pt => {
        return new Delaunay.Point(pt.x, pt.y);
    });

    let triangles = Delaunay.triangulate(vertices);

    res.send(triangles);
});

app.listen(8080, function() {
    console.log('listening on 8080');
});
