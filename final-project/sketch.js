/* global Rune d3 $ */
/* eslint
    "no-use-before-define": "off"
 */

// Load foundation styles
$(document).foundation();

var cw = 800;
var ch = 800;
var r = new Rune({
    container: "#canvas",
    width: cw,
    height: ch,
    debug: false
});

var svg = d3.select('svg');
let boros = {};

// Save borough paths to an object
d3.json('boroughs.json', function(err, boroughs) {
    boroughs.features.forEach(b => {
        boros[b.properties.BoroName] = b;
    });

    if (err) {
        console.log(err);
    }

    main();
});

let drawBoro = function(boroName) {
    let boro = boros[boroName];
    // var scale = 60000;
    // let scale = 65000;
    let opts = {
        scale: 60000,
        offset: [r.width / 2, r.height / 2],
        center: []
    };
    switch (boroName) {
        case 'Bronx':
            opts.center = [-73.866920, 40.848473];
            opts.scale = 300000;
            break;
        case 'Brooklyn':
            opts.center = [-73.955498, 40.638300];
            opts.scale = 250000;
            break;
        case 'Manhattan':
            opts.center = [-73.966484, 40.778315];
            opts.scale = 300000;
            break;
        case 'Queens':
            opts.center = [-73.824474, 40.702657];
            opts.scale = 200000;
            break;
        case 'Staten Island':
            opts.center = [-74.143639, 40.586174];
            opts.scale = 250000;
            break;
        default:
            break;
    }

    let projection = d3.geoMercator()
        .center(opts.center)
        .scale(opts.scale)
        .translate(opts.offset);

    let path = d3.geoPath(projection);
    svg.append('path')
        .datum(boro)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', '3px');
};

let handleSubmit = function(e) {
    e.preventDefault();

    $('svg').empty();
    // Clear out svg for a fresh draw

    let hasfood = document.getElementsByName('hasfood')[0].value || 'No';
    // let size = document.getElementsByName('size')[0].value || 2000;
    let loc = document.getElementsByName('loc')[0].value || 'Bronx';
    let year = document.getElementsByName('year')[0].value || 2016;
    let age = (new Date()).getUTCFullYear() - year;
    if (age === 0) age = 1;
    let name = document.getElementsByName('name')[0].value;
    let acts = document.getElementsByName('activities')[0].options;
    let activities = Object.keys(acts)
        .map(key => {
            return acts[key];
        }).filter(opt => {
            return opt.selected;
        }).map(opt => {
            return opt.value;
        });

    let stats = {
        activities,
        hasfood,
        // size,
        loc,
        year,
        name,
        age
    };

    draw(stats);
};

let sigmoid = function(z) {
    return 20/ (1 + 10 * Math.pow(Math.E, -0.001 * z))
}
let map = function (x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

let drawBg = function(boro) {
    let bg = r.group(0, 0);
    window.bg = bg;
    bg.rotate(30, r.width / 2, r.height / 2, true);
    r.rect(-r.width, -r.height, r.width * 3, r.height * 3, bg)
        .stroke(false)
        .fill(210);
    switch (boro) {
        case 'Brooklyn':
            r.line(0, 0, 0, r.height, bg)
                .stroke(new Rune.Color('#FFCC00'))
                .strokeWidth(20)
            r.line(0, 0, r.width, 0, bg)
                .stroke(new Rune.Color('#FFCC00'))
                .strokeWidth(20)
            // r.rect(0, 0, r.width, r.height, bg)
            //     .stroke(new Rune.Color('#FFCC00'))
            //     .strokeWidth(10)
            //     .fill(210);
            break;
        case 'Bronx':
            r.rect(-200, 0, r.width + 400, r.height / 3, bg)
                .stroke(false)
                .fill(new Rune.Color('#FE6635'));
            // r.rect(-200, r.height / 3, r.width, r.height / 3, bg)
            //     .stroke(false)
            //     .fill(210);
            // r.rect(0, r.height * 2 / 3, r.width, r.height / 3, bg)
            //     .stroke(false)
            //     .fill(new Rune.Color('#086EFE'));
            break;
        case 'Queens':
            r.rect(-200 , 0, r.width + 400, r.height / 3, bg)
                .stroke(false)
                .fill(new Rune.Color('#0084FF'));
            // r.rect(0, r.height / 3, r.width, r.height / 3, bg)
            //     .stroke(false)
            //     .fill(210);
            // r.rect(0, r.height * 2 / 3, r.width, r.height / 3, bg)
            //     .stroke(false)
            //     .fill(new Rune.Color('#0084FF'))
            break;
        case 'Manhattan':
            r.rect(0, -200, r.width / 3, r.height + 400, bg)
                .stroke(false)
                .fill(new Rune.Color('#0084FF'));
            // r.rect(r.width / 3, 0, r.width / 3, r.height, bg)
            //     .stroke(false)
            //     .fill(210);
            // r.rect(r.width * 2 / 3, 0, r.width / 3, r.height, bg)
            //     .stroke(false)
            //     .fill(new Rune.Color('#0000CC'));
            break;
        case 'Staten Island':
            // r.rect(0, 0, r.width, r.height, bg)
            //     .stroke(false)
            //     .fill(210);
            break;
    }
}

let colors = {
    Brooklyn: {
        bg: new Rune.Color('#002358'),
        text: new Rune.Color(0, 0, 0)
    },
    Bronx: new Rune.Color('#00333B'),
    Queens: new Rune.Color('#00333B'),
    'Staten Island': new Rune.Color('#3A0070'),
    Manhattan: new Rune.Color('#140078'),
    chickens: new Rune.Color('#FFFFFF'),
    flowers: [new Rune.Color('#E42482'), new Rune.Color('#F7E309'), new Rune.Color('#BB76C6')],
    compost: new Rune.Color('#BA6B4E'),
    food: [new Rune.Color('#F9972D'), new Rune.Color('#70DB5E'), new Rune.Color('#C21613'), new Rune.Color('#5D2232'), new Rune.Color('#3A4334')],
    rainwater: new Rune.Color('#00529A'),
    public: new Rune.Color('#D46F00'),
    education: new Rune.Color('#80B34E'),
    art: new Rune.Color('#BDA623'),
    greens: [new Rune.Color('#183328'), new Rune.Color('#1C3D2B'), new Rune.Color('#18261C'), new Rune.Color('#1E3D23'), new Rune.Color('#1E331E')]
};

let margin = 50;
let draw = function(stats) {
    $('svg').empty();
    console.log(stats);
    drawBg(stats.loc);

    window.stats = stats;

    //TODO: Use a more flexible mapping here - something like a tanh function
    // let gridSize = Math.floor(sigmoid(stats.size));
    let gridSize = r.width * 0.8;
    let grid = r.grid({
        x: margin,
        y: margin,
        width: r.width - (margin * 2),
        height: r.height / 2,
        columns: 3,
        rows: 3,
        gutter: 0
    });

    // Draw parks and rec image
    // let img = new Rune.Image('./dpr_logo34.png', grid.state.x + 50, grid.state.y + 50, grid.state.width - 100, grid.state.height - 100);
    // r.stage.add(img);

    // drawBoro(stats.loc);
    let circles = drawCircularGrid(stats);

    // window.grid = grid;
    let idx = _.shuffle(grid.modules.map((mod, i) => {
        return i;
    }));

    if (stats.hasfood === 'yes') {
        colors.food.forEach(color => {
            // color.desaturate(0.2);
            let poly = circles.shift();
            poly.fill(color);
        });
    }

    if (stats.activities) {
        if (stats.activities.indexOf('chickens') !== -1) {
            let p = circles.shift();
            p.fill(colors.chickens);
        }
        if (stats.activities.indexOf('compost') !== -1) {
            let p = circles.shift();
            p.fill(colors.compost);
        }
        if (stats.activities.indexOf('flowers') !== -1) {
            colors.flowers.forEach(color => {
                // color.desaturate(0.3);
                let p = circles.shift();
                p.fill(color);
            });
        }
        if (stats.activities.indexOf('rainwater') !== -1) {
            let p = circles.shift();
            p.fill(colors.rainwater);
        }
        if (stats.activities.indexOf('public') !== -1) {
            let p = circles.shift();
            p.fill(colors.public);
        }
        if (stats.activities.indexOf('education') !== -1) {
            let p = circles.shift();
            p.fill(colors.education);
        }
        if (stats.activities.indexOf('art') !== -1) {
            let p = circles.shift();
            p.fill(colors.art);
        }
    }

    let shortNames = {
        Brooklyn: 'BK',
        Bronx: 'BX',
        Manhattan: 'M',
        'Staten Island': 'SI',
        Queens: 'Q'
    };

    let fontSize = 40;
    let name = new Rune.Text(stats.name, 0, fontSize)
        .fontFamily('Akkurat')
        .fontSize(fontSize)
        .fontWeight('bold')
        .stroke(false)
        .fill(0)
        .textAlign('left');
    let boro = new Rune.Text(shortNames[stats.loc], 0, fontSize - 5)
        .fontFamily('Akkurat')
        .fontSize(fontSize - 5)
        .stroke(false)
        .fill(0)
        .textAlign('left');
    // window.text = text;
    grid.add(name, 1, 2);
    // grid.add(boro, 1, 3);
    // r.stage.add(text);
    // grid.modules[grid.modules.length -1].add(text);
    r.draw();
};

let drawCircularGrid = function(stats) {
    // let center = new Rune.Circle(r.width / 2, r.height / 2, 100)
    //     .fill(0, 255, 0)
    //     .stroke(false);
    // r.stage.add(center);
    let circleGroup = new Rune.Group(r.width / 2, r.height);

    // Make a certain number of circular structures
    let numGrids = r.random(3, 10);

    // Radius step needs to shrink for older gardens
    let radiusStep = map(stats.age, 0, (new Date()).getUTCFullYear() - 1973, 60, 20);

    let polys = [];
    // Margins of the grid
    let gridSize = (r.width / 2) ;
    let radius = radiusStep;
    // for (let i = 1; i < numGrids; i++) {
    while (radius < gridSize) {
        let startAngle = r.random(0, Math.PI * 2);
        let numBlocks = Math.floor(r.random(2, 10));
        let angleMargin = 0.1;
        let angleStep = ((Math.PI * 2) - (numBlocks * angleMargin)) / numBlocks;

        // Only draw half a circle
        startAngle = Math.PI; //r.random(0, Math.PI * 2);
        angleStep = Math.PI * 2 / numBlocks;

        radius += radiusStep;
        let innerRad = radius - radiusStep * 0.5;

        // For each, divide up the circle into several discrete blocks
        let currentAngle = startAngle;
        for (let j = 0; j < numBlocks; j++) {
            let startX = radius * Math.cos(currentAngle);
            let startY = radius * Math.sin(currentAngle);
            let endX = radius * Math.cos(currentAngle + angleStep);
            let endY = radius * Math.sin(currentAngle + angleStep);
            let nearStartX = innerRad * Math.cos(currentAngle);
            let nearStartY = innerRad * Math.sin(currentAngle);
            let nearEndX = innerRad * Math.cos(currentAngle + angleStep);
            let nearEndY = innerRad * Math.sin(currentAngle + angleStep);

            // Approximation for control points to make a circle
            // Optimal distance from point to ctrl point
            // (4/3)*tan(pi/(2n))
            // n = numBlocks
            let d = (4 / 3) * Math.tan(Math.PI / (2 * numBlocks));
            let sr = new Rune.Vector(startX, startY);
            let er = new Rune.Vector(endX, endY);
            let st = new Rune.Vector(-sr.y, sr.x);
            let et = new Rune.Vector(er.y, -er.x);
            let nsr = new Rune.Vector(nearStartX, nearStartY);
            let ner = new Rune.Vector(nearEndX, nearEndY);
            let nst = new Rune.Vector(-nsr.y, nsr.x);
            let net = new Rune.Vector(ner.y, -ner.x);
            let ctrlX1 = startX + d * st.x;
            let ctrlY1 = startY + d * st.y;
            let ctrlX2 = endX + d * et.x;
            let ctrlY2 = endY + d * et.y;
            let nearCtrlX1 = nearEndX + d * net.x;
            let nearCtrlY1 = nearEndY + d * net.y;
            let nearCtrlX2 = nearStartX + d * nst.x;
            let nearCtrlY2 = nearStartY + d * nst.y;
            // let block = new Rune.Path(r.width / 2, r.height / 2)
            if (currentAngle < Math.PI * 2 + 0.01 && currentAngle > Math.PI - 0.01) {
                let block = new Rune.Path(0, 0)
                    .moveTo(startX, startY)
                    .curveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY)
                    .lineTo(nearEndX, nearEndY)
                    .curveTo(nearCtrlX1, nearCtrlY1, nearCtrlX2, nearCtrlY2, nearStartX, nearStartY)
                    .closePath()
                    .stroke(false)
                    // .strokeWidth(3)
                    // .stroke(j * 50,j * 50, 0)
                    .fill(colors.greens[Math.floor(r.random(colors.greens.length))])
                let poly = block.toPolygons({spacing: 1})[0];
                circleGroup.add(poly);
                window.cg = circleGroup;
                polys.push(poly);
                r.stage.add(circleGroup);
            }
            currentAngle += angleStep + angleMargin;
        }
    }

    return _.shuffle(polys);
};

function main() {
    document.getElementById('submit').addEventListener('click', handleSubmit);

    console.log(r.debug);
    if (r.debug) {
    }
    let stats = {
        activities: ['compost', 'chickens'],
        hasfood: true,
        size: 3200,
        loc: 'Brooklyn',
        year: 1998,
        age: 2016 - 1998,
        name: 'Family Affair Neighborhood Park'
    };
    draw(stats);
    // drawCircularGrid(stats);
}
