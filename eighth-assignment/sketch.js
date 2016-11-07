/* global Rune noise */
/* eslint
    "no-redeclare": "off",
    "no-unused-vars": "off"
 */
let cw = 1800;
let ch = 600;
let r = new Rune({
    container: "#canvas",
    width: cw,
    height: ch,
    debug: false
});

let olympicColors = [
    new Rune.Color('00298C', 0.5),
    new Rune.Color('FFEF08', 0.5),
    new Rune.Color('000000', 0.5),
    new Rune.Color('087B39', 0.5),
    new Rune.Color('DE1818', 0.5)
];

// Brush stroke technique heavily inspired by this:
// https://bl.ocks.org/maelp/5913757
function drawLogo(logoSize, numBodies, headSize, brushWidth) {
    brushWidth = brushWidth || 20;
    headSize = headSize || 20;

    let colors = shuffle(olympicColors),
        offset = [-1, 0, 1],
        t = 0.01, // step distance for drawing bezier
        numPoints = 1 / t,
        brushStep = brushWidth / (numPoints / 2);

    let numOuterPoints = 8;
    let numInnerPoints = 16;
    let outerPoints = divideCircle(logoSize, 8);
    let innerPoints = divideCircle(logoSize / 2, 8);

    let g = r.group(r.width / 2, r.height / 2);
    if (r.debug === true) {
        outerPoints.forEach(p => {
            g.add(r.circle(p.x, p.y, 2));
        });

        innerPoints.forEach(p => {
            g.add(r.circle(p.x, p.y, 2));
        });
    }

    let bgPoints = 360;
    let angleStep = Math.PI * 2 / 360;
    let outerPath = r.path(0, 0, g);
    outerPath.moveTo(logoSize);
    for (var i = 0; i < bgPoints; i++) {
        let x = logoSize * Math.cos(angleStep * i) + r.random(-0.5, 0.5);
        let y = logoSize * Math.sin(angleStep * i) + r.random(-0.5, 0.5);
        outerPath.lineTo(x, y)
            .stroke(false)
            .fill('#C70025');
    }

    numBodies = numBodies || 2;
    for (let i = 0; i < numBodies; i++) {
        // Shuffle the innerPoints so we get different control points each time
        let sips = shuffle(innerPoints);
        let startIndex = Math.floor(r.random(outerPoints.length));
        let endIndex = startIndex + Math.floor(outerPoints.length / 2) + choice(offset);
        endIndex = endIndex <= outerPoints.length - 1 ? endIndex : endIndex - outerPoints.length;

        let p0 = outerPoints[startIndex],
            p1 = sips[0],
            p2 = sips[1],
            p3 = outerPoints[endIndex];

        // Find points along bezier curve
        let points = bezierPoints(t, p0, p1, p2, p3);

        let bw = 0,
            posPoints = [],
            negPoints = [];

        // For each point along the curve,
        // find it's normal vector,
        // then offset two points based on 'brush' thickness
        points.forEach((p, index, arr) => {
            // Skip the last point (since it doesn't have a next point)
            if (index >= arr.length - 1) {
                return;
            }

            // Get angle of vector
            let np = arr[index + 1];
            let v = new Rune.Vector(np.x - p.x, np.y - p.y);
            v = v.normalize();
            let normal = new Rune.Vector(-v.y, v.x);

            // for the brush stroke, we should get bigger as we move towards the
            // center of the stroke, then start shrinking again
            if (index < arr.length / 2) {
                bw += brushStep + r.random(0, 1);
            } else {
                bw -= brushStep + r.random(0, 1);
            }

            // If we're halfway, draw a circle (kind of like a head on a body);
            if (index === Math.floor(arr.length / 2)) {
                // Here's where we should draw a circle!, but only once
                let c = new Rune.Circle(p.x + normal.x * bw, p.y + normal.y * bw, headSize).fill(255).stroke(false);
                g.add(c);
            }

            // Collect points that make up the brush stroke
            posPoints.push({
                x: p.x + normal.x * bw,
                y: p.y + normal.y * bw
            });
            negPoints.push({
                x: p.x - normal.x * bw,
                y: p.y - normal.y * bw
            });
        });

        // Reverse the center path of the stroke and append it to the end of the
        // brush stroke points (we want the path to go out along the brush stroke,
        // and come back along the center line)
        points.reverse();
        posPoints.push(...points);
        negPoints.push(...points);
        drawPath(posPoints, g, {fill: 255, stroke: 255});
        drawPath(negPoints, g, {fill: 255, stroke: 255});
    }
    return g;
}

for (let i = 1; i < 4; i++) {
    let numBodies = Math.floor(r.random(0, 5));
    let headSize = r.random(3, 20);
    let brushWidth = r.random(5, 12);
    let l = drawLogo(200, numBodies, headSize, brushWidth);
    //let l1 = drawLogo(100, 3, 5, 5);
    l.move(200 * 2.5 * i, r.height / 2);

    let fontSize = 64;
    r.text('TOKYO 2020', 0, 200 + fontSize, l)
        .stroke(false)
        .fill(0)
        .fontSize(fontSize)
        .fontFamily('bauserif')
        .textAlign('center');
}

r.draw();

// Draw a path given points
function drawPath(points, parent, options) {
    let fill = options.fill || '#123123';
    let stroke = options.stroke || false;
    let path = new Rune.Path(0, 0).fill(fill).stroke(stroke);
    path.moveTo(points[0].x, points[0].y);
    points.forEach((p, index) => {
        // Skip first index
        if (index === 0) {
            return;
        }

        path.lineTo(p.x, p.y);
    });

    path.closePath();
    parent.add(path);
}

function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

//http://stackoverflow.com/questions/16227300/how-to-draw-bezier-curves-with-native-javascript-code-without-ctx-beziercurveto
function bezier(t, p0, p1, p2, p3) {
    let cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX;

    let cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY;

    let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

    return {x: x, y: y};
}

function bezierPoints(t, p0, p1, p2, p3) {
    let points = [];
    for (let i = 0; i < 1; i += t) {
        let b = bezier(i, p0, p1, p2, p3);
        points.push(b);
    }
    return points;
}

function divideCircle(radius, numPoints) {
    let angleStep = (Math.PI * 2) / numPoints;
    let points = [];
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: radius * Math.cos(angleStep * i),
            y: radius * Math.sin(angleStep * i)
        });
    }

    return points;
}
