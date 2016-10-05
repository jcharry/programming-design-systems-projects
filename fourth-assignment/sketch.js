/* global Rune colorSchemes */
/* eslint
    "no-redeclare": "off"
 */
var cw = 800;
var ch = 1000;

var r = new Rune({
    container: "#canvas",
    width: cw,
    height: ch
    //debug: true
});

var distSq = function(x1, y1, x2, y2) {
    return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
};

// http://stackoverflow.com/questions/3745760/java-generating-a-random-numbers-with-a-logarithmic-distribution
var randLog = function(max) {
    let zmii = 1.03;
    let idx = 4 * (max - Math.floor(Math.log((Math.random() * (Math.pow(zmii, max) - 1.0)) + 1.0) / Math.log(zmii)));
    return Math.random() < 0.5 ? idx : -idx;
};

var results = [];
for (var j = 0; j < 1000; j++) {
    let idx = randLog(r.height / 2);
    results.push(idx);
}

let dist = {};
results.forEach(function(res) {
    let strRes = String(res);
    if (dist[strRes]) {
        dist[strRes]++;
    } else {
        dist[strRes] = 1;
    }
});

console.log(dist);

var node = function(x, y, r, options) {
    var x = x || 0,
        y = y || 0,
        r = r || 0;

    var fill = typeof options.fill === undefined ? true : options.fill,
        stroke = typeof options.stroke === undefined ? true : options.stroke;

    var elt = new Rune.Circle(x, y, r)
        .stroke(stroke)
        .fill(fill);
    var neighbors = [];

    var addToStage = function(stage) {
        stage.add(elt);
    };

    var findKNeighbors = function(allNodes, k) {
        allNodes.forEach(function(n) {
            if (n === elt) {
                return;
            }
            if (distSq(n.elt.state.x, n.elt.state.y, elt.state.x, elt.state.y) < k * k) {
                neighbors.push(n);
            }
        });

        return neighbors;
    };

    return {
        elt,
        addToStage,
        findKNeighbors,
        neighbors
    };
};

let base = r.random(0, 360);

let {analogous, monochromatic, triadic, tetradic} = colorSchemes;
let analogousColors = analogous(base, 10);
let monoColors = monochromatic(base, 10);
let triadicColors = triadic(base, 10);
let tetradicColors = tetradic(base, 10);

let colorArr = monoColors;
colorArr.forEach(function(col) {
    console.log(`h: ${col.values.hsv[0]} s: ${col.values.hsv[1]} b: ${col.values.hsv[2]}`);
});
r.rect(0, 0, r.width, r.height)
    .stroke(false)
    .fill(colorArr[Math.floor(r.random(0, colorArr.length))]);
let circles = [];
for (var i = 0; i < 100; i++) {
    let x = r.width / 2 + randLog(r.width / 2);
    let y = r.height / 2 + randLog(r.height / 2);
    let n = node(x, y, r.random(1, 3), {
        fill: false,
        stroke: colorArr[Math.floor(r.random(0, colorArr.length))]
    });
    n.addToStage(r.stage);
    circles.push(n);
}

var curveParams = {
    xOff: 3,
    yOff: 1
};
circles.forEach(function(c) {
    c.findKNeighbors(circles, 100);

    c.neighbors.forEach(function(neighbor) {
        // Draw line to neighbor
        let x1 = c.elt.state.x,
            y1 = c.elt.state.y,
            x2 = neighbor.elt.state.x,
            y2 = neighbor.elt.state.y;

        //r.line(x1, y1, x2, y2);
        //r.path(x1, y1).curveTo((x2 - x1) / curveParams.xOff, (y2 - y1) / curveParams.yOff, x2 - x1, y2 - y1)
        r.path(x1, y1).lineTo(x2 - x1, y2 - y1)
            .fill(false)
            //.fill(false)
            .strokeWidth(r.random(0.1, 1))
            //.stroke(analogousColors[Math.floor(r.random(0, analogousColors.length))]);
            .stroke(colorArr[Math.floor(r.random(0, colorArr.length))]);
    });
});

//var rect = r.rect(0, 0, 100, 100)
    //.fill('hsv', 0, 0, 30)
    //.stroke(false);

r.draw();
