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

displayedMovies = moviesList;

var sortAscending = true;
var lastSortedBy = "Title"

app.get('/movies', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/results.txt'));
});

app.get('/search', function(req, res) {
  
});

app.post('/addMovie', function(req, res) {
  movieString = req.body.addMovie;
  newMovie = JSON.parse(movieString);
  res.end();
  readMoviesFile();
  moviesList.push(newMovie);
  updateMoviesFile();
});

app.post('/deleteMovies', function(req, res) {
  deleteString = req.body.deleteMovies;
  moviesToDelete = JSON.parse(deleteString);
  readMoviesFile();
  for (i = 0; i < moviesToDelete.length; i++) {
    movieIndex = -1;
    for (j = 0; j < moviesList.length; j++) {
      if (moviesEqual(moviesToDelete[i], moviesList[j])) {
        movieIndex = j;
        break;
      }
    }
    if (movieIndex >= 0) {
      console.log("removing " + moviesList[j]);
      moviesList.splice(j, 1);
    }
  }
  res.send(JSON.stringify(moviesList));
  updateMoviesFile();
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.static(path.join(__dirname, '/public')));

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

function Movie(movieTitle, genre, year) {
  this.movieTitle = movieTitle;
  this.genre = genre;
  this.year = year;
}

function returnNoMovies(res, replacementText) {
  displayedMovies = [];
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

function sortByTitle(movie1, movie2) {
  return sortStrings(movie1.movieTitle, movie2.movieTitle);
}

function sortByGenre(movie1, movie2) {
  return sortStrings(movie1.genre, movie2.genre);
}

function sortByYear(movie1, movie2) {
  return -1 * sortStrings(movie1.year, movie2.year);
}

function sortStrings(string1, string2) {
  var result;
  if (string1 < string2) {
    result = -1;
  } else if (string1 > string2) {
    result = 1;
  } else {
    result = 0;
  }
  if (sortAscending) {
    result = result * -1;
  }
  return result;
}

function moviesEqual(movie1, movie2) {
  return movie1.movieTitle === movie2.movieTitle && movie1.genre === movie2.genre && movie1.year === movie2.year;
}
