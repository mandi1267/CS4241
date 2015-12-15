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


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.static(path.join(__dirname, '/public')));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));

app.listen(port, function() {
  console.log('App is listening on port ' + port);
});
