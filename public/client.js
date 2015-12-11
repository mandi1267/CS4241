var articlesList = [];

var mode = 'listMode';

function newWebsite() {
  urlBox = document.getElementById("inputURLBox");
  val = urlBox.value;
  if (val === "") {
    // do nothing
    return;
  }
  console.log(val);

  urlBox.value = "";
  loading = document.getElementById('loadingLabel');
  loading.hidden = false;
  handleXMLHTTPPost('addArticle', displayNewSite, 'newURL=' + val);
}

function displayNewSite(returnedObjString) {
  returnedObj = JSON.parse(returnedObjString);
  console.log(returnedObj);
  displayHTML = "";
  console.log(typeof returnedObj)
  if (typeof returnedObj.errorMsg === 'undefined') {
    console.log("Adding newsitem");
    articlesList.unshift(returnedObj);
    if (mode === 'listMode') {
      displayedHTML = articleListTemplate(returnedObj);
    } else {
      displayedHTML = articleTileTemplate(returnedObj);
    }
  } else {
    displayedHTML = errorTemplate(returnedObj);
    console.log(displayedHTML);
  }
  errors = document.getElementsByClassName('newsError');
  for (i = 0; i < errors.length; i++) {
    errors[i].remove();
  }
  console.log(displayedHTML);
  siteBoxes = document.getElementById('articleBody');
  currentText = siteBoxes.innerHTML;
  console.log(currentText);
  newText = displayedHTML + currentText;
  siteBoxes.innerHTML = newText;
  console.log("NEW TEXT: " + newText);

  loading.hidden = true;
}


function handleXMLHTTPPost(postTo, callbackFunc, postText) {
  console.log("posting " + postText)
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callbackFunc(xmlHttp.responseText);
    }
  };
  xmlHttp.open("POST", postTo, true); // true for asynchronous

  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.send(postText);
}

function handleXMLHTTPGet(getFrom, callbackFunc) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callbackFunc(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", getFrom, true); // true for asynchronous
  xmlHttp.send();
}

function loadAllArticles() {
  handleXMLHTTPGet('allArticles', addAllArticles);
}

function addAllArticles(responseText) {
  articlesList = JSON.parse(responseText);
  displayAllArticles(articlesList);
}

function displayAllArticles(articlesList) {
  articlesHMTL = "";
  articlesList.forEach(function(p, i) {
    if (mode === 'listMode') {
      articlesHMTL += articleListTemplate(p);
    } else {
      articlesHMTL += articleTileTemplate(p);
    }
  });

  errors = document.getElementsByClassName('newsError');
  for (i = 0; i < errors.length; i++) {
    errors[i].remove();
  }
  siteBoxes = document.getElementById('articleBody');
  currentText = siteBoxes.innerHTML;
  console.log("adding articles");
  console.log(articlesHMTL);
  siteBoxes.innerHTML = articlesHMTL + currentText;
}

function callfacebook(e) {
  console.log(e);
  console.log(e.target);
}


function NewsItem(newTitle, newDate, newDescription, newAuthor, newHomePage, newThumbnail, newID, newIndex, newURL, newKeywords) {
  this.articleTitle = newTitle;
  this.datePosted = newDate;
  this.newsDescription = newDescription;
  this.author = newAuthor;
  this.sourceSite = newHomePage;
  this.thumbnail = newThumbnail;
  this.ID = newID;
  this.newsIndex = newIndex;
  this.url = newURL;
  this.keywords = newKeywords;
}

function deleteClicked(e) {
  console.log(e.target);
  newsDiv = e.target.parentElement.parentElement;
  console.log(newsDiv.id);
  newsDivID = newsDiv.id.slice(7);

  console.log(newsDivID);
  for (i = 0; i < articlesList.length; i++) {
    if (articlesList[i].ID === parseInt(newsDivID)) {
      articlesList.splice(i, 1);
    }
  }

  newsDiv.remove();
  handleXMLHTTPPost('deleteArticle', function() {}, 'idToDelete=' + newsDivID);
}

function switchToList() {
  mode = 'listMode';
  siteBoxes = document.getElementById('articleBody');
  siteBoxes.innerHTML = "";
  displayAllArticles(articlesList);
}

function switchToTiles() {
  mode = 'tileMode'
  siteBoxes = document.getElementById('articleBody');
  siteBoxes.innerHTML = "";
  displayAllArticles(articlesList);
}
