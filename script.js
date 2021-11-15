//////////////////////////////////////////
// MOTION AND ORIENTATION FUNCTIONALITY
//////////////////////////////////////////

// python code for the step counter server
// https://github.com/wesleybeckner/myStepCounter

// for ios 12+ we need the user to interact with the app
// in some fashion (eg clicking a button) and initiate
// a request ot use their devices' motion capabilities
function requestDeviceMotion() {
	console.log("clicked");
	if (
		typeof DeviceMotionEvent !== "undefined" &&
		typeof DeviceMotionEvent.requestPermission === "function"
	) {
		DeviceMotionEvent.requestPermission()
			.then((permissionState) => {
				if (permissionState === "granted") {
					window.addEventListener(
						"devicemotion",
						handleDeviceMotion2
					);
				}
			})
			.catch(console.error);
	} else {
		// handle regular non iOS 13+ devices
		console.log("not iOS");
		window.addEventListener("devicemotion", handleDeviceMotion2);
	}
}

// first we check to see that the
// browser supports devicemotion events
if (window.DeviceMotionEvent) {
	// first let's check to see that we've set everything up correctly
	// by printing out an affirmative that our window is registering
	// device motion events
	document.getElementById("acc_text").innerHTML = "we have support!";

	// if we have support, lets run our motion function
	// that we'll define. "devicemotion" is an event type available
	// to us w/in the addEventListener method
	// window.addEventListener("devicemotion", handleDeviceMotionEvent);
}

// our input variable is "devicemotion" from the event listener
function handleDeviceMotion1(event) {
	// here we will access a "devicemotion" attribute "acceleration"
	// w/in acceleration we will get acceleration in the x-axis
	// document.getElementById('acc_text').innerHTML = event.acceleration.x;
	document.getElementById("acc_text").innerHTML = event.acceleration.x;

	// w/in devicemotion we have a few different accelerometer options
	// to choose from. acceleration, accelerationIncludingGravity
	// and rotation rate (radians per second squared)
	// e.g.
	// event.accelerationIncludingGravity.x
	// event.rotationRate.alpha
}

// I'll create an array to push our motion information to
// and a date object so we can add times to our motion array
// (demo-ing here, I'll have to est a new Date obj evertime
// I want to log the time... see handleDeviceMotion2)
var ongoingMotion = new Array();
var ongoingRotation = new Array();
var d = new Date();

// define a new function called handleDeviceMotion2
// create x, y, and z variables for each of the accelerometer options
// to have a total of 9 unique variables.
function handleDeviceMotion2(event) {
	// create a variable grabbing our 'text' object from the DOM
	// (so that we don't have to type it out everytime)
	var mssg = document.getElementById("acc_text");

	// Acceleration (m/s2)
	var accX = event.acceleration.x;
	var accY = event.acceleration.y;
	var accZ = event.acceleration.z;

	// Accerlation w/ gravity (m/s2)
	var accXwG = event.accelerationIncludingGravity.x;
	var accYwG = event.accelerationIncludingGravity.y;
	var accZwG = event.accelerationIncludingGravity.z;

	// create vars for Rotation rate (r/s2) here
	var rotX = event.rotationRate.alpha;
	var rotY = event.rotationRate.beta;
	var rotZ = event.rotationRate.gamma;

	// now update the output message
	// format the output of each direction accel on a
	// new line. you can do this with the <br>
	// character. Use toFixed(1) to make your txt output
	// have only 1 decimal place. You can also append
	// to the innerHTML of your output mssg using +=

	// do this for both acceleration and acceleration w/Gravity.
	// what difference do you notice?
	mssg.innerHTML = accX.toFixed(1) + " <br>";
	mssg.innerHTML += accY.toFixed(1) + " <br>";
	mssg.innerHTML += accZ.toFixed(1) + " <br><br>";

	mssg.innerHTML += accXwG.toFixed(1) + " <br>";
	mssg.innerHTML += accYwG.toFixed(1) + " <br>";
	mssg.innerHTML += accZwG.toFixed(1) + " <br><br>";

	mssg.innerHTML += rotX.toFixed(1) + " <br>";
	mssg.innerHTML += rotY.toFixed(1) + " <br>";
	mssg.innerHTML += rotZ.toFixed(1) + " <br><br>";

	// next task we'd like to use this information for step counting
	// how might we code this out? we have our immediate xyz values
	// of acceleration, how do we build an array to make comparisons
	// between historical values?
	let time = new Date();
	let n = time.getTime();
	ongoingMotion.push(new Array(n, accX, accY, accZ));
	document.getElementById("motion_text").innerHTML =
		ongoingMotion[ongoingMotion.length - 1];
}
var test = new Array();
function sendSteps() {
	// make some dummy data to test out the API
	// (it is a good idea to test the components of your
	// webapp before stringing them all together! BUG?? WHERE??)
	test.push(new Array(100, 0.1, 0.4, -9.1));
	test.push(new Array(100, 0.1, 0.4, 9.1));

	// we can take this directly from postman!
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "https://mystepcounter.azurewebsites.net/steps", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(JSON.stringify(test));

	// update the page with the return
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("motion_text").innerHTML =
				"steps: " + this.responseText;
		}
	};
	window.setTimeout(sendSteps, 1000);
}

// Uncomment the below line to send step array data to our python server!
// window.setTimeout(sendSteps, 1000)

//////////////////////////////////////////
// MULTI-TOUCH FUNCTIONALITY
//////////////////////////////////////////

// there are two event types we'd like to add
// touchstart and touchend
window.addEventListener("touchstart", handleTouchChange);
window.addEventListener("touchend", handleTouchChange);

// now lets define our touch event function
function handleTouchChange(event) {
	// Start by setting touch text to a simple message to see that
	// our touch screen is registering
	// document.getElementById('touch_text').innerHTML = "hello";

	// what's another way we could check that touch is working?
	// console.log(event.touches);

	// use event.touches.length to print out the number of touch
	// points the screen is registering create a variable of
	// the touch text element to do this
	var mssg = document.getElementById("touch_text");
	mssg.innerHTML = event.touches.length + " touches";
}

// here we would like to allow our users to draw onto a canvas
// we'll begin by handling the intial touch points.
// create a variable for our canvas, and an event listener
// that listens for touchstart

var cvs = document.getElementById("canvas");
cvs.addEventListener("touchstart", handleStart);

// create an empty array to append our touches to
var ongoingTouches = [];

function handleStart(event) {
	// prevent default behaviors
	// if (event.type == 'touchstart')
	//   event.preventDefault();

	// initialize our canvas element with getContext
	// and create our touches variable, event.changedTouches
	var el = document.getElementById("canvas");
	var ctx = el.getContext("2d");
	var touches = event.changedTouches;

	// here, depending on how we've defined our wrapper
	// around our canvas, we need to compute the offset
	// for our drawing. It may be useful to use jquery
	// to get dimensions including margins. e.g.
	// $(elem).outerHeight(true)
	var box = document.getElementById("bbox");
	console.log(box.offsetWidth);

	var obj3 = document.getElementById("camera_text");
	console.log($(obj3).outerHeight(true));
	var xoff = (box.offsetWidth - el.offsetWidth) / 2 + 50;
	var yoff =
		box.offsetHeight - el.offsetHeight * 2 - $(obj3).outerHeight(true);

	for (var i = 0; i < touches.length; i++) {
		// add to our ongoingTouches array
		ongoingTouches.push(touches[i]);

		var color = "#000000";
		// our starting paths for drawing on the screen will be circles
		// use beginPath, arc, fillStyle, fill to create circles from
		// the touch point. arc(x, y, r, sAngle, eAngle, counterclockwise)
		// using arc draw a full circle (0 to 2 pi radians for the angles)
		ctx.beginPath();
		ctx.strokeStyle = "blue";
		ctx.strokeRect(
			touches[i].pageX - xoff,
			touches[i].pageY - yoff,
			10,
			10
		);
		// ctx.arc(touches[i].pageX-xoff,
		//         touches[i].pageY-yoff,
		// 10, 0, 2 * Math.PI, false);
		ctx.fillStyle = color;
		ctx.stroke();
		// ctx.fill();
	}
}

//////////////////////////////////////////
// CAMERA FUNCTIONALITY
//////////////////////////////////////////

// first lets check to see that the camera is available
// access the navigator object and check that it has
// mediaDevices and mediaDevices.getUserMedia.
// getUserMedia turns on a camera/mic (if available)
// via a prompt sent to the user
// navigator.mediaDevices.getUserMedia({video: true});

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices
		.getUserMedia({ video: true })
		.then(handleUserMediaSuccess)
		.catch(handleUserMediaError);
}

function handleUserMediaError(error) {
	console.log("camera error");
	console.log(error);
}

// write a function that initiates the camera video
function handleUserMediaSuccess(stream) {
	video = document.getElementById("my_video");
	video.style.width = document.width + "px";
	video.style.height = document.height + "px";

	// Other video attributes to play with:
	// video.setAttribute('autoplay', '');
	// video.setAttribute('muted', '');
	// video.setAttribute('playsinline', '');

	var constraints = {
		audio: false,
		video: {
			facingMode: "user",
		},
	};

	navigator.mediaDevices.getUserMedia(constraints).then(
		function success(stream) {
			video.srcObject = stream;

			// make a call to another function that we will use
			// to process our video stream in some way set the
			// interval to twice every second
			// window.setInterval(myVideoFunction, 500);
		},
		(reason) => {
			console.log("video stream not working");
		}
	);
}

function myVideoFunction() {
	var video = document.getElementById("my-video");
}
