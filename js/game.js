$(document).ready(function () {
// can also write "(function($){}(jQuery));"

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d"); //2D rendering context

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 96;
var paddleX = (canvas.width-paddleWidth)/2;
var pDX = 4;
var paddleFilled = true;

var rightPressed = false;
var leftPressed = false;

// event listeners
document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	switch (e.keyCode) {
		case 68: //D
			rightPressed = true;
			leftPressed = false;
			break;
		case 65: //A
			leftPressed = true;
			rightPressed = false;
			break;
	}
}
// function keyUpHandler(e) {
// 	switch (e.keyCode) {
// 		case 68: //D
// 			rightPressed = false;
// 			break;
// 		case 65: //A
// 			leftPressed = false;
// 			break;
// 	}
// }

function drawBall() {
	ctx.beginPath();
	ctx.arc(x,y,ballRadius,0,Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	// ctx.strokeStyle = "rgba(0,0,255,0.5)";
	// ctx.lineWidth = 4;
	// ctx.stroke();
	ctx.fillStyle = "rgba(0,0,255,0.5)";
	ctx.fill();
	ctx.closePath();
}

function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBall();
	drawPaddle();

	// ball bounces
	if (x + dx < ballRadius || x + dx > canvas.width-ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) { // ceiling
		dy = -dy;
	}
	if ((y + 1) > (canvas.height - paddleHeight - ballRadius)) { // floor
		// ball hits paddle
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			alert("oh awkward. you lost");
			// window.history.back(0);
			// window.location.href = window.location.href;
			// document.location.reload();
			// setTimeout(function(){
			// 	document.location.reload();
			// },100);
		}
	}

	// paddle bounces
	if (paddleX + pDX > canvas.width - paddleWidth + pDX) {
		leftPressed = true;
		rightPressed = false;
	}
	if (paddleX - pDX < 0 - pDX) {
		rightPressed = true;
		leftPressed = false;
	}
	// paddle moves
	if (rightPressed == true) {
		paddleX += pDX;
	}
	if (leftPressed == true) {
		paddleX -= pDX;
	}

	x += dx;
	y += dy;

}

setInterval(draw, 10);

});