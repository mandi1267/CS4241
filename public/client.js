/* Amanda Adkins, website: http://aaadkins-assignment7.herokuapp.com/ */

maxUserID = 0;
maxYakID = 0;

userUppedYaks = [];
userDownedYaks = [];

allYaks = [];

yaksList = [];

function onPageLoad() {
  // get yaks from server
  allYaks = [];
  displayAllYaks(allYaks);
  // check if userID in localstorage

  form = document.getElementById('yakAdder');
  form.addEventListener('submit', function(event) {
    console.log('submitting');
    addYak();
    event.preventDefault();
  });
}



function Yak(timestamp, yakMsg, gpsLoc, replies, votes, userID, yakID, vote) {
  this.timestamp = timestamp;
  this.yakMsg = yakMsg;
  this.votes = votes;
  this.replies = replies;
  this.gpsLoc = gpsLoc;
  this.userID = userID;
  this.yakID = yakID;
  this.vote = vote;
}

function makeNewYak(yakMsg, userID) {
  timestamp = Date.now();
  votes = 0;
  replies = [];
  maxYakID += 1;
  yakID = maxYakID;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(gpsLoc) {
      newYak = Yak(timestamp, yakMsg, gpsLoc, replies, votes, userID, yakID, 'noVote');
    });
    console.log(gpsLoc);
  } else {
    // don't know what to do here
    gpsLoc = "";
    newYak = Yak(timestamp, yakMsg, gpsLoc, replies, votes, userID, yakID, 'noVote');
    return newYak;
  }

}

function displayAllYaks(yaksList) {
  if (yaksList.length === 0) {
    yakBody.innerHTML = 'No yaks to display';
  } else {
    yakHTML = "";
    yaksList.forEach(function(p, i) {
      yakHTML += yakTemplate(p);
    });
    yakBody = document.getElementById('yakBody');
    yakBody.innerHTML = yakHTML;
  }
}

function didUserUpYak(yakID) {
  if (userUppedYaks.indexOf(yakID) != -1) {
    return true;
  }
  return false;
}

function didUserDownYak(yakID) {
  if (userDownedYaks.indexOf(yakID) != -1) {
    return true;
  }
  return false;
}

function getMaxUserId(yaksList) {
  maxUserID = 0;
  for (i = 0; i < yaksList.length; i++) {
    if (yaksList[i].userID > maxUserID) {
      maxUserID = yaksList[i].userID;
    }
  }
}

function getMaxYakID(yaksList) {
  maxUserID = 0;
  for (i = 0; i < yaksList.length; i++) {
    if (yaksList[i].userID > maxUserID) {
      maxUserID = yaksList[i].userID;
    }
  }

}

function gpsInRange(glsLoc1, gpsLoc2) {

}

function addYak() {
  yakMsgBox = document.getElementById('yakBox');
  yakMsg = yakMsgBox.value;

  userId = getUserID();
  console.log(userId);


  getMaxUserID(function(response) {
    maxID = response;
    if (userId < 0) {
      userId = maxID
      console.log('maxID');
      console.log(maxID);
      console.log("settign cookie");
      console.log(userId.toString());
      document.cookie= 'userID='+userId.toString();
    }
    // make new yak

    displayAllYaks(yaksList);
  });
}

function getMaxUserID(callback) {
  handleXMLHTTPGet('/getMaxUserID', 'none', callback);
}

function getUserID() {
  console.log("Cookie");
  console.log(document.cookie.userID)
  userID = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  console.log(userID);

  if (userID === "") {
    console.log('no user ID');
    return -1;
  } else {
    console.log('usserID ' + userID);
    return parseInt(userID);
  }
}

function sortYaksByTime(yaksList) {

}

function filterYaksByGPSLoc() {

}
