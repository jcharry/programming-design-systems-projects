/* global Rune Cone */
var canvasSize = {
    w: 11 * 100,
    h: 8.5 * 100
};

var rune = new Rune({
  container: "#canvas",
  width: canvasSize.w,
  height: canvasSize.h,
  debug: true
});

var coneSize = 150;

// Break the canvas into squares the size of ice group
// How many squares are there?
var cols = canvasSize.w / coneSize;
var rows = canvasSize.h / coneSize;

//var col = 1;
for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows * 2; j++) {
        var xOffset, yOffset, rot;

        if (j % 2 !== 0) {
            xOffset = coneSize / 2;
            yOffset = coneSize / 2;
            rot = 180;
        } else {
            xOffset = 0;
            yOffset = 0;
            rot = 0;
        }
        var x = i * coneSize + coneSize / 2 - xOffset;
        //var y = i % 2 === 0 ? coneSize : -coneSize;

        var y = j * coneSize / 2 + coneSize / 2 + yOffset;
        var cone = Cone({
            x: x,
            y: y,
            width: coneSize,
            height: coneSize,
            secondaryColor: j % 2 === 0 ? 0 : 255,
            primaryColor: j % 2 === 0 ? 255 : 0
        });

        cone.rotate(rot, x, y);

        //cone.move(0, 1);
        rune.stage.add(cone);
    }
}

rune.draw();
