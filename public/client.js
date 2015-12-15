/* Amanda Adkins, website: http://aaadkins-assignment7.herokuapp.com/ */

maxYakID  = 0;

userUppedYaks = [];
userDownedYaks = [];

allYaks = [];

function onPageLoad() {
  // get yaks from server
  allYaks = [];
  displayAllYaks(allYaks);
  // check if userID in localstorage

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
    gpsLoc = navigator.geolocation.getCurrentPosition();
    console.log(gpsLoc);
  } else {
    // don't know what to do here
    gpsLoc = "";
  }
  newYak = Yak(timestamp, yakMsg, gpsLoc, replies, votes, userID, yakID, 'noVote');
  return newYak;
}

function displayAllYaks(yaksList) {
  yakHTML = "";
  yaksList.forEach(function(p, i) {
    yakHTML += yakTemplate(p);
  });
  yakBody = document.getElementById('yakBody');
  yakBody.innerHTML = yakHTML;
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
