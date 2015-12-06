var canvas;
var ctx;
var randGen = Math.random;

var snakeWidth = 45;
var snakeHeight = 30;

var foodLoc = [];
var snakeLoc = [];
var dir;

var togglePlay = true;
var timerID;

var gameDelay = 250;

var gameOver = false;

// N = 3
// E = 2
// S = 1
// W = 0

function loadCanvas() {
  canvas = document.getElementById("snakeCanvas");

  ctx = canvas.getContext("2d");

  canvas.setAttribute('width', snakeWidth * 10);
  canvas.setAttribute('height', snakeHeight * 10);

  top = document.getElementById("top");

  document.addEventListener('keydown', keyDown, true);
  document.addEventListener('keypress', keyPressed, true);

  restartGame();
}

function restartGame() {
  gameOver = false;
  initializeSnake();
  setSnakeFood();

  timerID = window.setInterval(draw, gameDelay);
}

function keyPressed(e) {
  if (e.keyCode === 32) {
    if (!gameOver) {
      console.log("spacePressed");
      togglePlay = !togglePlay;
      togglePlayHandler();
    } else {
      console.log("restart game");
      restartGame();
    }
  }
}

function togglePlayHandler() {
  if (togglePlay) {
    timerID = window.setInterval(draw, gameDelay);
  } else {
    window.clearInterval(timerID);
  }
}

function draw() {

  drawSnakeField();
  if (checkForCollision()) {
    gameOver = true;
    displayGameOver();
  } else {
    nextLoc = computeNextSnakeLoc();
    if ((nextLoc[0] === foodLoc[0]) && (nextLoc[1] === foodLoc[1])) {
      snakeLoc.unshift(nextLoc);
      snakeLen += 1;
      setSnakeFood();
    } else {
      updateSnake();
    }
  }
}

function drawSnakeField() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (i = 0; i < snakeLen; i++) {
    cell = snakeLoc[i];
    ctx.fillStyle = "#000000";
    ctx.fillRect(cell[0] * 10, cell[1] * 10, 10, 10);
  }
  ctx.fillStyle = "#000000";
  ctx.fillRect(foodLoc[0] * 10, foodLoc[1] * 10, 10, 10);

}

function setSnakeFood() {
  foodLoc.push(0);
  foodLoc.push(0);
  do {
    foodLoc[0] = randGen() * snakeWidth | 0;
    foodLoc[1] = randGen() * snakeHeight | 0;
  } while (checkLocInSnake(foodLoc));
}

function initializeSnake() {
  snakeHead = [];
  snakeHead.push(0);
  snakeHead.push(0);
  snakeHead[0] = (snakeWidth / 2) | 0;
  snakeHead[1] = (snakeHeight / 2) | 0;
  snakeLoc = [];
  snakeLoc.push(snakeHead);

  snakeLen = 1;
  dir = randGen() * 4 | 0;
  gameDelay = 250;
}

function keyDown(e) {
  if (dir % 2 === 0) { // E or W
    if (e.keyCode === 38) {
      dir = 3;
    } else if (e.keyCode === 40) {
      dir = 1;
    }
  } else {
    if (e.keyCode === 37) {
      dir = 0;
    } else if (e.keyCode === 39) {
      dir = 2;
    }
  }

}

function updateSnake() {
  snakeLoc.unshift(computeNextSnakeLoc());
  snakeLoc.pop();
}

function checkForCollision() {
  console.log(computeNextSnakeLoc());
  nextLoc = computeNextSnakeLoc()
  if ((nextLoc[0] < 0) || (nextLoc[0] >= snakeWidth)) {
    return true;
  } else if ((nextLoc[1] < 0) || (nextLoc[1] >= snakeHeight)) {
    return true;
  } else if (checkLocInSnake(nextLoc)) {
    return true;
  }
  return false;
}

function checkLocInSnake(checkLoc) {
  for (i = 0; i < snakeLen; i++) {
    loc = snakeLoc[i];
    if ((loc[0] === checkLoc[0]) && (loc[1] == checkLoc[1])) {
      return true;
    }
  }
  return false;
}

function computeNextSnakeLoc() {
  newX = snakeLoc[0][0];
  newY = snakeLoc[0][1];
  if (dir === 3) {
    newY -= 1;
  } else if (dir == 2) {
    newX += 1;
  } else if (dir == 1) {
    newY += 1;
  } else {
    newX -= 1;
  }
  pos = [newX, newY];
  return pos;
}

function displayGameOver() {

  ctx.font = "16px Lucida";
  ctx.fillStyle = "#0095DD";
  displayText = "Game Over";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2);
  togglePlay = false;
  togglePlayHandler();
  console.log("handling game over");
}
