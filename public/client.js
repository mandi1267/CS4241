(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

function newWebsite() {
  urlBox = document.getElementById("inputURLBox");
  val = urlBox.value;
  if (val === "") {
    // do nothing
    return;
  }
  console.log(val);
  handleXMLHTTPPost('addArticle', displayNewSite, 'newURL='+val);
}

function displayNewSite(siteHtml) {
  errors = document.getElementsByClassName('newsError');
  for (i = 0; i < errors.length; i++) {
    errors[i].remove();
  }
  console.log(siteHtml);
  siteBoxes = document.getElementById('articleBody');
  currentText = siteBoxes.innerHTML;
  siteBoxes.innerHTML = siteHtml + currentText;
}


function handleXMLHTTPPost(postTo, callbackFunc, postText) {
  console.log("posting "+postText)
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
  console.log(responseText);
}

function callfacebook(e) {
  console.log(e);
  console.log(e.target);
}
