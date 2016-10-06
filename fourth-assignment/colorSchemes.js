/* global Rune */
let colorSchemes = function(){
    let analogous = function(base, numColors) {
        let colors = [];
        for (let i = 0; i < numColors; i++) {
            colors.push(new Rune.Color('hsv', base + i * 10, r.random(50, 100), r.random(30, 100)));
        }
        return colors;
    };

    let monochromatic = function(base, numColors) {
        let colors = [];
        // spacing of brightness and saturation
        let increment = 100 / numColors;
        for (let i = 0; i < numColors; i++) {
            //colors.push(new Rune.Color('hsv', base, r.random(0, 100), 30 + i * increment));
            colors.push(new Rune.Color('hsv', base, r.random(0, 100), r.random(0, 100)));
        }
        return colors;
    };

    let triadic = function(base, numColors) {
        let colors = [];
        for (let i = 0; i < numColors / 3; i++) {
            colors.push(new Rune.Color('hsv', base, r.random(50, 100), r.random(50, 100)));
            colors.push(new Rune.Color('hsv', base + 120, r.random(50, 100), r.random(50, 100)));
            colors.push(new Rune.Color('hsv', base + 240, r.random(50, 100), r.random(50, 100)));
        }
        return colors;
    };

    let tetradic = function(base, numColors) {
        let colors = [];
        for (var i = 0; i < numColors / 4; i++) {

            colors.push(new Rune.Color('hsv', base, r.random(50, 100), r.random(50, 100)));
            colors.push(new Rune.Color('hsv', base + 90, r.random(50, 100), r.random(50, 100)));
            colors.push(new Rune.Color('hsv', base + 180, r.random(50, 100), r.random(50, 100)));
            colors.push(new Rune.Color('hsv', base + 270, r.random(50, 100), r.random(50, 100)));
        }
        return colors;
    };

    return {
        analogous,
        monochromatic,
        triadic,
        tetradic
    };
}();
