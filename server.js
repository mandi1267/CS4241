var express = require('express');
var path = require('path');

//var movies = ['jaws', 'jaws1', 'Monty Python'];

var moviesList = [];
moviesList.push(new Movie("Jaws", "Action", "1975"));
moviesList.push(new Movie("The Little Mermaid", "Children's", "1989"));
moviesList.push(new Movie("The Avengers", "Action", "2012"));
moviesList.push(new Movie("Django Unchained", "Western", "2012"));

var app = express();
var port = process.env.PORT || 3000;

var fs = require('fs');

app.get('/index', function(req, res) {
  var query = req.query;
  if (typeof query.search != 'undefined') {
    if (query.search != "") {
      queryMovie(res, query.search, query.fieldToSearch);
    }
  } else if (typeof query.addTitle != 'undefined') {
    addMovie(query.addTitle, query.addGenre, query.addYear);
    sendHTMLWithMovies(res, moviesList);
  } else {
    sendHTMLWithMovies(res, moviesList);
  }
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
  var tableString = '<table id="resultsTable">';
  tableString += "<thead><tr><th>Movie Title</th><th>Genre</th><th>Year</th></tr></thead>";
  tableString += "<tbody>"
  moviesToSerialize.forEach(function(movie) {
    tableString += generateMovieRowForTable(movie);
  });
  tableString += '</tbody></table>'
  return tableString;
}

function modifyTableContentsInFile(originalString, replacementText) {
  return originalString.replace('<h2>Movies</h2>', '<h2>Movies</h2>' + replacementText);
}

function generateMovieRowForTable(movie) {
  return "<tr><td>" + movie.movieTitle + "</td><td>" + movie.genre + "</td><td>" + movie.year + "</td></tr>"
}

function sendHTMLWithMovies(res, moviesList) {
  var fileStream = fs.createReadStream(path.join(__dirname, 'public/index.html'));
  var htmlString;

  fileStream.on('data', function(data) {
    htmlString = data.toString();
  });

  fileStream.on('end', function() {
    moviesString = generateHTMLTableRowsBasedOnMovies(moviesList);
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
