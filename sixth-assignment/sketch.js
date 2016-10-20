/* global Rune noise */
/* eslint
    "no-redeclare": "off",
    "no-unused-vars": "off"
 */
let cw = 800;
let ch = 1000;
let r = new Rune({
    container: "#canvas",
    width: cw,
    height: ch,
    debug: false
});

let bgColor = new Rune.Color('hsv', 23, 80, 80);
let margin = 50;
let drawFreq = 3;
let numLoops = 0;

let drawBg = function() {
    r.rect(0, 0, r.width, r.height)
        .stroke(false)
        .fill(bgColor);
};
drawBg();

let makeEye = function(width, height) {
    let eye = new Rune.Group(0, 0);

    // Make background texture using perlin noise
    let eyeBg = [];
    for (var x = 3; x < width - 3; x++) {
        for (var y = 3; y < height - 3; y++) {
            numLoops++;
            let value = Math.abs(noise.perlin2(x / 50, y / 50));
            value *= 100;
            if (numLoops % drawFreq === 0) {
                eye.add(new Rune.Circle(x, y, 3)
                    .fill('hsv', 229, 100 - value, 100, 0.5)
                    .stroke(false));
            }
        }
    }

    let pupil = new Rune.Circle(width / 2, height / 2, height / 8)
        .stroke(false)
        .fill(0);
    let pupilRings = (function() {
        let rings = [];
        let ringCount = 0;
        for (var rad = height / 9; rad > 3; rad--) {
            ringCount++;
            let ring = new Rune.Circle(width / 2, height / 2, rad)
                .stroke(false)
                .fill('hsv', 229, 100, 100 - rad);
            rings.push(ring);
        }
        rings.push(new Rune.Circle(width / 2, height / 2, 20).fill(0).stroke(false));

        return rings;
    })();

    // Mask background with an eye shaped path
    let eyeMask = new Rune.Path(0, 0)
        .lineTo(width, 0)
        .lineTo(width, height)
        .lineTo(0, height)
        .stroke(false)
        .closePath()
        .moveTo(0, height / 2)
        .curveTo(width / 2, height / 4, width, height / 2)
        .curveTo(width / 2, height - height / 4, 0, height / 2)
        .fill(bgColor)
        .fillRule('evenodd');

    // Add mask to group
    eye.add(eyeMask);

    pupilRings.forEach(p => {
        eye.add(p);
    });

    return eye;
};

let createText = function(grid) {
    let text = [];
    let fontFamily = 'Adobe Garamond Pro';
    let title = r.text('Dune', 0, 0)
        .fill(0)
        .fontFamily(fontFamily)
        .fontWeight('normal')
        .fontStyle('normal')
        .fontSize(36)
        .stroke(false);
    title.move(0, title.state.fontSize);
    text.push(title);
    //grid.add(title, 1, 1);

    let author = r.text('Frank Herbert', grid.state.moduleWidth, grid.state.moduleHeight)
        .fill(0)
        .stroke(false)
        .fontFamily(fontFamily)
        .fontSize(24)
        .textAlign('right');
    text.push(author);
    //grid.add(author, 3, 3);
    return text;
};

let createMountains = function(yStart, width, numMountains, xStep = 50, yStep = 20) {
    let paths = [];
    let noise = new Rune.Noise();
    for (var m = 0; m < numMountains; m++) {
        let noiseStep = 0;
        let path = new Rune.Path(-3, yStart + yStep + noise.get(0) * 100)
            .stroke(false)
            .strokeWidth(2)
            .fill('hsv', 25 + r.random(-5, 5), 80, 100);
        for (var l = -3; l < width + xStep; l += xStep) {
            noise.noiseSeed(r.random(100));
            let y = yStep * m + noise.get(noiseStep) * 100 - 200 * noiseStep;
            if (m === 0 && l === 0) {
                path.lineTo(l, 0);
            } else {
                path.lineTo(l, y);
            }
            noiseStep += 0.1;

            if (Math.abs(width + xStep - l) < xStep) {
                // We're probably on the last pass
                path.lineTo(l, y + 1000)
                    .lineTo(-3, y + 1000)
                    .closePath();
            } else {
            }
        }

        r.stage.add(path);
    }
};

// Create grid and attach items
let grid = r.grid({
    x: margin,
    y: margin,
    width: cw - margin * 2,
    height: ch - margin * 2,
    columns: 3,
    rows: 3
});

let eyeGridMargin = 100;
let eyeGrid = r.grid({
    x: eyeGridMargin,
    y: eyeGridMargin,
    width: r.width - eyeGridMargin * 2,
    height: r.height - eyeGridMargin * 2,
    columns: 1,
    rows: 1
});

let text = createText(grid);
let eye = makeEye(eyeGrid.state.moduleWidth, eyeGrid.state.moduleHeight);
let mountains = createMountains(r.height - 400, r.width, 15);
eyeGrid.add(eye, 1, 1);

// Can't add author to grid since it falls behind the mountain
// but use grid coords to place it on top
text[1].state.x = grid.modules[grid.modules.length - 1].state.x + grid.state.moduleWidth;
text[1].state.y = grid.modules[grid.modules.length - 1].state.y + grid.state.moduleHeight;
grid.add(text[0], 1, 1);
r.stage.add(text[1]);

let start = Date.now();
r.draw();
let end = Date.now();
console.log(`Drawing took: ${(end - start) / 1000}s`);
