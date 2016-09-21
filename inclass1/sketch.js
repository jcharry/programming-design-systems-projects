var canvasSize = {
    w: 800,
    h: 600
};
var rune = new Rune({
  container: "#canvas",
  width: canvasSize.w,
  height: canvasSize.h,
  debug: true
});

var cx = rune.width / 2,
    cy = rune.height / 2,
    bigRectSize = rune.random(200, 300),
    smallRectSize = rune.random(50, 150),
    sx = cx + bigRectSize / 2 - smallRectSize / 2,
    sy = cy + bigRectSize / 2 - smallRectSize / 2;

var bigRect = rune.rect(cx - bigRectSize / 2, cy - bigRectSize / 2, bigRectSize, bigRectSize)
    .fill(255, 0, 0)
    .stroke(0, 255, 255);
var smallRect = rune.rect(sx, sy, smallRectSize, smallRectSize)
    .rotate(45, sx + smallRectSize / 2, sy + smallRectSize / 2)
    .fill(0, 255, 0)
    .stroke(255, 0, 0);


var str = 'change';
rune.draw();
