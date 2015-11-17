// Author: Amanda Adkins
// Website: https://aaadkins-cs4241-assignment4.herokuapp.com/
var express = require('express');
var path = require('path');
var fs = require('fs');

var moviesList = [];

var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

readMoviesFile();


app.get('/index', function(req, res) {
  var query = req.query;
  if (query.search != "") {
    queryMovie(res, query.search, query.fieldToSearch);
  } else {
    sendHTMLWithMovies(res, moviesList);
  }
});

app.post('/index', function(req, res) {
  if (req.body.addTitle === undefined) {
    deleteMovies(req)
  } else {
    addMovie(req.body.addTitle, req.body.addGenre, req.body.addYear);
  }
  updateMoviesFile();
  sendHTMLWithMovies(res, moviesList);
});

app.get('/', function(req, res) {

  sendHTMLWithMovies(res, moviesList);
});

app.use(express.static(path.join(__dirname, '/public')));

function queryMovie(res, searchQuery, searchField) {
  if (searchField === "title") {
    matchingMovies = moviesList.filter(checkNameInTitle(searchQuery));
  } else if (searchField === "genre") {
    matchingMovies = moviesList.filter(checkGenre(searchQuery));
  } else if (searchField === "year") {
    matchingMovies = moviesList.filter(checkMatchingYear(searchQuery));
  }
  if (matchingMovies.length != 0) {
    sendHTMLWithMovies(res, matchingMovies);
  } else {
    sendString = '<p>No movies matching "' + searchQuery + '" in ' + searchField + '</p>';
    returnNoMovies(res, sendString);
  }
}

function addMovie(movieTitle, movieGenre, movieYear) {
  newMovie = new Movie(movieTitle, movieGenre, movieYear);
  if (!movieInList(newMovie)) {
    moviesList.push(newMovie);
  }
}

function movieInList(newMovie) {
  for (var i = 0; i < moviesList.length; i++) {
    movie = moviesList[i];
    if ((movie.movieTitle === newMovie.movieTitle) && (movie.genre === newMovie.genre) && (movie.year === newMovie.year)) {
      return true;
    }
  }
  return false;
}

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

function deleteMovies(req) {
  for (var j = moviesList.length - 1; j >= 0; j--) {
    currentMovie = moviesList[j]
    removeTag = removeSpacesFromString(currentMovie.movieTitle + currentMovie.year);
    var selectVar = eval("req.body.select" + removeTag);
    if (selectVar === "on") {
      console.log("delete " + moviesList[j].movieTitle);
      moviesList.splice(j, 1);
    }
  }
}

function checkNameInTitle(name) {
  return function(obj) {
    return obj.movieTitle.indexOf(name) >= 0;
  }
}

function checkGenre(selectedGenre) {
  return function(obj) {
    return obj.genre === selectedGenre;
  }
}

function checkMatchingYear(selectedYear) {
  return function(obj) {
    return obj.year === selectedYear;
  }
}

function generateHTMLTableRowsBasedOnMovies(moviesToSerialize) {
  var i;
  var tableString = '<form method="post" action="index">'
  tableString += '<table id="resultsTable">';
  tableString += "<thead><tr><th>Movie Title</th><th>Genre</th><th>Year</th><th>Select</th></tr></thead>";
  tableString += "<tbody>"
  for (var j = 0; j < moviesToSerialize.length; j++) {
    movie = moviesToSerialize[j];
    tableString += generateMovieRowForTable(movie, j);
  }
  tableString += '</tbody></table>'
  tableString += '<input id="deleteButton" type="submit" name="delete" value="Delete Selected Movies"/>'
  tableString += '</form>'
  return tableString;
}

function modifyTableContentsInFile(originalString, replacementText) {
  return originalString.replace('<h2>Movies</h2>', '<h2>Movies</h2>' + replacementText);
}

function generateMovieRowForTable(movie, movieIndex) {
  tableString = "<tr><td>" + movie.movieTitle + "</td><td>" + movie.genre + "</td><td>" + movie.year + "</td>"
  tableString += '<td><input type="checkbox" name="select' + removeSpacesFromString(movie.movieTitle + movie.year) + '"/></td>'
  tableString += '</tr>'
  return tableString
}

function sendHTMLWithMovies(res, moviesToSend) {
  var fileStream = fs.createReadStream(path.join(__dirname, 'public/index.html'));
  var htmlString;

  fileStream.on('data', function(data) {
    htmlString = data.toString();
  });

  fileStream.on('end', function() {
    moviesString = generateHTMLTableRowsBasedOnMovies(moviesToSend);
    resultHTML = modifyTableContentsInFile(htmlString, moviesString);
    res.send(resultHTML);
  });
}

function Movie(movieTitle, genre, year) {
  this.movieTitle = movieTitle;
  this.genre = genre;
  this.year = year;
}

function returnNoMovies(res, replacementText) {
  var fileStream = fs.createReadStream(path.join(__dirname, 'public/index.html'));
  var htmlString;

  fileStream.on('data', function(data) {
    htmlString = data.toString();
  });

  fileStream.on('end', function() {
    resultHTML = modifyTableContentsInFile(htmlString, replacementText);
    res.send(resultHTML);
  });
}

function updateMoviesFile() {
  var fileStream = fs.createWriteStream(path.join(__dirname, 'public/results.txt'));
  fileStream.write(JSON.stringify(moviesList));
}

function readMoviesFile() {
  moviesString = fs.readFileSync(path.join(__dirname, 'public/results.txt'));
  moviesList = JSON.parse(moviesString);
}

function removeSpacesFromString(editString) {
  return editString.replace(/\s+/g, '');
}
