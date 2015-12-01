//var moviesRequest = new XMLHTTPRequest();
moviesList = [];
displayedMovies = [];
lastSortedBy = "";
lastSearchBy = "";
lastSearchFor = "";
sortAscending = true;
editingCellID = "";
editingData = "";

function Movie(movieTitle, genre, year) {
  this.movieTitle = movieTitle;
  this.genre = genre;
  this.year = year;
}

function getURLParam(oTarget, sVar) {
  return decodeURI(oTarget.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function getMovies(callbackFunction) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      movieString = xmlHttp.responseText;
      moviesList = JSON.parse(movieString);
      callbackFunction(moviesList);
    }
  };
  xmlHttp.open("GET", "movies", true); // true for asynchronous
  xmlHttp.send(null);
}

function showInitialTable() {
  if (window.location.search == "") {
    getMovies(showMoviesInTable);
  } else {
    getMovies(finishURLSearch);
  }
}

function finishURLSearch(moviesList) {
  searchFor = getURLParam(window.location, "searchFor");
  searchBy = getURLParam(window.location, "searchBy");
  document.getElementById("search").value = searchFor;
  document.getElementById("searchBy").value = searchBy;
  runSearch(searchBy, searchFor);
}

function searchMovie() {
  getMovies(finishSearch);
}

function finishSearch() {
  searchField = document.getElementById("search").value;
  searchBy = document.getElementById("searchBy").value;
  runSearch(searchBy, searchField);
}

function runSearch(searchBy, searchFor) {
  newURL = stripQueryStringAndHashFromPath(window.location.href);
  updateURL(newURL + '?searchFor=' + searchFor + '&searchBy=' + searchBy);
  lastSearchBy = searchBy;
  lastSearchFor = searchFor;
  matchingMovies = searchMovies(searchFor, searchBy);
  showMoviesInTable(matchingMovies);
}

function clearSearch() {
  document.getElementById("search").value = "";
  document.getElementById("searchBy").selectedIndex = "0";
  lastSortedBy = "";
  getMovies(showMoviesInTable);
  clearSearchFromUI();
}

function clearSearchFromUI() {
  lastSearchBy = "";
  lastSearchFor = "";
  newURL = stripQueryStringAndHashFromPath(window.location.href);
  updateURL(newURL);
}

function clearAdd() {
  document.getElementById("addMovieTitle").value = "";
  document.getElementById("addMovieGenre").value = "";
  document.getElementById("addMovieYear").value = "";
}

function submitAdd() {
  newTitle = document.getElementById("addMovieTitle").value;
  newGenre = document.getElementById("addMovieGenre").value;
  newYear = document.getElementById("addMovieYear").value;
  if ((newTitle !== "") && (newGenre !== "") && (newYear !== "")) {
    lastSortedBy = "";
    addMovie(newTitle, newGenre, newYear);
    showMoviesInTable(moviesList);
    clearSearchFromUI();

    document.getElementById("addMovieTitle").value = "";
    document.getElementById("addMovieGenre").value = "";
    document.getElementById("addMovieYear").value = "";
  } else {
    alert("Please fill in all fields before adding");
  }
}

function addMovie(movieTitle, movieGenre, movieYear) {
  newMovie = new Movie(movieTitle, movieGenre, movieYear);
  if (!movieInList(newMovie)) {
    moviesList.push(newMovie);
    console.log("Adding movie");
    console.log(newMovie);
    sendAddToServer(newMovie);
  }
}

function searchMovies(searchQuery, searchField) {
  matchingMovies = [];
  if (searchField === "title") {
    matchingMovies = moviesList.filter(checkNameInTitle(searchQuery));
  } else if (searchField === "genre") {
    matchingMovies = moviesList.filter(checkGenre(searchQuery));
  } else if (searchField === "year") {
    matchingMovies = moviesList.filter(checkMatchingYear(searchQuery));
  }
  return matchingMovies;
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

function showMoviesInTable(moviesToShow) {
  if (moviesToShow.length == 0) {
    tableInfo = document.getElementById("moviesTable"); //.innerHTML;
    tableInfo.innerHTML = "No movies to show";
  } else {
    showTableWithMovies(moviesToShow);
  }
}

function showTableWithMovies(moviesToShow) {
  if (lastSortedBy === "Title") {
    moviesToShow.sort(compareByTitle);
  } else if (lastSortedBy === "Year") {
    moviesToShow.sort(compareByYear);
  } else if (lastSortedBy === "Genre") {
    moviesToShow.sort(compareByYear);
  }
  displayedMovies = moviesToShow;
  tableInfo = document.getElementById("moviesTable"); //.innerHTML;
  tableInfo.innerHTML = "";
  var tableElt = document.createElement('table');
  tableElt.setAttribute('id', 'tableOfMovies');
  tableHeading = document.createElement('thead');
  row = tableHeading.insertRow(0);
  cell0 = document.createElement('th');
  cell1 = document.createElement('th');
  cell2 = document.createElement('th');
  cell3 = document.createElement('th');
  cell0.innerHTML = 'Title';
  cell1.innerHTML = 'Genre';
  cell2.innerHTML = 'Year';
  cell3.innerHTML = 'Select';
  cell0.addEventListener('click', sortByTitle, false);
  cell1.addEventListener('click', sortByGenre, false);
  cell2.addEventListener('click', sortByYear, false);
  cell0.className += " clickToSort"
  cell1.className += " clickToSort"
  cell2.className += " clickToSort"
  row.appendChild(cell0);
  row.appendChild(cell1);
  row.appendChild(cell2);
  row.appendChild(cell3);
  tableElt.appendChild(tableHeading);
  var tableBody = document.createElement('tbody');
  for (var i = 0; i < moviesToShow.length; i++) {
    addRowForMovie(tableBody, moviesToShow[i], i);
  }
  tableElt.appendChild(tableBody);
  tableInfo.appendChild(tableElt);
  deleteButton = document.createElement('input');
  deleteButton.value = "Delete Selected Items";
  deleteButton.setAttribute('type', 'button');
  deleteButton.setAttribute('id', 'deleteButton');
  deleteButton.addEventListener('click', deleteMovies, false);

  tableInfo.appendChild(deleteButton);
}

function addRowForMovie(tableBody, movieToShow, rowIndex) {
  tableRow = tableBody.insertRow(rowIndex);
  for (i = 0; i < 4; i++) {
    tableRow.insertCell(i);
  }
  tableRow.cells[0].innerHTML = movieToShow.movieTitle;
  tableRow.cells[1].innerHTML = movieToShow.genre;
  tableRow.cells[2].innerHTML = movieToShow.year;
  tableRow.cells[3].setAttribute('class', 'deleteCheckbox');
  tableRow.cells[0].setAttribute('id', 'title__' + removeSpacesFromString(movieToShow.movieTitle + '__' + movieToShow.genre + '__' + movieToShow.year));
  tableRow.cells[1].setAttribute('id', 'genre__' + removeSpacesFromString(movieToShow.movieTitle + '__' + movieToShow.genre + '__' + movieToShow.year));
  tableRow.cells[2].setAttribute('id', 'year__' + removeSpacesFromString(movieToShow.movieTitle + '__' + movieToShow.genre + '__' + movieToShow.year));
  for (i = 0; i < 3; i++) {
    tableRow.cells[i].addEventListener('click', function() {
      editTableCell(this.id);
    });
  }
  checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', 'select' + removeSpacesFromString(movieToShow.movieTitle + movieToShow.year));
  tableRow.cells[3].appendChild(checkbox);
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

function removeSpacesFromString(editString) {
  return editString.replace(/\s+/g, '');
}

function deleteMovies() {
  moviesToDelete = []
  for (var j = moviesList.length - 1; j >= 0; j--) {
    currentMovie = moviesList[j];
    removeTag = removeSpacesFromString(currentMovie.movieTitle + currentMovie.year);
    var selectVar = document.getElementById("select" + removeTag);
    if (selectVar !== null) {
      if (selectVar.checked) {
        moviesToDelete.push(moviesList[j]);
        console.log("delete " + moviesList[j].movieTitle);
      }
    }
  }

  sendDeleteToServer(moviesToDelete, finishDeletion);
}

function sendAddToServer(movieToAdd) {
  addMovieString = JSON.stringify(movieToAdd);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {}
  };
  xmlHttp.open("POST", "addMovie", true);
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.send("addMovie=" + addMovieString);
}

function sendDeleteToServer(moviesToDelete, callbackFunction) {
  deleteMoviesString = JSON.stringify(moviesToDelete);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      moviesList = JSON.parse(xmlHttp.responseText);
      callbackFunction();
    }
  };
  xmlHttp.open("POST", "deleteMovies", true);
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.send("deleteMovies=" + deleteMoviesString);
}

function finishDeletion() {
  if (lastSearchBy !== "") {
    runSearch(lastSearchBy, lastSearchFor);
  } else {
    showMoviesInTable(moviesList);
  }
}

function sortByTitle() {
  if (displayedMovies.length != 0) {
    if (lastSortedBy === "Title") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
    }
    lastSortedBy = "Title";
    displayedMovies.sort(compareByTitle);
    showMoviesInTable(displayedMovies);
  }
}

function sortByGenre() {
  if (displayedMovies.length != 0) {
    if (lastSortedBy === "Genre") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
    }
    lastSortedBy = "Genre";
    displayedMovies.sort(compareByGenre);
    showMoviesInTable(displayedMovies);
  }
}

function sortByYear() {
  if (displayedMovies.length != 0) {
    if (lastSortedBy === "Year") {
      sortAscending = !sortAscending;
    } else {
      sortAscending = true;
    }
    lastSortedBy = "Year";
    displayedMovies.sort(compareByYear);
    showMoviesInTable(displayedMovies);
  }
}

function compareByTitle(movie1, movie2) {
  return sortStrings(movie1.movieTitle, movie2.movieTitle);
}

function compareByGenre(movie1, movie2) {
  return sortStrings(movie1.genre, movie2.genre);
}

function compareByYear(movie1, movie2) {
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

function stripQueryStringAndHashFromPath(url) {
  return url.split("?")[0];
}

function updateURL(newURL) {
  html = document.getElementById("content").innerHTML;
  docTitle = document.title;
  window.history.pushState({
    "html": html,
    "pageTitle": docTitle
  }, "", newURL);
}

function editTableCell(cellID) {
  if (editingCellID !== cellID) {
    if (editingCellID !== "") {
      oldCell = document.getElementById(editingCellID);
      oldCell.innerHTML = editingData;
    }
    cellToModify = document.getElementById(cellID);
    cellParent = cellToModify.parentElement;
    oldMovie = new Movie(cellParent.cells[0].innerHTML, cellParent.cells[1].innerHTML, cellParent.cells[2].innerHTML);
    console.log(oldMovie);
    data = cellToModify.innerHTML;
    editingCellID = cellID;
    editingData = data;
    cellToModify.innerHTML = "";
    textBox = document.createElement('input');
    textBox.setAttribute('type', 'textIn');
    textBox.value = data;
    textBox.onmouseout = function() {
      cellToModify.innerHTML = data;
      editingCellID = "";
      editingData = "";
    };
    textBox.onkeydown = function() {
      if (event.keyCode == 13) {
        pieces = cellID.split('__');
        newTitle = cellParent.cells[0].innerHTML;
        newGenre = cellParent.cells[1].innerHTML;
        newYear = cellParent.cells[2].innerHTML;
        if (pieces[0] === 'title') {
          newTitle = this.value;
        } else if (pieces[0] === 'genre') {
          newGenre = this.value;
        } else if (pieces[0] === 'year') {
          newYear = this.value;
        }

        //  newMovie = new Movie(newTitle, newGenre, newYear);
        //  deleteList =[];
        //deleteList.push(old)
        sendDeleteToServer([oldMovie], function() {
          addMovie(newTitle, newGenre, newYear);
          if (lastSearchBy !== "") {
            runSearch(lastSearchBy, lastSearchFor)
          } else {
            showMoviesInTable(moviesList);
          }

          editingCellID = "";
          editingData = "";
        });

      }
    }
    textBox.className = "tableTextBox";
    cellToModify.appendChild(textBox);
  }

}
