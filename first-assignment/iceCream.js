/* global Rune Cone */
var map = function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

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
var numCones = 20;

var centerCone = Cone({
    x: canvasSize.w / 2,
    y: canvasSize.h / 2,
    width: coneSize,
    height: coneSize,
    primaryColor: 255,
    secondaryColor: 0,
    canvasSize: canvasSize,
    sprinkleSize: 15
});

var rightCones = (function() {
    var arr = [];

    for (var i = numCones / 2; i > 0; i--) {
        var x = canvasSize.w / 2 + i * coneSize / 2;
        var y = canvasSize.h / 2;
        var c = Cone({
            x: x,
            y: y,
            width: coneSize,
            height: coneSize,
            secondaryColor: i % 2 === 0 ? 0 : 255,
            primaryColor: i % 2 === 0 ? 255 : 0
        });

        //c.scale(1 / i);
        c.rotate(i * 10, x, y);
        c.scale(1 / i);
        arr.push(c);
    }

    return arr;
}());

var leftCones = (function() {
    var arr = [];

    for (var i = numCones / 2; i > 0; i--) {
        var x = canvasSize.w / 2 - i * coneSize / 2,
            y = canvasSize.h / 2;
        var c = Cone({
            x: x,
            y: y,
            width: coneSize,
            height: coneSize,
            primaryColor: i % 2 === 0 ? 255 : 0,
            secondaryColor: i % 2 === 0 ? 0 : 255
            //scale: (i === 0 ? 0.9 : 1 / i * 3)
        });

        //c.scale(0.7 / i);
        c.rotate(-i * 10, x, y);
        c.scale(1 / i);
        arr.push(c);
    }

    return arr;
}());

//var backgrounds = [];

//for (var i = 70; i > 0; i--) {
    //var side = i * 50;
    //var x = canvasSize.w / 2 - side / 2,
        //y = canvasSize.h / 2 - side / 2;
    //var r = new Rune.Rectangle(x, y, side, side)
        //.fill(i % 2 === 0 ? 255 : 0)
        //.stroke(255, 0.01);

    ////r.rotate(3 * i, canvasSize.w / 2, canvasSize.h / 2);
    //backgrounds.push(r);
    ////rune.stage.add(r);
//}


var allCones = leftCones.concat(rightCones, centerCone);
//var allCones = [centerCone];

var coneCounter = 0;

allCones.forEach(function(cone) {
    //cone.scale(1 / ++coneCounter);
    // Add a rotated background square
    rune.stage.add(cone);
});


rune.draw();
