/* global Rune */
var randomNumber = function(min, max) {
    return Math.random() * (max - min) + min;
};

// Expects two Rune Rectangles, so the property values
// are stored on state
var intersectRect = function(r1, r2) {
  return !(r2.state.x > r1.state.x + r1.state.width ||
           r2.state.x + r2.state.width < r1.state.x ||
           r2.state.y > r1.state.y + r1.state.height ||
           r2.state.y + r2.state.height < r1.state.y);
};

var Cone = function(options) {
    options = options || {}; // eslint-disable-line

    var x = options.x || 0,
        y = options.y || 0,
        width = options.width || 0,
        height = options.height || 0,
        parent = options.parent || null,
        primaryColor = options.primaryColor,
        secondaryColor = options.secondaryColor;

    var group = new Rune.Group(x, y);
    var iceCream = new Rune.Ellipse(0, -height / 10, width, height / 1.2)
        .fill(secondaryColor)
        .stroke(primaryColor);
    var sugarCone = new Rune.Triangle(-width / 2, 0, width / 2, 0, 0, height)
        .fill(primaryColor)
        .stroke(secondaryColor);

    var iceCreamHeight = height / 1.2;
    var sprinkleSize = options.sprinkleSize || 10;
    var sprinklesBoundingRect = {
        left: iceCream.state.x - width / 2 + sprinkleSize + 10,
        right: iceCream.state.x + width / 2 - sprinkleSize - 10,
        top: iceCream.state.y - iceCreamHeight / 2 + sprinkleSize,
        bottom: 0 - sprinkleSize,
        center: {
            x: iceCream.state.x + width / 2 - sprinkleSize - 10 - iceCream.state.x - width / 2 + sprinkleSize + 10,
            y: -sprinkleSize - iceCream.state.y - iceCreamHeight / 2 + sprinkleSize
        }
    };

    group.add(iceCream);
    group.add(sugarCone);

    var sprinkles = [];

    for (var i = 0; i < 80; i++) {
        console.log('sprinkle', i);
        var sx = randomNumber(sprinklesBoundingRect.left, sprinklesBoundingRect.right);
        var sy = randomNumber(sprinklesBoundingRect.top, sprinklesBoundingRect.bottom);

        var sprinkle = new Rune.Rectangle(sx, sy, sprinkleSize, sprinkleSize / 4)
            .fill(primaryColor)
            .stroke(secondaryColor)
            .round(2, 2);

        var intersected = false;

        // Rectangle Packing
        // Super inefficient and super simplified.
        // but it's fine for this since we're only drawing once
        // For all other sprinkles, check to see
        if (sprinkles.length > 0) {
            console.log('sprinkles is', sprinkles.length, 'long');
            sprinkles.forEach(function(s) {
                if (intersectRect(sprinkle, s)) {
                    intersected = true;
                }
            });
        } else {
            sprinkles.push(sprinkle);
        }

        if (!intersected) {
            sprinkle.rotate(randomNumber(0, 360), sx + sprinkleSize / 2, sy + sprinkleSize / 2);
            sprinkles.push(sprinkle);
            group.add(sprinkle);
        }
    }

    return group;
};


