var canvas;
var ctx;
var randGen = Math.random;

var snakeWidth = 35;
var snakeHeight = 20;

var canvasBkgColor = '#FFFFFF'

var foodLoc = [];
var snakeLoc = [];
var dir;

var playing = true;
var timerID;
var secTimer;

var startingGameDelay = 250;
var gameDelayDec = .95;
var gameDelay = startingGameDelay;

var gameOver = false;

//var christmasMode = false;

var mode = 'none';


var presentImg = new Image();
presentImg.src = "images/presentImg.ico";

var objSize = 30;

var secCounter = 0;


var reindeerImg = new Image();
reindeerImg.src = "images/reindeer.jpe";

var snowflakeImg = new Image();
snowflakeImg.src = "images/snowflake2.png";

var snowmanImg = new Image();
snowmanImg.src = "images/snowman.png";

var mouseInRange = true;
var border;

var touchStartX = 0;
var touchStartY = 0;

var minSwipeDist = 1000000;



// N = 3
// E = 2
// S = 1
// W = 0

function loadCanvas() {
  snakeLen = 1;
  canvas = document.getElementById("snakeCanvas");

  gameBorder = document.getElementById("gameBorder");

  ctx = canvas.getContext("2d");

  canvas.setAttribute('width', snakeWidth * objSize);
  canvas.setAttribute('height', snakeHeight * objSize);

  top = document.getElementById("top");
  pgBody = document.getElementById("pageBody");

  pgBody.addEventListener('keydown', keyDown, false);

  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keypress', keyPressed, true);

  canvas.addEventListener('click', canvasClicked, false);
  pgBody.addEventListener('click', borderDoubleClick, false);
  pgBody.addEventListener('touchstart', onTouch, false);
  pgBody.addEventListener('touchend', onEndTouch, false);

  displayStartMsg();
}

function onTouch(e) {
  console.log("touch start");
  var touchobj = e.changedTouches[0]
  touchStartX = touchobj.pageX
  touchStartY = touchobj.pageY
}

function onEndTouch(e) {
  console.log("touch end");

  var touchobj = e.changedTouches[0]
  xDiff = touchStartX - touchobj.pageX;
  yDiff = touchStartY - touchobj.pageY;
  dist = Math.pow((Math.pow(xDiff, 2) + Math.pow(yDiff, 2)), 2);
  console.log(dist + ' dist');
  if (dist > minSwipeDist) {
    console.log('swiped!');
    if (dir % 2 === 0) { // E or W
      if (Math.abs(xDiff) < Math.abs(yDiff)) {
        if (yDiff > 0) {
          console.log("North");
          dir = 3;
        } else {
          console.log("South");
          dir = 1;
        }
      }
    } else {
      if (Math.abs(yDiff) < Math.abs(xDiff)) {
        if (xDiff > 0) {
          console.log("West");
          dir = 0;
        } else if (xDiff < 0) {
          console.log("East");
          dir = 2;
        }
      }
    }
  }
}


function canvasClicked(e) {
  e.stopPropagation();
  console.log("canvas clicked");
  restartGame();
}


function borderDoubleClick(e) {
  if (mode === 'christmas') {
    applyWinterTheme();
  } else if (mode === 'winter') {
    applyNormalTheme();
  } else if (mode === 'none') {
    applyHolidayTheme();
  }
  e.stopPropagation();
}

function restartGame() {
  gameOver = false;
  initializeSnake();
  setSnakeFood();
  gameDelay = startingGameDelay;

  timerID = window.setInterval(draw, gameDelay);
  secCounter = 0;
  secTimer = window.setInterval(secElapsed, 1000);
}

function secElapsed() {
  if (secCounter === 30) {
    gameDelay = gameDelayDec * gameDelay;
    window.clearInterval(timerID);
    timerID = window.setInterval(draw, gameDelay);
    secCounter = 0;
  } else {
    secCounter += 1;
  }
}

function keyPressed(e) {
  if (e.keyCode === 32) {
    if (!gameOver) {
      togglePlayHandler(!playing);
    } else {
      restartGame();
    }
  } else if ((e.keyCode === 99) || (e.keyCode === 67)) {
    if (mode === 'christmas') {
      applyNormalTheme();
    } else {
      applyHolidayTheme();
    }
  } else if ((e.keyCode === 102) || (e.keyCode === 70)) {
    if (mode === 'winter') {
      applyNormalTheme();
    } else {
      applyWinterTheme();
    }
  } else if ((e.keyCode === 105) || (e.keyCode === 73)) {
    if (playing) {
      togglePlayHandler(false);
      displayStartMsg()
    } else {
      togglePlayHandler(true);
    }
  }
}

function togglePlayHandler(shouldPlay) {
  if ((shouldPlay) && (!playing)) {
    console.log("adding back timers");
    timerID = window.setInterval(draw, gameDelay);
    secTimer = window.setInterval(secElapsed, 1000);
    playing = true;
  } else {
    playing = false
    console.log("clearing timers");
    window.clearInterval(timerID);
    window.clearInterval(secTimer);
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
  if (mode === 'none') {
    ctx.fillStyle = canvasBkgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < snakeLen; i++) {
      cell = snakeLoc[i];
      ctx.fillStyle = "#000000";
      ctx.fillRect(cell[0] * objSize, cell[1] * objSize, objSize, objSize);
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(foodLoc[0] * objSize, foodLoc[1] * objSize, objSize, objSize);
  } else if (mode === 'christmas') {
    ctx.fillStyle = canvasBkgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < snakeLen; i++) {
      cell = snakeLoc[i];
      ctx.drawImage(reindeerImg, cell[0] * objSize, cell[1] * objSize, objSize, objSize);
    }
    ctx.drawImage(presentImg, foodLoc[0] * objSize, foodLoc[1] * objSize, objSize, objSize);
  } else {
    ctx.fillStyle = canvasBkgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < snakeLen; i++) {
      cell = snakeLoc[i];
      ctx.drawImage(snowmanImg, cell[0] * objSize, cell[1] * objSize, objSize, objSize);
    }
    ctx.drawImage(snowflakeImg, foodLoc[0] * objSize, foodLoc[1] * objSize, objSize, objSize);
  }
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
    if ((e.keyCode === 38) || (e.keyCode === 87) || (e.keyCode === 119)) {
      dir = 3;
    } else if ((e.keyCode === 40) || (e.keyCode === 83) || (e.keyCode === 115)) {
      dir = 1;
    }
  } else {
    if ((e.keyCode === 37) || (e.keyCode === 65) || (e.keyCode === 97)) {
      dir = 0;
    } else if ((e.keyCode === 39) || (e.keyCode === 68) || (e.keyCode === 100)) {
      dir = 2;
    }
  }
}

function updateSnake() {
  snakeLoc.unshift(computeNextSnakeLoc());
  snakeLoc.pop();
}

function checkForCollision() {
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
  ctx.font = "32px Lucida Sans Serif";
  ctx.fillStyle = "#0095DD";
  displayText = "Game Over";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2);
  togglePlayHandler(false);
}

function displayStartMsg() {
  ctx.font = "32px Arial";
  ctx.fillStyle = "#0095DD";
  displayText = "Double click to start";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 - 80); // -ctx.measureText(displayText).height);
  displayText = "Double click at any time to restart game";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 - 40); // + ctx.measureText(displayText).height);
  displayText = "Use arrow/WASD keys to play";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2); // + ctx.measureText(displayText).height);
  displayText = "Use space bar to pause";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 + 40); // + ctx.measureText(displayText).height);
  displayText = "Double click page background for a surprise";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 + 80); // + ctx.measureText(displayText).height);

}

function applyWinterTheme() {
  mode = 'winter';
  canvasBkgColor = '#ACADC2';
  changeCSS('css/winter.css', 0);

  title = document.getElementById("siteTitle");
  title.innerHTML = "Winter Snake"
}

function applyHolidayTheme() {
  mode = 'christmas'
  canvasBkgColor = '#FFFFFF'
  changeCSS('css/holiday.css', 0);

  title = document.getElementById("siteTitle");
  title.innerHTML = "Christmas Snake";
}


function changeCSS(cssFile, cssLinkIndex) {

  var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

  var newlink = document.createElement("link");
  newlink.setAttribute("rel", "stylesheet");
  newlink.setAttribute("type", "text/css");
  newlink.setAttribute("href", cssFile);

  document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

function applyNormalTheme() {
  mode = 'none'
  canvasBkgColor = '#FFFFFF'
  changeCSS('css/main.css', 0);
  title = document.getElementById("siteTitle");
  title.innerHTML = "Snake";
}
