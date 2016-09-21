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
//var ratio = 6378.1 / 3396.2,
    //marsSize = r.random(50, 200),
    //earthSize = r.random(200, 500),     //marsSize * ratio,
    //xMargin = 20,
    //ex = xMargin,
    //ey = ch / 2,
    //mx = cw - xMargin,
    //my = ch / 2,
    //spacing = 1,
    //numStars = 200,
    //numWaves = 20;

var marsY = ch - ch / 1.5;
var marsH = 800;//ch - marsY;
var marsW = cw * 2;
var marsX = -(marsW / 2 - cw / 2);
var bg = r.rect(0, 0, cw, ch)
    .fill(0);

// 3 rectangles, offset
//var mars = r.rect(marsX, marsY, marsW, marsH)
    //.rotate(10, cw / 2, ch - marsY / 2);

r.ellipse(cw / 2, ch / 2 - 5, cw + 230, ch / 1.29)
    .fill(255);
r.ellipse(cw / 2, ch / 2, cw + 200, ch / 1.3)
    .fill(0);

// Crater



r.draw();

/*
//var sun = r.ellipse(0, ch / 2, 800, 800)
    //.fill(255);
//var earth = r.ellipse(ex, ch / 2, earthSize, earthSize)
    //.fill(255);
//var mars = r.ellipse(ex + spacing, ch / 2, marsSize, marsSize)
    //.fill(255);

//var sun = r.ellipse(0, ch, 1300, 850)
    //.fill(255);


for (var j = 0; j < numStars; j++) {
    var starSize = r.random(1, 3);

    r.ellipse(r.random(cw), r.random(ch), starSize, starSize)
        .fill(255);
}
var earth = r.ellipse(xMargin, ch / 2, earthSize, earthSize)
    .fill(255);
var earthShadow = r.ellipse(xMargin, ch / 2, earthSize - 8, earthSize)
    .fill(0);
// Waves
for (var i = numWaves; i > 0; i--) {
    var ms = marsSize * i / 10;
    var rx = mx - ms - spacing * i - marsSize / 2.4;
    var ry = my - ms / 2;

    r.rect(rx, ry, ms, ms)
        .stroke(255)
        .fill(0, 0.001)
        .strokeWidth(2 / i)
        .rotate(i * 2, rx - ms / 2, ry - ms / 2);
}
var mars = r.ellipse(cw - xMargin, ch / 2, marsSize, marsSize)
    .fill(255);
var marsShadow = r.ellipse(cw - xMargin, ch / 2, marsSize - 8, marsSize)
    .fill(0);

r.draw();
*/
