var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

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
}

function onAnimationFrame(frame) {
    var numberOfFingers = frame.fingers.length;

    var width = canvas.width;
    var height = canvas.height;

    c.clearRect(0, 0, width, height);
    c.font = "30px Arial";
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText( numberOfFingers, width / 2, height / 2);
}

controller.on('connect', onControllerConnect);
controller.on('deviceConnected', onDeviceConnected);
controller.on('deviceDisconnected', onDeviceDisconnected);
controller.on('ready', onLeapReady);
controller.on('animationFrame', onAnimationFrame);

controller.connect();