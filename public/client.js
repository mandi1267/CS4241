var articlesList = [];

function newWebsite() {
  urlBox = document.getElementById("inputURLBox");
  val = urlBox.value;
  if (val === "") {
    // do nothing
    return;
  }
  console.log(val);
  handleXMLHTTPPost('addArticle', displayNewSite, 'newURL=' + val);
}

function displayNewSite(returnedObjString) {
  console.log("DISPLAYING NEW SITE \n\n\n");
  returnedObj = JSON.parse(returnedObjString);
  console.log(returnedObj);
  displayHTML = "";
  if (typeof returnedObj === 'NewsItem') {
    console.log("Adding newsitem");
      articlesList.unshift(returnedObj)
      displayedHTML = compiled(returnedObj);
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
  articlesHMTL = "";
  articlesList.forEach(function(p, i) {
    articlesHMTL += compiled(p);
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
