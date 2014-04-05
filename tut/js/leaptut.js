var canvas = document.getElementById('canvas');

var controller = new Leap.Controller();


// Setup Leap events.
function onControllerConnect() {
    console.log('Successfully Connected.');
}

function onDeviceConnected() {
    console.log('Leap device has been connected.');
}

function onDeviceDisconnected() {
    console.log('Leap device has been disconnected.');
}

function onLeapReady() {
    console.log('Leap is ready.');
    var c = canvas.getContext('2d');

    var img = new Image();
    img.src = "img/leap-logo.jpg";
    img.onload = function() {
        c.drawImage(img, 0, 0);
    }
}

controller.on('connect', onControllerConnect);
controller.on('deviceConnected', onDeviceConnected);
controller.on('deviceDisconnected', onDeviceDisconnected);
controller.on('ready', onLeapReady);

controller.connect();