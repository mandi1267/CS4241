var express = require('express');
var path = require('path');

var movies = ['jaws', 'jaws1', 'Monty Python'];

var app = express();
var port = process.env.PORT || 3000;

var fs = require('fs');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/index', function(req, res) {
  var query = req.query;
  if (typeof query.search != 'undefined') {
    queryMovie(res, query.search);
  } else if (typeof query.add != 'undefined') {
    addMovie(query.add);
    res.sendFile(path.join(__dirname, 'public/index.html')); //)('chair, table, tacos, funyuns, apple');
  } else {
    res.sendFile(path.join(__dirname, 'public/index.html')); //)('chair, table, tacos, funyuns, apple');
  }
});

function queryMovie(res, searchQuery) {
  matchingMovies = movies.filter(checkNameInTitle(searchQuery));
  if (matchingMovies.length != 0) {
    console.log(matchingMovies);

    var fileStream = fs.createReadStream(path.join(__dirname, 'public/index.html'));

    var htmlString;

    fileStream.on('data', function(data) {
      console.log(typeof data);
      htmlString = data.toString();
      //res.write(data);
    });

    fileStream.on('end', function() {
    //  res.end();
        moviesString = generateHTMLTableRowsBasedOnMovies(matchingMovies);
        console.log(moviesString);
        resultHTML = modifyTableContentsInFile(htmlString, moviesString);
        console.log(resultHTML);
        res.send(resultHTML);
    })


  } else {
    res.send("No movies containing " + searchQuery + " in title.");
    //res.sendFile(path.join(__dirname, 'public/index.html')); //)('chair, table, tacos, funyuns, apple');
  }
}

function addMovie(movieToAdd) {
  if (movieToAdd != "") {
    if (movies.indexOf(movieToAdd) == -1) {
      movies.push(movieToAdd);

    } else {
      console.log("Dont add duplicate");
    }
  }
  // redisplay all movies
}

app.get('/', function(req, res) {
  console.log("Hello\n");
  var query = req.query;
  console.log(query);
  res.sendFile(path.join(__dirname, '/public/index.html'));

});

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

function checkNameInTitle(name) {
  return function(obj) {
    return obj.indexOf(name) >= 0;
  }
}

function generateHTMLTableRowsBasedOnMovies(moviesToSerialize) {
  var i;
  var tableString="";
  for (i = 0; i < moviesToSerialize.length; i++) {
    tableString += "<tr><td>" + moviesToSerialize[i] + "</td></tr>\n";
  }
  return tableString;
}

function modifyTableContentsInFile(originalString, replacementText) {
  console.log(typeof originalString);
  return originalString.replace('<table id="resultsTable">', '<table id="resultsTable">' + replacementText);
}
