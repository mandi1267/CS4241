// Author: Amanda Adkins
// Website: https://aaadkins-cs4241-assignment6.herokuapp.com/
var express = require('express');
var path = require('path');
var fs = require('fs');

var request = require('request');
var HashMap = require('hashmap');
var _ = require('underscore');
var htmlparser = require('htmlparser2');

var maxID = 1;
var maxIndex = 0;

var newsList = [];

var compiled = _.template(
  "<div class='newsItem'>" +
  "<div class='newsInfo'>" +
  "<h2 class='titleLink'><a href=<%= url %>><%= articleTitle %></a></h2>" +
  "<p>Date: <%= datePosted %></p>" +
  "<p><%= newsDescription %></p>" +
  "<p class='keywords'>Keywords: <%= keywords %></p>" +
  "<p>From: <%= sourceSite %></p>" +
  "<a href=https://www.facebook.com/dialog/share?app_id=145634995501895&amp;display=popup&amp;href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&amp;redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer>Share on facebook</a>" +
  "<p onclick='callfacebook(event)'>Facebook</p>" +
  "<div class='fb-share-button' data-href='<%= url %>' data-layout='icon'></div> " +
  "</div> " +
  "<div class='newsPhoto'>" +
  "<a href=<%= thumbnail %>><img src='<%= thumbnail %>'/></a>" +
  "</div>" +
  "</div>"
);

var errorTemplate = _.template(
  "<div class='newsError'>" +
  "<h2>Error loading <%= urlName %>. Sorry! </h2>" +
  "</div>"
);

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

var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.static(path.join(__dirname, '/public')));

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

app.post('/addArticle', function(req, res) {
  console.log("Article: " + req.body.newURL);
  parseArticleURL(req.body.newURL, function(metaText) {
    console.log("Meta: " + metaText);

    res.send(metaText);
  });
});

app.get('/allArticles', function(req, res) {
  res.send("Articles text");
});

function parseArticleURL(addURL, callback) {
  request({
    url: addURL,
    method: 'GET',
    maxRedirects: 15
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      siteHTML = body;
      handler = new htmlparser.DomHandler(function(error, dom) {
        console.log(addURL);
        if (error) {
          console.log("error " + error);
        } else {
          parseHead(htmlparser.DomUtils.getElementsByTagName('head', dom), addURL, callback);
        }
      });
      parser = new htmlparser.Parser(handler);

      parser.write(siteHTML);
      parser.done();
    } else {
      callback(generateErrorString(addURL));
      console.log("ERROR IN RETRIEVAL");
      console.log(error);
      // display link could  not be added
    }
  });
}

function readAllArticles() {

}

function writeArticle(url) {

}

function deleteArticle(url) {

}

function parseHead(headObj, pageURL, callback) {
  dataHashMap = new HashMap();
  titleObj = htmlparser.DomUtils.getElementsByTagName('title', headObj);

  dataHashMap.set('title', htmlparser.DomUtils.getInnerHTML(titleObj[0]));
  var metas = htmlparser.DomUtils.getElementsByTagName('meta', headObj);
  for (i = 0; i < metas.length; i++) {
    objName = htmlparser.DomUtils.getAttributeValue(metas[i], 'name');
    objContent = htmlparser.DomUtils.getAttributeValue(metas[i], 'content');
    objProperty = htmlparser.DomUtils.getAttributeValue(metas[i], 'property');
    objItemProp = htmlparser.DomUtils.getAttributeValue(metas[i], 'itemprop');

    if (!((typeof objName === 'undefined') || (typeof objContent === 'undefined'))) {
      console.log("NAME: " + objName);
      console.log('CONTENT: ' + objContent);
      console.log('');
      if ((objName === 'author') && (typeof(dataHashMap.get(objName)) !== 'undefined')) {
        dataHashMap.set(objName, dataHashMap.get(objName) + ', ' + objContent);
      } else {
        dataHashMap.set(objName, objContent);
      }
    } else if ((typeof objProperty !== 'undefined') && (typeof objContent !== 'undefined')) {
      dataHashMap.set(objProperty, objContent);
    } else if ((typeof objItemProp !== 'undefined') && (typeof objContent !== 'undefined')) {
      dataHashMap.set(objItemProp, objContent);

    }
  }

  newTitle = getStringRepFromHashmap(dataHashMap, 'title', pageURL);
  newAuthor = getFieldFromHashmap(dataHashMap, 'author');
  newWebsiteDomain = getStringRepFromHashmap(dataHashMap, 'og:site_name', pageURL);
  newURL = pageURL;
  newDescription = getStringRepFromHashmap(dataHashMap, 'description', pageURL);
  newThumbnail = getFieldFromHashmap(dataHashMap, 'thumbnail');
  newKeywords = getFieldFromHashmap(dataHashMap, 'keywords');
  newDate = getFieldFromHashmap(dataHashMap, 'date');


  newID = maxID + 1;
  maxID += 1;
  newIndex = maxIndex + 1;
  maxIndex += 1;

  newNews = new NewsItem(newTitle, newDate, newDescription, newAuthor, newWebsiteDomain, newThumbnail, newID, newIndex, newURL, newKeywords);
  newsList.unshift(newNews);
  callback(generateNewNewsBox(newNews));
}

function generateNewNewsBox(newNews) {
  newsHTML = compiled(newNews);
  return newsHTML;
}

function generateNewsListBox(newsToShow) {
  str = "";
  newsToShow.forEach(function(p, i) {
    str += compiled(p);
  });
  return str;
}

function generateErrorString(errorURL) {
  var errorObj = {
    urlName: errorURL,
  };
  return errorTemplate(errorObj);
}

function getStringRepFromHashmap(map, fieldName, siteURL) {
  field = map.get(fieldName);
  if (typeof field !== 'undefined') {
    console.log(fieldName + ' defined');
    return field;
  } else {
    console.log(fieldName);
    if (fieldName === 'og:site_name') {
      return parseDomain(siteURL);
    } else {
      return "";
    }
  }
}

function getFieldFromHashmap(metasHashMap, field) {
  possibleNames = [];
  if (field === 'date') {
    possibleNames.push('pubdate');
    possibleNames.push('dc.date');
    possibleNames.push('article:published_time');
  } else if (field === 'author') {
    possibleNames.push('author');
    possibleNames.push('og:article:author');
  } else if (field === 'thumbnail') {
    possibleNames.push('thumbnail');
    possibleNames.push('og:image');
    possibleNames.push('thumbnailUrl');
  } else if (field === 'keywords') {
    possibleNames.push('keywords');
    possibleNames.push('news_keywords');
  }

  for (i = 0; i < possibleNames.length; i++) {
    name = metasHashMap.get(possibleNames[i]);
    if (typeof name !== 'undefined') {
      return name;
    }
  }
  return "";
}

function parseDomain(url) {
  console.log(url);
  var domain;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") <= -1) {
    domain = url.split('/')[0];
  } else {
    domain = url.split('/')[2];
  }

  console.log('domain: ' + domain);
  //find & remove port number
  domain = domain.split(':')[0];

  return domain;
}
