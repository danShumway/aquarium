"use strict";

var app = require("app");
var BrowserWindow = require("browser-window");
var constants = require(__dirname + "/constants.js")

var mainWindow = null;

app.on("ready", function() {
    mainWindow = new BrowserWindow({
        width: constants.screenWidth,
        height: constants.screenHeight,
    });

    mainWindow.loadUrl("file://" + __dirname + "/index.html");
    mainWindow.setFullScreen(true);
});
