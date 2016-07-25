$(document).ready(function () { // can also write "(function($){}(jQuery));"

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d"); // 2D rendering context
$('#gameCanvas').css('background-color', '#19A698');

// GLOBAL GAME VARIABLES
var active = true;
var score = 0;
var winStatus = 0;

var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3.5;
var dy = -3.5;
var ballColor = "red"; // #BFBD1D

var paddleHeight = 10;
var paddleWidth = 96;
var paddleX = (canvas.width-paddleWidth)/2;
var pDX = 5;
var paddleFilled = true;
var rightPressed = false;
var leftPressed = false;

var bricks = [];
var brickRowCount = 10;
var brickColCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPaddingTop = 5;
var brickPaddingLeft = 10;
var brickMarginTop = 200;
var brickMarginLeft = 30;
var fallCount = 0;
var fallRate = 6;
function makeBricks() {
    for(c=0; c<brickColCount; c++) {
    	bricks[c] = [];
    	console.log("made brick "+c);
        for(r=0; r<brickRowCount; r++) {
        	bricks[c][r] = { x: 0, y: 0, status: 2 };
        	console.log("brick "+c+" at row "+r);
            var brickX = (c*(brickWidth+brickPaddingLeft))+brickMarginLeft;
            var brickY = (r*(brickHeight+brickPaddingTop))-brickMarginTop;
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
		// D
		case 68:
		case 39:
			rightPressed = true;
			leftPressed = false;
			break;
		// A
		case 65:
		case 37:
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
	ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
}
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
	// ctx.strokeStyle = "rgba(0,0,255,0.5)";
	// ctx.lineWidth = 4;
	// ctx.stroke();
	ctx.fillStyle = "white"; // #BFBD1D
	ctx.fill();
	ctx.closePath();
}
function drawBricks() {
	for(c=0; c<brickColCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			if (bricks[c][r].status > 0) {
	            ctx.beginPath();
	            ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
	            if (bricks[c][r].status == 1) {
	            	ctx.fillStyle = "black";
	            } else {
	            	ctx.fillStyle = "#FFE987";
	            }
	            ctx.fill();
	            ctx.closePath();
	        }
	        // bricks past paddle?
	        if (bricks[c][r].y > canvas.height - brickHeight) {
	        	active = false;
	        };
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
		ballColor = "#EB2F4B";
		setTimeout(function() {ballColor = "red";},10); // #BFBD1D
		return true;
	} else {
		return false;
	}
}
function collisionDetection() {
	for(c=0; c<brickColCount; c++) {
		for(r=0; r<brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 2) {
				winStatus += 1;
				if (ballHitBrick(b.x, b.y, brickWidth, brickHeight, x, y)) {
					dy = -dy
					b.status -= 1;
					score++;
				}
			}
		}
	}
}
function drawScore() {
    ctx.font = "60px Helvetica";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
    ctx.fillText(score, canvas.width/2, canvas.height-40);
}
function gameOver() {
	ctx.font = "30px Helvetica";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("oh... awkward. you lost", canvas.width/2, canvas.height/2);
	// setTimeout(function() {
	// 	alert("Play again?");
	// }, 3000);
}
function winCondition() {
	ctx.font = "30px Helvetica";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("You beat the game!", canvas.width/2, canvas.height/2);
}
// ACTION STARTS HERE
function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawPaddle();
	drawBricks();
	drawBall();
	drawScore();
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
				// ball goes in direction of paddle
				if (rightPressed) {
					dx = -dx;
				}
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
					bricks[c][r].y += fallRate;
				}
			}
		}
		fallCount+=1;
		// increase fall rate
		if (fallCount % 1000 == 0) {
			fallRate += 4;
		}
		// if no bricks are alive, player wins
		if (winStatus <= 0) {
			winCondition();
		}
	} else { // !active
		gameOver();
	}
	// ball moves
	x += dx;
	y += dy;

	requestAnimationFrame(draw);
}

draw();


});