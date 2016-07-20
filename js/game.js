$(document).ready(function () { // can also write "(function($){}(jQuery));"

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d"); // 2D rendering context

// GLOBAL GAME VARIABLES
var active = true;
var points = 0;

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

var bricks = [];
var brickRowCount = 3;
var brickColCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickMarginTop = 30;
var brickMarginLeft = 30;
var fallCount = 0;
function makeBricks() {
    for(c=0; c<brickColCount; c++) {
    	bricks[c] = [];
        for(r=0; r<brickRowCount; r++) {
        	bricks[c][r] = { x: 0, y: 0, status: 1 };
            var brickX = (c*(brickWidth+brickPadding))+brickMarginLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickMarginTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
        }
    }
}
makeBricks();

// EVENT LISTENERS
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
	if (!active && e.keyCode == 32) {
		console.log("spacebar");
		document.location.reload();
	};
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
function drawBricks() {
	for(c=0; c<brickColCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
	            ctx.beginPath();
	            ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
	            ctx.fillStyle = "#0095DD";
	            ctx.fill();
	            ctx.closePath();
	        }
        }
    }
}
function ballHitBrick(x1, y1, w1, h1, x2, y2) {
	/*
	(x1,y1) = (x,y) coordinates of object 1
	w1 = width of object 1; w2 = height of object 1
	(x2,y2) = (x,y) coordinates of object 2
	*/
	if ((x1 <= x2 && x1+w1 >= x2) && (y1 <= y2 && y1+h1 >= y2)) {
		return true;
	} else {
		return false;
	}
}
function collisionDetection() {
	for(c=0; c<brickColCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1) {
				if (ballHitBrick(b.x, b.y, brickWidth, brickHeight, x, y)) {
					dy = -dy
					b.status = 0;
				}
			}
		}
	}
}
function gameOver() {
	ctx.font = "30px Helvetica";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("oh... awkward. you lost", canvas.width/2, canvas.height/2);
	// setTimeout(function() {
	// 	alert("Play again?");
	// }, 3000);
}
// ACTION STARTS HERE
function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBricks();
	drawPaddle();
	drawBall();
	collisionDetection();

	if (active) {
		// ball bounces
		if (x + dx < ballRadius || x + dx > canvas.width-ballRadius) {
			dx = -dx;
		}
		if (y + dy < ballRadius) { // ceiling
			dy = -dy;
		}
		if (y + dy > canvas.height - paddleHeight - ballRadius) { // floor
			// ball hits paddle
			if (x > paddleX && x < paddleX + paddleWidth) {
				dy = -dy;
			} else {
				active = false;
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
		// bricks fall
		if (fallCount % 100 == 0) {
			console.log("fallCount " + fallCount);
			for(c=0; c<brickColCount; c++) {
				for(r=0; r<brickRowCount; r++) {
					bricks[c][r].y += 2;
				}
			}
		}
		fallCount+=1;

	} else { // !active
		gameOver();
	}
	// ball moves
	x += dx;
	y += dy;
}

setInterval(draw, 10);

});