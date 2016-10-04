/* global Rune */
(function() {

var cw = 800;
var ch = 800;
var r = new Rune({
  container: "#canvas",
  width: cw,
  height: ch,
  debug: true
});

// Sharp
var drawSpikes = function(fill) {
    var spikes = r.path(0, 0).fill(fill)
        .strokeWidth(2)
        .stroke('#000000');
    var numPoints = 200;
    var xStep = cw / numPoints;
    var yStep = ch / numPoints;


    for (var j = 0; j < numPoints * 4; j++) {
        var shouldSpike = false;
        var randStep = 0;

        // corner ranges happen
        // when j is with x units of a multiple of numPoints

        if (r.random(0, 1) < 0.2) {

            if (!(j < 20 || 
                (j > numPoints - 20 && j < numPoints + 20) ||
                (j > (numPoints * 2) - 20 && j < (numPoints * 2) + 20) ||
                (j > (numPoints * 3) - 20 && j < (numPoints * 3) + 20) ||
                (j > (numPoints * 4) - 20 && j < (numPoints * 4) + 20))) {
                    shouldSpike = true;
                }  else {
                }
        }

        // Draw around the border,
        // break loop into 4 regions
        if (j < numPoints) {
            // Top
            if (shouldSpike) {
                randStep = r.random(3, 10);

                spikes.lineTo(j * xStep + randStep, r.random(50, 100));
                j += randStep - 1;
            } else {
                spikes.lineTo(xStep * j, r.random(5, 15));
            }
        } else if (j < numPoints * 2) {
            // Right
            if (shouldSpike) {
                randStep = r.random(3, 10);

                spikes.lineTo(cw + r.random(-100, -50), (j - numPoints) * yStep + randStep);
                j += randStep;
            } else {
                spikes.lineTo(cw + r.random(-15, -5), yStep * (j - numPoints));
            }
        } else if (j < numPoints * 3) {
            // Bottom
            if (shouldSpike) {
                randStep = r.random(3, 10);

                spikes.lineTo(cw + (j - numPoints * 2) * -xStep - randStep, ch + r.random(-100, -50));
                //spikes.lineTo(cw + r.random(-100, -50), (j - numPoints) * yStep + randStep);
                j += randStep;
            } else {
                spikes.lineTo(cw + (j - numPoints * 2) * -xStep, ch + r.random(-15, -5));
            }
        } else {
            // Left
            if (shouldSpike) {
                randStep = r.random(3, 10);

                spikes.lineTo(r.random(50, 100), ch - (j - numPoints * 3) * yStep - randStep);
                j += randStep;
            } else {
                spikes.lineTo(r.random(5, 15), ch - (j - numPoints * 3) * yStep - randStep) 
            }
        }
    }
}


// Wet
function drawWater(fill, rotate) {
    var poly = r.polygon(cw / 2, ch / 2).fill(false).stroke('#ffffff').strokeWidth(2);
        numPoints = 360,
        step = Math.PI * 2 / numPoints,
        radius = 200,
        rotate = rotate || 0,
        numWaves = 10,
        offsetHeight = 20;

    for (var i = 0; i < numPoints; i++) {
        var rOffset = Math.sin(i * step * numWaves) * offsetHeight;
        if ((step * i) < Math.PI) {
            rOffset = 0;
        }
        var x = Math.cos(i * step) * (radius - rOffset)
            y = Math.sin(i * step) * (radius - rOffset);
        poly.lineTo(x, y);
    }

    //poly.rotate(rotate, cw / 2, ch / 2);

}

for (var i = 0; i < 3; i++) {
    var fill = i % 2 === 0 ? '#000000' : '#ffffff';
    drawSpikes(fill);
    drawWater(fill, i * 20);
}

r.draw();

}());
