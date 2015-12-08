// Author: Amanda Adkins
// Website: https://aaadkins-cs4241-assignment6.herokuapp.com/
var express = require('express');
var path = require('path');
var fs = require('fs');


var app = express();
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.static(path.join(__dirname, '/public')));

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});
