/* Amanda Adkins */

var yakTemplate = _.template(
  "<div class='yak' id='yak<%= yakID %>'>" +
  "<p class='yakMsg'><%= yakMsg %></p>" +
  "<p class='votes <%= vote %>'><%= votes %></p>" +
  "</div>"
);
