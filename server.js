// Author: Amanda Adkins
// Website: https://aaadkins-cs4241-assignment5.herokuapp.com/
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

app.get('/movies', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/results.txt'));
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

function moviesEqual(movie1, movie2) {
  return movie1.movieTitle === movie2.movieTitle && movie1.genre === movie2.genre && movie1.year === movie2.year;
}
