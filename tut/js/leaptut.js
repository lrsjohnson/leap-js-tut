var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var controller = new Leap.Controller();

var canvasWidth;
var canvasHeight;

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
    
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientWidth;
}

function leapToScene(frame, leapPos) {
    var iBox = frame.interactionBox;

    var left = iBox.center[0] - iBox.size[0] / 2;
    var top = iBox.center[1] + iBox.size[1] / 2;

    var x = leapPos[0] - left;
    var y = leapPos[1] - top;

    var scene_x = x / iBox.size[0] * canvasWidth;
    var scene_y = y / iBox.size[1] * canvasHeight;

    return [scene_x, -scene_y];
}

function drawConnection(handPos, fingerPos) {
    console.log({h: handPos, f: fingerPos});
    c.strokeStyle = '#FFA040';
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(handPos[0], handPos[1]);
    c.lineTo(fingerPos[0], fingerPos[1]);
    c.closePath();
    c.stroke();
}


function drawFinger(fingerPos) {
    c.strokeStyle = '#39AECF';
    c.lineWidth = 5;
    c.beginPath();
    c.arc(fingerPos[0], fingerPos[1], 20, 0, Math.PI * 2);
    c.closePath();
    c.stroke();
}

function drawHand(handPos) {
    c.fillStyle = '#FF5A40';
    c.beginPath();
    c.arc(handPos[0], handPos[1], 40, 0, Math.PI * 2);
    c.closePath();
    c.fill();
}

function onAnimationFrame(frame) {
    var numberOfFingers = frame.fingers.length;

    c.clearRect(0, 0, canvasWidth, canvasHeight);
    
    for (var i = 0; i < frame.hands.length; i++) {
        var hand = frame.hands[i];
        var handPos = leapToScene(frame, hand.palmPosition);

        for (var j = 0; j < hand.fingers.length; j++) {
            var finger = hand.fingers[j];
            var fingerPos = leapToScene(frame, finger.tipPosition);
            drawConnection(handPos, fingerPos);
            drawFinger(fingerPos);
        }
        drawHand(handPos);
    }
}

controller.on('connect', onControllerConnect);
controller.on('deviceConnected', onDeviceConnected);
controller.on('deviceDisconnected', onDeviceDisconnected);
controller.on('ready', onLeapReady);
controller.on('animationFrame', onAnimationFrame);

controller.connect();