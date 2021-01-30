let mess = [
	'Bugoooooooo!!!!',
	'Buloooooooook!!',
	'Tch!',
	'Undangi oi!',
	'Salamat sa pagdula. Lablots!',
	'.........bugo.........'
]

//CANVAS
let canvas = document.querySelector('#game-board')
let ctx = canvas.getContext('2d');
//clearing canvas
function cleanBoard(){
	ctx.clearRect(0,0,canvas.width,canvas.height)
}

//game speed
let speed = 200

//snake to food events
let foodAte = false;

//toggle game loop
let runGame = setInterval(gameLoop, speed)
//game loop
function gameLoop(){
	cleanBoard()
	moveSnake()
	locateFood()
	drawSnake()
	checkBump()
}


// SNAKE

//snake body coordinates
let snake = [{x:100, y: 100}]
//snake head movement
let move = {x: 0, y: 0}
//drawing snake box
function drawSnake(){
	for(let i = 0 ; i < snake.length ; i++){
		let x = snake[i].x
		let y = snake[i].y
		
		ctx.beginPath();
		ctx.rect(x, y, 10, 10)
		ctx.fillStyle = "#35b9da";
		ctx.fill();
		ctx.closePath();
	}
}
//moving snake body
function moveSnake(){
	snakeGrow()
	if(!foodAte){
		snake.splice(snake.length-1)
	}
}
//increase snake length
function snakeGrow(){
	snake.unshift({
		x : snake[0].x + move.x,
		y : snake[0].y + move.y
	})
}
//checkBumps
function checkBump(){
	if(snake[0].x > 200 || snake[0].y > 200 || snake[0].x < 0 || snake[0].y < 0){
		alert(mess[Math.floor(Math.random()*6)])
		document.location.reload();
		clearInterval(runGame);
	}else{
		if(snake.length > 1){
		for(let i = 1 ; i < snake.length ; i++){
			if(snake[0].x === snake[i].x && snake[0].y === snake[i].y){
					alert(mess[Math.floor(Math.random()*6)])
					document.location.reload();
					clearInterval(runGame);
			}
		}
		}
	}
}


//FOOD

//food coordinates
let food = {x : undefined, y : undefined}
//initiate food
moveFood()
drawFood()
//move food
function moveFood(){
	//generate random food coordinates
	food.x = Math.floor(Math.random()*21)*10;
	food.y = Math.floor(Math.random()*21)*10;
}
//check food location
function locateFood(){
	//if food is inside the snake
	let foodInBody = false;
	for(let i = 0 ; i < snake.length ; i++){
		if(food.x === snake[i].x && food.y === snake[i].y)
			foodInBody = true;
	}
	//if food is eaten by head
	foodAte = (food.x === snake[0].x && food.y === snake[0].y);
	
	if(foodAte){
		moveFood()
		locateFood()
		snakeGrow()
	}else if(foodInBody){
		moveFood()
		locateFood()
	}else{
		drawFood()
	}
}
//draw food
function drawFood(){
	ctx.beginPath();
	ctx.rect(food.x, food.y, 10, 10)
	ctx.fillStyle = "#840000";
	ctx.fill();
	ctx.closePath();
}


//CONTROLS

//modifying movement
let currDirection = ''
let direction = {
	left:()=>{
		if(currDirection != 'r' || snake.length == 0){
			currDirection = 'l'
			move.x=-10
			move.y=0
		}
	},
	right:()=>{
		if(currDirection != 'l' || snake.length == 0){
			currDirection = 'r'
			move.x=10
			move.y=0
		}
	},
	up:()=>{
		if(currDirection != 'd' || snake.length == 0){
			currDirection = 'u'
			move.y=-10
			move.x=0
		}
	},
	down:()=>{
		if(currDirection != 'u' || snake.length == 0){
			currDirection = 'd'
			move.y=10
			move.x=0
		}
	}
}

// handling touch controls
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null, yDown = null;

function getTouches(e){
	return e.touches || e.originalEvent.touches
}

function handleTouchStart(e){
	let firstTouch = getTouches(e)[0];
	xDown = firstTouch.screenX;
	yDown = firstTouch.screenY;
}

function handleTouchMove(e){
	if(!xDown||!yDown)return;
	
	let xUp = e.touches[0].screenX;
	let yUp = e.touches[0].screenY;
	
	xDiff = xDown-xUp;
	yDiff = yDown-yUp;
	
	if(Math.abs(xDiff) > Math.abs(yDiff)){
		if(xDiff > 0){
			direction.left()
		}else{
			direction.right()
		}
	}else{
		if(yDiff > 0){
			direction.up()
		}else{
			direction.down()
		}
	}
	
	xDown = null, yDown = null
}

//arrows on key boards
document.addEventListener('keydown', keyDownHandler, false)

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        direction.right()
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        direction.left()
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        direction.up()
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        direction.down()
    }
}
