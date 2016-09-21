/* global Rune */
var cw = 600;
var ch = 800;
var r = new Rune({
  container: "#canvas",
  width: cw,
  height: ch,
  debug: true
});

// Planet radii
// earth - 6378.1
// mars = 3396.2
var ratio = 6378.1 / 3396.2,
    marsSize = r.random(50, 200),
    earthSize = r.random(200, 500),     //marsSize * ratio,
    xMargin = 20,
    ex = xMargin,
    ey = ch / 2,
    mx = cw - xMargin,
    my = ch / 2,
    spacing = 1,
    numStars = 200,
    numWaves = 30;

var bg = r.rect(0, 0, cw, ch)
    .fill(0);
//var sun = r.ellipse(0, ch / 2, 800, 800)
    //.fill(255);
//var earth = r.ellipse(ex, ch / 2, earthSize, earthSize)
    //.fill(255);
//var mars = r.ellipse(ex + spacing, ch / 2, marsSize, marsSize)
    //.fill(255);

//var sun = r.ellipse(0, ch, 1300, 850)
    //.fill(255);

// Waves
for (var i = numWaves; i > 0; i--) {
    var ms = marsSize * i / 10;
    var rx = mx - ms - spacing * i - marsSize / 2.4;
    var ry = my - ms / 2;

    r.rect(rx, ry, ms, ms)
        .stroke(255)
        .fill(0)
        .strokeWidth(2 / i)
        .rotate(i * 2, rx - ms / 2, ry - ms / 2);
}

for (var j = 0; j < numStars; j++) {
    var starSize = r.random(1, 3);

    r.ellipse(r.random(cw), r.random(ch), starSize, starSize)
        .fill(255);
}
var mars = r.ellipse(cw - xMargin, ch / 2, marsSize, marsSize)
    .fill(255);
var marsShadow = r.ellipse(cw - xMargin, ch / 2, marsSize - 8, marsSize)
    .fill(0);
var earth = r.ellipse(xMargin, ch / 2, earthSize, earthSize)
    .fill(255);
var earthShadow = r.ellipse(xMargin, ch / 2, earthSize - 8, earthSize)
    .fill(0);

r.draw();
