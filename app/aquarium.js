"use strict";
var constants = require(__dirname + "/constants"); //TODO: remove this (dependency: Fish)

function Fish(x, y, rotation) { var that=this; that.init(x, y, rotation); }
Fish.prototype = {
    constructor: Fish,

    params : constants.fish,
    init: function(x, y, rotation) {
        var that=this;
        that.x = x || 0;
        that.y = y || 0;
        that.rotation = rotation || 0;
        that.ticks = 0;
        that.pickTarget();

        // document.addEventListener('mousemove', function (e) {
        //     that.targetX = e.pageX;
        //     that.targetY = e.pageY;
        // });
    },
    pickTarget : function() {
        var that=this;
        that.targetX = Math.random()*constants.screenWidth;
        that.targetY = Math.random()*constants.screenHeight;
    },
    rotate : function(x, y) {
        var that=this;

        var targetRotation = that.targetRotation = Math.atan2(y - that.y, x - that.x);
        if(that.rotation < targetRotation) {
            that.rotation = (that.rotation + 0.05);
        } else {
            that.rotation = (that.rotation - 0.05);
        }
    },
    update: function() {
        var that=this;

        that.ticks++; //Increment our internal clock.

        //AI - some abstraction to come later.
        if(that.ticks >= 200) {
            that.ticks -= 200;
            that.pickTarget();
        }

        that.rotate(that.targetX, that.targetY);

        //Motion: Should be handled by World.
        that.x += Math.cos(that.rotation)*that.params.minSpeed;
        that.y += Math.sin(that.rotation)*that.params.minSpeed;
    }
}

function World(options) { var that=this; that.init(options); }
World.prototype = {
    constructor: World,

    init: function(options) {
        var that=this;

        that.fish = [];
        for(let i=options.numberOfFish-1;i>=0;i--) {
            let positionX = Math.random()*700;//options.screenWidth;
            let positionY = Math.random()*700;//options.screenHeight;
            let rotation = Math.random()*2*Math.PI;
            that.fish.push(new Fish(positionX, positionY, rotation));
        }
    },
    update: function() {
        var that=this;
        for(let i=that.fish.length-1;i>=0;i--) {
            let fish = that.fish[i];
            fish.update();
        }
    }
};

/**
 * Used for outputting world information to the screen.
 * @param {DOM} target - Canvas to draw to
 * @method Display
 * @constructor
 */
function Display(target) { var that=this; that.init(target); }
Display.prototype = {
    constructor: Display,
    init: function(target) {
        var that=this;
        that.canvas = target;
        that.context = that.canvas.getContext("2d");
    },
    /**
     * Take a world and render it to the screen.
     * @param  {World} world
     * @method render
     */
    render: function(world) {
        var that=this;
        var fishes = world.fish;

        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
        for(let i=fishes.length-1;i>=0;i--) {
            let fish = fishes[i];

            that.context.save();
            that.context.lineWidth=5;
            that.context.translate(fish.x, fish.y);
            that.context.rotate(fish.rotation);

            let path = new Path2D();
            path.moveTo(-20, -10);
            path.lineTo(0, 0);
            path.lineTo(-20, 10);
            that.context.stroke(path);
            that.context.restore();

            that.context.fillRect(fish.targetX, fish.targetY, 5, 5);
        }
    }
};

function Aquarium(constants) { var that=this; that.init(constants); }
Aquarium.prototype = {
    constructor: Aquarium,

    init: function(constants) {
        var that=this;


        that.world = new World(constants);
        that.displays = [];
        that.step = that.step.bind(that); //for preserving context with requestAnimationFrame
    },

    start: function() {
        var that=this;
        that.step();
    },

    step: function(timestep) {
        var that=this;
        that.world.update();
        for(let i=that.displays.length-1;i>=0;i--) {
            that.displays[i].render(that.world);
        }
        window.setTimeout(that.step, 1000/60); //There's no reason to use requestAnimationFrame here.
    },

    addTarget: function(target) {
        var that=this;
        that.displays.push(new Display(target));
    },
}

module.exports = Aquarium;
