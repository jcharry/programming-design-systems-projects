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

var f = new Rune.Font("./SourceCodePro-Medium.ttf");
var base = 180;//r.random(360);
var colors = colorSchemes.analogous(base, 4);
//var colors = colorSchemes.monochromatic(base, 5);
//var colors = colorSchemes.triadic(base, 3);
//var colors = colorSchemes.tetradic(base, 5);

f.load(err => {
    if (err) {
        console.log(err);
    }

    // Get a path of the text "Rune" from the font
    // a x,y 200,200 and font size 120.
    let startX = 100;
    let startY = ch / 2;
    r.rect(0, 0, cw, ch)
        .fill('hsv', base, 30, 30)
        .stroke(false);
    var path = f.toPath("HAIRY", startX, startY, 200);

    var polys = path.toPolygons({spacing: 2});

    polys.forEach((poly, index) => {
        let vectors = poly.state.vectors;
        vectors.forEach(vec => {
            let x = vec.x,
                y = vec.y;

            // Start a curve at each x and y point
            r.path(startX + x, startY + y)
                .curveTo(r.random(-20 * index / 3, 20 * index / 3),
                    r.random(10 * index, 50 * index),
                    r.random(-20, 20),
                    r.random(50 * index, 100 * index))
                .fill(false)
                .strokeWidth(r.random(1, 3))
                .stroke(colors[Math.floor(r.random(colors.length))]);
        });
    });

    r.draw();
});
