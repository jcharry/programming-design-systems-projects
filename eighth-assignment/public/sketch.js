/* global Rune $ Packer */
/* eslint
    "no-redeclare": "off",
    "no-unused-vars": "off",
    "max-len": "off"
 */
let cw = 1000;
let ch = 2000;
let r = new Rune({
    container: "#canvas",
    width: cw,
    height: ch,
    debug: true
});

let margin = {
    x: 100,
    y: 100
};

let backgroundColors = {
    yellow: new Rune.Color('#B5A83F'),
    green: new Rune.Color('#5B6934'),
    purple: new Rune.Color('#7D6F89'),
    marroon: new Rune.Color('#8D515B'),
    orange: new Rune.Color('#B78129'),
    red: new Rune.Color('#D24B38')
};

let colors = {
    yellow: new Rune.Color('#C6C419'),
    blue: new Rune.Color('#479AD0'),
    purple: new Rune.Color('#794F5B'),
    orange: new Rune.Color('#C67C31'),
    lightyellow: new Rune.Color('#E5D2AA'),
    red: new Rune.Color('#C55A54'),
    lightbrow: new Rune.Color('#998263'),
    green: new Rune.Color('#8EAE63')
};

function randomColor(clrs) {
    let keys = Object.keys(clrs);
    let randKey = keys[Math.floor(r.random(keys.length))];
    return clrs[randKey];
}

let polys = [];

function choice(arr) {
    let idx = Math.floor(r.random(arr.length));
    return arr[idx];
}

function constructContainers() {
    let widths = [r.width / 2, r.width / 3, r.width];
    let heights = [r.height / 3, r.height / 2, r.height];
    var blocks = [
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)},
        {w: choice(widths), h: choice(heights)}
    ];

    var packer = new Packer(r.width, r.height);
    packer.fit(blocks);
    let retBlocks = [];
    blocks.forEach(block => {
        if (block.fit) {
            retBlocks.push(block);
        }
    });
    return retBlocks;
}

function constructVertices(numVerts, bbox) {
    bbox = bbox || {
        x: 100,
        y: 100,
        w: r.width - 100,
        h: r.height - 100
    };

    let vertices = [];
    for (let i = 0; i < numVerts; i++) {
        vertices.push({
            x: r.random(bbox.x, bbox.w),
            y: r.random(bbox.y, bbox.h)
        });
    }

    return vertices;
}
function postVertices(verts) {
    var promise = new Promise(function(resolve, reject) {
        $.ajax({
            method: 'POST',
            url: '/delaunay',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(verts),
            success: function(res) {
                resolve(res);
            },
            error: function(err) {
                console.log(err);
                reject('stuff failed');
            }
        });
    });
    return promise;
}

function drawTriangles(triangles) {
    triangles.forEach(tri => {
        let startX = tri.p1.x;
        let startY = tri.p1.y;
        let triangle = r.polygon(startX, startY)
            .lineTo(0, 0)
            .lineTo(tri.p2.x - startX, tri.p2.y - startY)
            .lineTo(tri.p3.x - startX, tri.p3.y - startY)
            .fill(randomColor(colors))
            .stroke(false);
        polys.push(triangle);
    });
}

window.addEventListener('load', function() {
    let blocks = constructContainers();

    let vertices = [];
    blocks.forEach(block => {
        let numVerts = Math.floor(block.w * block.h / 30000);
        console.log(numVerts);
        let verts = constructVertices(numVerts, {
            x: block.fit.x + r.random(0, 100),
            y: block.fit.y + r.random(0, 100),
            w: block.fit.x + block.w - r.random(0, 100),
            h: block.fit.y + block.h - r.random(0, 100)
        });

        r.rect(block.fit.x, block.fit.y, block.w, block.h)
            .stroke(0)
            .strokeWidth(15)
            .fill(randomColor(backgroundColors));

        postVertices(verts).then(res => {
            vertices.push(res);
            if (vertices.length === blocks.length) {
                vertices.forEach(vert => {
                    drawTriangles(vert);
                });

                r.draw();
            }
        }, err => {
            console.warn(err);
        });
    });
});

r.draw();
