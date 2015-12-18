/* Amanda Adkins */

var yakTemplate = _.template(
  '<div class="panel panel-default">' +
  '<div class="panel-body">' +
  "<div class='row yak' id='yak<%= yakID %>'>" +
  '<div class="col-md-8">' +
  "<p class='yakMsg'><%= yakMsg %></p>" +
  '</div>' +
  '<div class="floatRight smallMarginRight">' +
  "<p class='votes <%= voteStatus %> floatRight'>" +
  "<span class='glyphicon glyphicon-chevron-down' aria-hidden='true' onclick='downYak(event)' id='downYak<%= yakID %>'></span>" +
  "&nbsp <%= votes %> &nbsp<span id='upYak<%= yakID %>'  onclick='upYak(event)' class='glyphicon glyphicon-chevron-up' aria-hidden='true'></span></p>" +
  "</div>" +
  "</div>" +
  "</div>" +
  "</div>"
);

function renderClassVote(userYak) {
  if (userYak.upped) {
    console.log('upped')
    return 'upped';
  } else if (userYak.downed) {
    return 'downed'
  }
}
