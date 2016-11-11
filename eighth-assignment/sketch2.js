/* global Rune noise _ Voronoi Delaunay */
/* eslint
    "no-redeclare": "off",
    "no-unused-vars": "off",
    "max-len": "off"
 */
let cw = 700;
let ch = 700;
let r = new Rune({
    container: "#canvas",
    width: cw,
    height: ch,
    debug: false
});

let margin = {
    x: 100,
    y: 100
};

let colors = {
    yellow: new Rune.Color('#C6C419'),
    blue: new Rune.Color('#479AD0'),
    purple: new Rune.Color('#794F5B'),
    orange: new Rune.Color('#C67C31'),
    lightyellow: new Rune.Color('#E5D2AA'),
    red: new Rune.Color('#C55A54'),
    lightbrow: new Rune.Color('#998263'),
    green: new Rune.Color('#8EAE63')
};

var sites = [];
for (let i = 0; i < 10; i++) {
    sites.push([r.random(0, r.width), r.random(0, r.height)]);
    // sites.push({
    //     x: r.random(0, r.width),
    //     y: r.random(0, r.height)
    // });
}

console.log('hi');

window.addEventListener('load', function() {
    $.ajax({
        type: 'GET',
        url: '/delaunay',
        success: function(res) {
            console.log(res);
        }
    });
    console.log($);
});

// let voronoi = new Voronoi();
// // Generate boxes of various sizes
// var bbox = {xl: margin.x, xr: r.width - margin.x, yt: margin.y, yb: r.height - margin.y}; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
// var diagram = voronoi.compute(sites, bbox);
//
// let polys = [];
// diagram.cells.forEach(cell => {
//     if (cell.halfedges.length > 0) {
//         console.log(cell);
//         let origin = cell.halfedges[0].getStartpoint();
//         let path = r.path(origin.x, origin.y)
//             .fill(false)
//             .stroke(false);
//         polys.push(path);
//         cell.halfedges.forEach((he, idx) => {
//             // let sp = he.getStartpoint();
//             // let x1 = sp.x;
//             // let y1 = sp.y;
//             let ep = he.getEndpoint();
//             let x2 = ep.x;
//             let y2 = ep.y;
//
//             path.lineTo(x2 - origin.x, y2 - origin.y);
//         });
//     }
// });
//
// polys.forEach(p => {
//     let keys = Object.keys(colors);
//     let randColor = keys[Math.floor(r.random(keys.length))];
//     console.log(randColor);
//     p.fill(colors[randColor]);
// });
r.draw();
