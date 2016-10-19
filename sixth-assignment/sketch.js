/* global Rune */
/* eslint
    "no-redeclare": "off",
    "no-unused-vars": "off"
 */
let cw = 800;
let ch = 1000;
let r = new Rune({
    container: "#canvas",
    width: cw,
    height: ch
});

let margin = 50;

// Draw background
let numLines = 100 / r.height;
console.log(numLines);
let n = new Rune.Noise();
let xStep = 10;
let yStep = 1;
n.noiseSeed = r.random(100);
for (let i = 0; i < r.height; i += yStep) {
    let path = r.path(0, i);
    let noiseStep = 0;
    n.noiseSeed = r.random(100);
    for (let j = 0; j < r.width + xStep; j += xStep) {
        path.lineTo(j, n.get(noiseStep) * 100)
            .fill(false)
            .stroke('hsv', 25, 0 + numLines * i, 100);
        noiseStep += 0.1;
    }
}

let drawText = function() {
    let grid = r.grid({
        x: margin,
        y: margin,
        width: cw - margin * 2,
        height: ch - margin * 2,
        columns: 3,
        rows: 3
    });

    let fontFamily = 'Adobe Garamond Pro';
    let title = r.text('Dune', 0, 0)
        .fill(0)
        .fontFamily(fontFamily)
        .fontWeight('normal')
        .fontStyle('normal')
        .fontSize(36)
        .stroke(false);
    title.move(0, title.state.fontSize);
    grid.add(title, 1, 1);

    let author = r.text('Frank Herbert', grid.state.moduleWidth, grid.state.moduleHeight)
        .fill(0)
        .stroke(false)
        .fontFamily(fontFamily)
        .fontSize(24)
        .textAlign('right');
    grid.add(title, 1, 1);
    grid.add(author, 3, 3);
};

let drawGraphic = function() {
    let centerMargin = margin;
    let centerGrid = r.grid({
        x: centerMargin,
        y: centerMargin,
        width: cw - centerMargin * 2,
        height: ch - centerMargin * 2,
        columns: 1,
        rows: 1
    });

    let eye = new Rune.Path(0, centerGrid.state.moduleHeight / 2)
        .curveTo(centerGrid.state.moduleWidth / 2, -centerGrid.state.moduleHeight / 3, centerGrid.state.moduleWidth, 0)
        .curveTo(centerGrid.state.moduleWidth / 2, centerGrid.state.moduleHeight / 3, 0, 0)
        .strokeWidth(2)
        .fill(false);
    eye = eye.toPolygons({spacing: 3})[0];
    eye.fill(0);
    centerGrid.add(eye, 1, 1);

    let numRings = 50;
    let pupilPoly = new Rune.Circle(centerGrid.state.moduleWidth / 2, centerGrid.state.moduleHeight / 2, centerGrid.state.moduleHeight / 6); //eslint-disable-line
    pupilPoly = pupilPoly.toPolygon({spacing: 1});
    for (let i = 0; i < numRings; i++) {
        let b;
        if (i < numRings / 2) {
            b = 30 + i + r.random(40);
        } else {
            b = 100 - i - r.random(40);
        }
        let pupil = new Rune.Circle(centerGrid.state.moduleWidth / 2, centerGrid.state.moduleHeight / 2, centerGrid.state.moduleHeight / 6 - i) //eslint-disable-line
            .stroke('hsv', 229, 100, b)
            .strokeDash('1 1 1')
            .fill(false);
        centerGrid.add(pupil);
    }

    let step = 1;
    for (let i = 0; i < centerGrid.state.moduleWidth; i += step) {
        for (let j = 0; j < centerGrid.state.moduleHeight; j += step) {
            if (eye.contains(i, j) && !pupilPoly.contains(i, j)) {
                let circle = new Rune.Circle(i, j, 1)
                    .stroke(false)
                    .fill('hsv', 229, 100, 100 - r.random(30), 0.6);
                centerGrid.add(circle);
            }
        }
    }
};

drawText();
drawGraphic();

r.draw();
