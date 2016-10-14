/* eslint
    "no-use-before-define": "off"
 */

/*
 * quadTree.js
 * Copyright (C) 2016 jamiecharry <jamiecharry@Jamies-Air-2.home>
 *
 * Distributed under terms of the MIT license.
 */

let Node = {};
Node.prototype = {
    init: function(x, y, w, h) {
        this.bounds = {x: x, y: y, w: w, h: h};
        this.children = [];
        this.bounds = {};
        this.nodes = [];
        this.maxChildren = 10;
        this.maxDepth = 5;
    },
    insert: function(item) {

    },
    clear: function() {

    },
    isLeaf: function() {

    }
};

let node = function(x, y, width, height) {
    let n = Object.create(Node.prototype);
    n.init(x, y, width, height);
    return n;
};

let Quadtree = {};
Quadtree.prototype = {
    init: function(x, y, width, height, options) {
        options = options || {};
        this.bounds = {x: x, y: y, w: width, h: height};
        this.root = node(x, y, width, height);
        this.maxDepth = options.maxDepth || 5;
        this.maxChildren = options.maxChildren || 10;
        this.bounds = {x: x, y: y, w: width, h: height};
        this.level = options.level || 0;
        this.nodes = [];
        this.objects = [];
    },
    clear: function() {
        this.root.clear();
        this.nodes.forEach(n => {
            n.clear();
            n = null;
        });
    },
    split: function() {
        let subWidth = this.bounds.w / 2;
        let subHeight = this.bounds.h / 2;
        let x = this.bounds.x;
        let y = this.bounds.y;

        this.nodes[0] = quadtree(x, y, subWidth, subHeight, {level: this.level + 1});
        this.nodes[1] = quadtree(x + subWidth, y, subWidth, subHeight, {level: this.level + 1});
        this.nodes[2] = quadtree(x, y + subHeight, subWidth, subHeight, {level: this.level + 1});
        this.nodes[3] = quadtree(x + subWidth, y + subHeight, subWidth, subHeight, {level: this.level + 1});
    },
    //insert: function(item) {
        //// Can insert an array of items, or just a single item
        //if (item instanceof Array) {
            //item.forEach(i => {
                //root.insert(i);
            //});
        //} else {
            //root.insert(item);
        //}
    //},
    get: function(item) {
        return root.get(item).slice(0);
    },
    draw: function(ctx, color) {
        ctx.fillStyle = randColor();
        ctx.beginPath();
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.moveTo(this.bounds.x,  this.bounds.y);
        ctx.lineTo(this.bounds.x + this.bounds.width, this.bounds.y);
        ctx.lineTo(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height);
        ctx.lineTo(this.bounds.x,  this.bounds.y + this.bounds.height);
        ctx.lineTo(this.bounds.x,  this.bounds.y);
        ctx.stroke();
        this.nodes.forEach(n => {
            n.draw(ctx);
        });
    },
    getIndex: function(item) {
        let index = -1;
        let verticalMidpoint = this.bounds.x + this.bounds.w / 2;
        let horizontalMidpoint = this.bounds.y + this.bounds.h / 2;

        // Object can completely fit in the top quadrents
        let topQuad = item.y < horizontalMidpoint && item.y + item.height < horizontalMidpoint;
        // Object can completely fit into the bottom rectangle
        let bottomQuad = item.y > horizontalMidpoint;

        // Object can completely fit within the left quadrants
        if (item.x < verticalMidpoint && item.x + item.width < verticalMidpoint) {
            if (topQuad) {
                index = 1;
            } else if (bottomQuad) {
                index = 2;
            }
        } else if (item.x > verticalMidpoint) {
            if (topQuad) {
                index = 0;
            } else if (bottomQuad) {
                index = 3;
            }
        }
        return index;
    },
    insert: function(item) {
        // If this tree has child nodes...
        if (this.nodes[0]) {
            // Get the index where the item belongs to
            let index = this.getIndex(item);

            // If we found a location, then add it to that node
            if (index !== -1) {
                this.nodes[index].insert(item);
                return;
            }
        }

        // If nodes don't exist, then add it to this tree
        this.objects.push(item);

        // Check if we've exceeded our limit for items in this tree
        if (this.objects.length > this.maxChildren && this.level < this.maxDepth) {
            // Split!
            this.split();

            // Add objects to the child nodes, since we've split
            let i = 0;
            while (i < this.objects.length) {
                let index = this.getIndex(this.objects[i]);
                if (index !== -1) {
                    this.nodes[index].insert(this.objects.shift());
                } else {
                    i++;
                }
            }
        }
    },
    retrieve: function(list, item) {
        let index = this.getIndex(item);
        if (index !== -1 && this.nodes.length !== 0) {
            this.nodes[index].retrieve(list, item);
        }

        list.push(...this.objects);

        return list;
    }
};

let quadtree = function(x, y, width, height) {
    let q = Object.create(Quadtree.prototype);
    q.init(x, y, width, height);
    return q;
};

var randColor = function() {
    return randomColors[Math.floor(Math.random() * randomColors.length)];
};

var randomColors = [
'#4EE2EC',
'#81D8D0',
'#92C7C7',
'#77BFC7',
'#78C7C7',
'#48CCCD',
'#43C6DB',
'#46C7C7',
'#7BCCB5',
'#43BFC7',
'#3EA99F',
'#3B9C9C',
'#438D80',
'#348781',
'#307D7E',
'#5E7D7E',
'#4C787E',
'#008080',
'#4E8975',
'#78866B',
'#848b79',
'#617C58',
'#728C00',
'#667C26',
'#254117',
'#306754',
'#347235',
'#437C17',
'#387C44',
'#347C2C',
'#347C17',
'#348017',
'#4E9258',
'#6AA121',
'#4AA02C',
'#41A317',
'#3EA055',
'#6CBB3C',
'#6CC417',
'#4CC417',
'#52D017',
'#4CC552',
'#54C571',
'#99C68E',
'#89C35C',
'#85BB65',
'#8BB381',
'#9CB071',
'#B2C248',
'#9DC209',
'#A1C935',
'#7FE817',
'#59E817',
'#57E964',
'#64E986',
'#5EFB6E',
'#00FF00',
'#5FFB17',
'#87F717',
'#8AFB17',
'#6AFB92',
'#98FF98',
'#B5EAAA',
'#C3FDB8',
'#CCFB5D',
'#B1FB17',
'#BCE954',
'#EDDA74',
'#EDE275',
'#FFE87C',
'#FFFF00',
'#FFF380',
'#FFFFC2',
'#FFFFCC',
'#FFF8C6',
'#FFF8DC',
'#F5F5DC',
'#FBF6D9',
'#FAEBD7',
'#F7E7CE',
'#FFEBCD',
'#F3E5AB',
'#ECE5B6',
'#FFE5B4',
'#FFDB58',
'#FFD801',
'#FDD017',
'#EAC117',
'#F2BB66',
'#FBB917',
'#FBB117',
'#FFA62F',
'#E9AB17',
'#E2A76F',
'#DEB887',
'#FFCBA4',
'#C9BE62',
'#E8A317',
'#EE9A4D',
'#C8B560',
'#D4A017',
'#C2B280',
'#C7A317',
'#C68E17',
'#B5A642',
'#ADA96E',
'#C19A6B',
'#CD7F32',
'#C88141',
'#C58917',
'#AF9B60',
'#AF7817',
'#B87333',
'#966F33',
'#806517',
'#827839',
'#827B60',
'#786D5F',
'#493D26',
'#483C32',
'#6F4E37',
'#835C3B',
'#7F5217',
'#7F462C',
'#C47451',
'#C36241',
'#C35817',
'#C85A17',
'#CC6600',
'#E56717',
'#E66C2C',
'#F87217',
'#F87431',
'#E67451',
'#FF8040',
'#F88017',
'#FF7F50',
'#F88158',
'#F9966B',
'#E78A61',
'#E18B6B',
'#E77471',
'#F75D59',
'#E55451',
'#E55B3C',
'#FF0000',
'#FF2400',
'#F62217',
'#F70D1A',
'#F62817',
'#E42217',
'#E41B17',
'#DC381F',
'#C34A2C',
'#C24641',
'#C04000',
'#C11B17',
'#9F000F',
'#990012',
'#8C001A',
'#954535',
'#7E3517',
'#8A4117',
'#7E3817',
'#800517',
'#810541',
'#7D0541',
'#7E354D',
'#7D0552',
'#7F4E52',
'#7F5A58',
'#7F525D',
'#B38481',
'#C5908E',
'#C48189',
'#C48793',
'#E8ADAA',
'#ECC5C0',
'#EDC9AF',
'#FDD7E4',
'#FCDFFF',
'#FFDFDD',
'#FBBBB9',
'#FAAFBE',
'#FAAFBA',
'#F9A7B0',
'#E7A1B0',
'#E799A3',
'#E38AAE',
'#F778A1',
'#E56E94',
'#F660AB',
'#FC6C85',
'#F6358A',
'#F52887',
'#E45E9D',
'#E4287C',
'#F535AA',
'#FF00FF',
'#E3319D',
'#F433FF',
'#D16587',
'#C25A7C',
'#CA226B',
'#C12869',
'#C12267',
'#C25283',
'#C12283',
'#B93B8F',
'#7E587E',
'#571B7E',
'#583759',
'#4B0082',
'#461B7E',
'#4E387E',
'#614051',
'#5E5A80',
'#6A287E',
'#7D1B7E',
'#A74AC7',
'#B048B5',
'#6C2DC7',
'#842DCE',
'#8D38C9',
'#7A5DC7',
'#7F38EC',
'#8E35EF',
'#893BFF',
'#8467D7',
'#A23BEC',
'#B041FF',
'#C45AEC']
