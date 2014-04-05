var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var controller = new Leap.Controller({enableGestures: true});

var canvasWidth;
var canvasHeight;

// Per timest
var frame;

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

function leapToScene(leapPos) {
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

var keyTaps = [];
var KEYTAP_LIFETIME = 3;
var KEYTAP_START_SIZE = 15;

function onTap(gesture) {
    var pos = leapToScene(gesture.position);
    var time = frame.timestamp;
    keyTaps.push({pos: [pos[0], pos[1]], time: time, type: gesture.type});
}

function updateKeyTaps() {
    for (var i = 0; i < keyTaps.length; i++) {
        var keyTap = keyTaps[i];
        var age = (frame.timestamp - keyTap.time) / 1000000;
        if ( age > KEYTAP_LIFETIME) {
            keyTaps.splice(i, 1);
        }
    }
}

function drawKeyTaps() {
    for (var i = 0; i < keyTaps.length; i++) {
        var keyTap = keyTaps[i];

        var x = keyTap.pos[0];
        var y = keyTap.pos[1];

        var age = (frame.timestamp - keyTap.time) / 1000000;

        var completion = age / KEYTAP_LIFETIME;
        var timeLeft = 1 - completion;

        c.strokeStyle = "#FF2300";
        c.lineWidth = 3;

        c.beginPath();
        c.arc(x, y, KEYTAP_START_SIZE, 0, Math.PI * 2);
        c.closePath();
        c.stroke();

        var opacity = timeLeft;
        var radius = Math.max(KEYTAP_START_SIZE * timeLeft, 0);

        c.fillStyle = "rgba(256, 33, 0, " + opacity + ")";
        
        c.beginPath();
        c.arc(x, y, radius, 0, Math.PI * 2);
        c.closePath();
        c.fill();
    }
}

function displayText(message) {
    // Defines the font shape and size
    c.font = "30px Helvetica";
    
    // Tells Canvas how to align text
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    
    // Tells Canvas to draw the The number of fingers,
    // at the center of the canvas
    c.fillText(message , canvasWidth/2 , canvasHeight * 2 / 3 );
 }

function onAnimationFrame(newFrame) {
    frame = newFrame;
    var numberOfFingers = frame.fingers.length;

    c.clearRect(0, 0, canvasWidth, canvasHeight);

    if (frame.hands.length > 1) {
        displayText("Error: ensure only one hand is over the controller.");
        return false;
    }
    
    for (var i = 0; i < frame.hands.length; i++) {
        var hand = frame.hands[i];
        var handPos = leapToScene(hand.palmPosition);

        for (var j = 0; j < hand.fingers.length; j++) {
            var finger = hand.fingers[j];
            var fingerPos = leapToScene(finger.tipPosition);
            drawConnection(handPos, fingerPos);
            drawFinger(fingerPos);
        }
        drawHand(handPos);
    }

    for (var i = 0; i < frame.gestures.length; i++) {
        var gesture = frame.gestures[i];
        switch (gesture.type) {
        case "keyTap":
        case "screenTap":
            onTap(gesture);
            break;
        }
    }

    updateKeyTaps();
    drawKeyTaps();
}

controller.on('connect', onControllerConnect);
controller.on('deviceConnected', onDeviceConnected);
controller.on('deviceDisconnected', onDeviceDisconnected);
controller.on('ready', onLeapReady);
controller.on('animationFrame', onAnimationFrame);

controller.connect();