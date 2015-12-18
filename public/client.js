/* Amanda Adkins, website: http://aaadkins-assignment7.herokuapp.com/ */

maxUserID = 0;
maxYakID = 0;

uppedYaks = [];
downedYaks = [];

allYaks = [];

yaksList = [];

sessionID = "";

function onPageLoad() {
  // get yaks from server

  if (getUserID() === '') {
    getNewUserID(function(response) {
      userID = response;
      console.log('user')
      console.log(userID)
      document.cookie = "userID=" + userID + "; expires=Fri, 1 Jan 2017 12:00:00 UTC";
      loadingPt2();
    });
  } else {
    loadingPt2();
  }
}

function loadingPt2() {
  handleXMLHTTPGet('/getYaksList', "", function(response) {
    yaksList = response;
    form = document.getElementById('yakAdder');
    form.addEventListener('submit', function(e) {
      console.log('submitting');
      addYak();
      e.preventDefault();
    });

    if (sessionStorage.getItem('sessionID') === null) {

      sessionID = userID + (new Date().getTime().toString());
      sessionStorage.setItem('sessionID', sessionID)
    }
    handleXMLHTTPGet('/getVotesList', "", function(response) {
      console.log(response)
      setUppedAndDownedYaks(response);
      displayAllYaks(yaksList);
    });
  });
}




function Yak(timestamp, yakMsg, gpsLoc, replies, votes, userID, yakID, sesID) {
  this.timestamp = timestamp;
  this.yakMsg = yakMsg;
  this.votes = votes;
  this.replies = replies;
  this.gpsLoc = gpsLoc;
  this.userID = userID;
  this.yakID = yakID;
  this.sessionID = sesID;
}

function userVotedYak(userID, votedYakID, upVoted) {
  this.userID = userID;
  this.votedYakID = votedYakID;
  this.upVoted = upVoted;
}

function makeNewYak(yakMsg, idOfUser, callback) {
  timestamp = Date.now();
  votes = 0;
  replies = [''];
  getMaxYakID(function(max) {
    yakID = max;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(gpsLoc) {
        console.log(gpsLoc);
        newYak = new Yak(timestamp, yakMsg, gpsLoc, replies, votes, idOfUser, yakID, sessionID);
        callback(newYak);
      });
    } else {
      // don't know what to do here
      gpsLoc = "";
      console.log(yakID)
      newYak = new Yak(timestamp, yakMsg, gpsLoc, replies, votes, idOfUser, yakID, sessionID);
      console.log(newYak);
      callback(newYak);
    }
  })


}

function displayAllYaks(yaksList) {
  if (yaksList.length === 0) {
    yakBody.innerHTML = 'No yaks to display';
  } else {
    yakHTML = "";
    yaksList.forEach(function(p, i) {
      yakHTML += yakTemplate(convertYakToUserYak(p));
    });
    yakBody = document.getElementById('yakBody');
    yakBody.innerHTML = yakHTML;
  }
}


function getMaxYakID(callback) {
  handleXMLHTTPGet('/maxYakID', '', callback);
  // maxUserID = 0;
  // for (i = 0; i < yaksList.length; i++) {
  //   if (yaksList[i].userID > maxUserID) {
  //     maxUserID = yaksList[i].userID;
  //   }
  // }

}

function gpsInRange(glsLoc1, gpsLoc2) {

}

function addYak() {
  yakMsgBox = document.getElementById('yakBox');
  yakMsg = yakMsgBox.value;

  if (yakMsg !== "") {
      yakMsgBox.value = '';
    finishNewYak(yakMsg, userID)
  }
}

function finishNewYak(yakMsg, userId) {
  makeNewYak(yakMsg, userId, function(newYak) {
    console.log(newYak)
    handleXMLHTTPPost('/newYak', newYak, function(response) {
      console.log(response);
      displayAllYaks(response);
    });
  });

}

function getNewUserID(callback) {
  handleXMLHTTPGet('/getMaxUserID', 'none', callback);
}

function getUserID() {
  userID = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  return userID;
}

function sortYaksByTime(yaksList) {

}

function filterYaksByGPSLoc() {

}

function UserYak(timestamp, yakMsg, replies, voteStatus, myYak, votes, yakID) {
  this.timestamp = timestamp;
  this.yakMsg = yakMsg;
  this.replies = replies
  this.voteStatus = voteStatus;
  console.log(voteStatus)
  this.myYak = myYak
  this.votes = votes;
  this.yakID = yakID;
}

function convertYakToUserYak(originalYak) {
  voteStatus = 'noVote'
  if (uppedYaks.indexOf(originalYak.yakID) >= 0) {
    voteStatus = 'upped';
    console.log('upped');
  } else if (downedYaks.indexOf(originalYak.yakID) >= 0) {
    console.log('downed');
    voteStatus = 'downed';
  }
  if (originalYak.userID === userID) {
    myYak = true;
  } else {
    myYak = false;
  }
  newReplies = [];
  console.log(originalYak);
  console.log(originalYak.replies)
  for (i = 0; i < originalYak.replies.length; i++) {
    if (originalYak.replies[i] !== '') {
      newReplies.push(convertRepliesToUserReplies(originalYak.replies[i]));
    }
  }
  return new UserYak(originalYak.timestamp, originalYak.yakMsg, newReplies, voteStatus, myYak, originalYak.votes, originalYak.yakID);

}

function YakReply(replyMsg, timestamp, replierID, yakID, replyID) {
  this.replyMsg = replyMsg;
  this.timestamp = timestamp;
  this.replierID = replierID;
  this.yakID = yakID;
  this.replyID = replyID;
}

function UserYakReply(replyMsg, timestamp, myReply, yakID, replyID) {
  this.replyMsg = replyMsg;
  this.timestamp = timestamp;
  this.myReply = myReply;
  this.yakID = yakID;
  this.replyID = replyID;
}

function convertRepliesToUserReplies(originalReply) {
  return new UserYakReply(originalReply.replyMsg, originalReply.timestamp, originalReply.myReply, originalReply.yakID === userID, originalReply.replyID)
}


function setUppedAndDownedYaks(userVotedYaksList) {
  uppedYaks = [];
  downedYaks = [];

  for (i = 0; i < userVotedYaksList.length; i++) {
    console.log('userID' + userVotedYaksList[i].userID)
    console.log(userID)
    if (userVotedYaksList[i].userID === userID) {
      console.log('voted')
      console.log(userVotedYaksList[i])
      if (userVotedYaksList[i].upVoted === 'true') {
        uppedYaks.push(userVotedYaksList[i].votedYakID);
      } else {
        downedYaks.push(userVotedYaksList[i].votedYakID)
      }
    }
  }
  console.log(uppedYaks);
  console.log(downedYaks);
}


function downYak(e) {
  yakID =  e.target.id.slice(7);

  if ((downedYaks.indexOf(yakID) < 0) && (uppedYaks.indexOf(yakID) < 0)) {
    downedYaks.push(yakID);
    userVote = new userVotedYak(userID, yakID, false);
    handleXMLHTTPPost('/voteOnYak', userVote, function(response) {
      console.log(response);
    });
  }
}

function upYak(e) {
  yakID = e.target.id.slice(5);

  if ((downedYaks.indexOf(yakID) < 0) && (uppedYaks.indexOf(yakID) < 0)) {
    uppedYaks.push(yakID);
    userVote = new userVotedYak(userID, yakID, true);
    handleXMLHTTPPost('/voteOnYak', userVote, function(response) {
      console.log(response);
      yaksList = response;
      displayAllYaks(yaksList)
    });
  }
}
