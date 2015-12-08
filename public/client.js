var canvas;
var ctx;

var snakeWidth = 35;
var snakeHeight = 20;

var canvasBkgColor = '#FFFFFF';
var fontColor = '#7B0AA4';

var foodLoc = [];
var snakeLoc = [];
var dir;

var playing;
var timerID;
var secTimer;

var startingGameDelay = 250;
var gameDelayDec = .90;
var gameDelay = startingGameDelay;

var objSize = 30;
var secCounter = 0;

var gameOver = true;

var mode = 'none';

var gameNotStarted = true;

var presentImg = new Image();
presentImg.src = "images/presentImg.ico";

var reindeerImg = new Image();
reindeerImg.src = "images/reindeer.jpe";

var snowflakeImg = new Image();
snowflakeImg.src = "images/snowIcon.png";

var snowmanImg = new Image();
snowmanImg.src = "images/snowman.png";

var touchStartX = 0;
var touchStartY = 0;

var minSwipeDist = 1000000;

function loadCanvas() {
  snakeLen = 1;
  playing = false;
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

  canvas.addEventListener('dblclick', canvasClicked, false);
  pgBody.addEventListener('dblclick', borderDoubleClick, false);
  pgBody.addEventListener('touchstart', onTouch, false);
  pgBody.addEventListener('touchend', onEndTouch, false);

  displayStartMsg();
}

function onTouch(e) {
  var touchobj = e.changedTouches[0]
  touchStartX = touchobj.pageX
  touchStartY = touchobj.pageY
}

function onEndTouch(e) {
  var touchobj = e.changedTouches[0]
  xDiff = touchStartX - touchobj.pageX;
  yDiff = touchStartY - touchobj.pageY;
  dist = Math.pow((Math.pow(xDiff, 2) + Math.pow(yDiff, 2)), 2);
  console.log(dist + ' dist');
  if (dist > minSwipeDist) {
    if (dir % 2 === 0) { // E or W
      if (Math.abs(xDiff) < Math.abs(yDiff)) {
        if (yDiff > 0) {
          dir = 3;
        } else {
          dir = 1;
        }
      }
    } else {
      if (Math.abs(yDiff) < Math.abs(xDiff)) {
        if (xDiff > 0) {
          dir = 0;
        } else if (xDiff < 0) {
          dir = 2;
        }
      }
    }
  }
}

function canvasClicked(e) {
  restartGame();
}


function borderDoubleClick(e) {
  if (mode === 'christmas') {
    newMode = 'winter';
  } else if (mode === 'winter') {
    newMode = 'none';
  } else if (mode === 'none') {
    newMode = 'christmas';
  }
  applyNewTheme(newMode);
  //e.stopPropagation(); - can uncomment if don't want to change themes every time game restarts
}

function restartGame() {
  gameNotStarted = false;
  gameOver = false;
  initializeSnake();
  setSnakeFood();
  gameDelay = startingGameDelay;
  secCounter = 0;
  togglePlayHandler(true);
}

function secElapsed() {
  if (secCounter === 30) {
    gameDelay = gameDelayDec * gameDelay;
    if (playing) {
      window.clearInterval(timerID);
      timerID = window.setInterval(draw, gameDelay);
    }
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
      applyNewTheme('none');
    } else {
      applyNewTheme('christmas');
    }
  } else if ((e.keyCode === 102) || (e.keyCode === 70)) {
    if (mode === 'winter') {
      applyNewTheme('none');
    } else {
      applyNewTheme('winter');
    }
  } else if ((e.keyCode === 105) || (e.keyCode === 73)) {
    if (playing) {
      togglePlayHandler(false);
      displayStartMsg();
    } else {
      togglePlayHandler(true);
    }
  }
}

function togglePlayHandler(shouldPlay) {
  if ((shouldPlay) && (!playing)) {
    timerID = window.setInterval(draw, gameDelay);
    secTimer = window.setInterval(secElapsed, 1000);
    playing = true;
  } else {
    playing = false;
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
      ctx.fillStyle = "#1B0B38";
      ctx.fillRect(cell[0] * objSize, cell[1] * objSize, objSize, objSize);
    }
    ctx.fillStyle = "#7B0AA4";
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
    foodLoc[0] = Math.random() * snakeWidth | 0;
    foodLoc[1] = Math.random() * snakeHeight | 0;
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
  dir = Math.random() * 4 | 0;
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
  ctx.font = "32px Arial";
  ctx.fillStyle = fontColor;
  displayText = "Game Over";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 - 20);
  displayText = "Press space or double click game field to restart";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 + 20);
  togglePlayHandler(false);
}

function displayStartMsg() {
  ctx.fillStyle = canvasBkgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "32px Arial";
  ctx.fillStyle = fontColor;
  displayText = "Double click to start";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 - 80);
  displayText = "Double click game field at any time to restart game";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 - 40);
  displayText = "Use arrow/WASD keys to play";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2);
  displayText = "Use space bar to pause";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 + 40);
  displayText = "Press i to display help again";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 + 80);
  displayText = "Double click anywhere for a surprise";
  ctx.fillText(displayText, canvas.width / 2 - ctx.measureText(displayText).width / 2, canvas.height / 2 + 120);
}

function applyWinterTheme() {
  mode = 'winter';
  canvasBkgColor = '#CDCCDA';
  changeCSS('css/winter.css', 0);

  title = document.getElementById("siteTitle");
  title.innerHTML = "Winter Snake";
  fontColor = '#010440';
}

function applyHolidayTheme() {
  mode = 'christmas';
  canvasBkgColor = '#FFFFFF';
  fontColor = '#2A0403';
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
  canvasBkgColor = '#FFFFFF';
  fontColor = '#7B0AA4';
  changeCSS('css/main.css', 0);
  title = document.getElementById("siteTitle");
  title.innerHTML = "Snake";
}

function applyNewTheme(themeName) {
  if (themeName === 'winter') {
    applyWinterTheme();
  } else if (themeName === 'none') {
    applyNormalTheme();
  } else if (themeName === 'christmas') {
    applyHolidayTheme();
  }
  if (gameNotStarted) {
    displayStartMsg();
  } else if (gameOver) {
    displayGameOver();
  } else {
    drawSnakeField();
  }
}
