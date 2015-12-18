// Author: Amanda Adkins
// Website: http://aaadkins-assignment7.herokuapp.com/
var express = require('express');
var path = require('path');
var fs = require('fs');

var _ = require('underscore');

var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

var yaksList = [];
var votesList = [];

var maxYakID = -1;
var maxUserID = -1;

console.log('HERE1');
readAllYaks(function(listOfYaks) {
  yaksList = listOfYaks;
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/getMaxUserID', function(req, res) {
  console.log('sending new userid')
  res.send(getMaxUserID().toString());
});

app.get('/getYaksList', function(req, res) {
  readAllYaks(function(listOfYaks) {
    res.send(yaksList);
  });
});

app.get('/getVotesList', function(req, res) {
  readAllVotes(function(listOfVotes) {
    res.send(votesList);
  })
});


app.get('/maxYakID', function(req, res) {
  maxId = getMaxYakID();
  res.send(maxId.toString());
});

app.post('/newYak', function(req, res) {
  console.log(req.body);
  maxYakID += 1;
  addYakToFile(req.body, function(listOfYaks) {
    res.send(yaksList);
  });
});

app.post('/voteOnYak', function(req, res) {
  console.log(req.body);
  console.log(req.body.votedYakID)
  if (req.body.upVoted === 'true') {
    upVoted = true
  }
  else {
    upVoted = false
  }
  voteOnYakWithID(req.body.votedYakID, upVoted);
  addVoteToFile(req.body, function(listOfYaks) {
    res.send(yaksList);
  });
});

app.use(express.static(path.join(__dirname, '/public')));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});

function readAllYaks(callbackFunc) {
  var fileStream = fs.createReadStream(path.join(__dirname, 'public/yaksFile.txt'));
  var yaksListString = "";

  fileStream.on('data', function(data) {
    yaksListString += data.toString();
  });

  fileStream.on('end', function() {
    //console.log("hi");
    //callbackFunc(articlesString);
    yaksList = JSON.parse(yaksListString);
    callbackFunc(yaksList);
  });
}

function addYakToFile(newYak, callback) {
  readAllYaks(function(newYaksList) {
    yaksList = newYaksList
    yaksList.unshift(newYak);
    writeAllYaks(yaksList);
    callback(yaksList);
  });
}

function addVoteToFile(newVote, callback) {
  readAllVotes(function(newVotesList) {
    votesList = newVotesList
    votesList.unshift(newVote);
    writeAllVotes(votesList);
    callback(votesList);
  });
}

function writeAllYaks(listOfYaks) {
  var fileStream = fs.createWriteStream(path.join(__dirname, 'public/yaksFile.txt'));
  fileStream.write(JSON.stringify(listOfYaks));
}

function writeAllVotes(listOfVotes) {
  var fileStream = fs.createWriteStream(path.join(__dirname, 'public/yakVotes.txt'));
  fileStream.write(JSON.stringify(listOfVotes));
}

function readAllVotes(callbackFunc) {
  var fileStream = fs.createReadStream(path.join(__dirname, 'public/yakVotes.txt'));
  var votesListString = "";

  fileStream.on('data', function(data) {
    votesListString += data.toString();
  });

  fileStream.on('end', function() {
    console.log(votesListString)
    votesList = JSON.parse(votesListString);
    callbackFunc(votesList);
  });
}

function getMaxYakID() {
  if (maxYakID === -1) {
    max = 0;
    for (i = 0; i < yaksList.length; i++) {
      if (parseInt(yaksList[i].yakID) > max) {
        max = yaksList[i].yakID;
      }
    }
    maxYakID = max;
  } else {
    maxYakID += 1
  }
  return maxYakID;
}

function getMaxUserID() {
  if (maxUserID === -1) {
    max = 0;
    for (i = 0; i < yaksList.length; i++) {
      if (parseInt(yaksList[i].userID) > max) {
        max = yaksList[i].userID;
      }
    }
    maxUserID = max;
  } else {
    maxUserID += 1
  }
  return maxUserID;
}


function voteOnYakWithID(yakID, upVote) {
  for (i = 0; i < yaksList.length; i++) {
    if (yakID === yaksList[i].yakID) {
      if (upVote) {
        yaksList[i].votes = (parseInt(yaksList[i].votes) + 1).toString()
      } else {
        yaksList[i].votes = (parseInt(yaksList[i].votes) - 1).toString()
      }
    }
  }

  writeAllYaks(yaksList);
}
