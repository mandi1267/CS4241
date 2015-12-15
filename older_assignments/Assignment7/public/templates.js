/* Amanda Adkins */

var articleListTemplate = _.template(
  "<div class='newsRow news' id='article<%= ID %>'>" +
  "<button type='button' class='delete' data-dismiss='alert' onclick='deleteClicked(event)'>" +
  "<span aria-hidden='true'>×</span>" +
  "</button>" +
  "<div class='newsInfo'>" +
  "<h2 class='titleLink'><a href=<%= url %>><%= articleTitle %></a></h2>" +
  "<h3><%= author %></h3>" +
  "<p><%= datePosted %></p>" +
  "<p><%= newsDescription %></p>" +
  "<p class='keywords'>Keywords: <%= keywords %></p>" +
  "<p class='srcSite'><%= sourceSite %></p>" +
  "</div> " +
  "<div class='newsPhoto'>" +
  "<a href=<%= thumbnail %>><img src='<%= thumbnail %>'/></a>" +
  "</div>" +
  "</div>"
);

var errorTemplate = _.template(
  "<div class='newsError news'>" +
  "<h2>Error loading <%= errorMsg %>. Sorry! </h2>" +
  "</div>"
);

var articleTileTemplate = _.template(
  "<div class='newsTile news' id='article<%= ID %>'>" +
  "<button type='button' class='delete' data-dismiss='alert' onclick='deleteClicked(event)'>" +
  "<span aria-hidden='true'>×</span>" +
  "</button>" +
  "<a href=<%= thumbnail %>><img src='<%= thumbnail %>'/></a>" +
  "<h3 class='titleLink'><a href=<%= url %>><%= articleTitle %></a></h3>" +
  "<p><%= sourceSite %></p>" +
  "</div>"
);

var articleListNoKeywords = _.template(
  "<div class='newsRow news' id='article<%= ID %>'>" +
  "<button type='button' class='delete' data-dismiss='alert' onclick='deleteClicked(event)'>" +
  "<span aria-hidden='true'>×</span>" +
  "</button>" +
  "<div class='newsInfo'>" +
  "<h2 class='titleLink'><a href=<%= url %>><%= articleTitle %></a></h2>" +
  "<h3><%= author %></h3>" +
  "<p><%= datePosted %></p>" +
  "<p><%= newsDescription %></p>" +
  "<p class='srcSite'><%= sourceSite %></p>" +
  "</div> " +
  "<div class='newsPhoto'>" +
  "<a href=<%= thumbnail %>><img src='<%= thumbnail %>'/></a>" +
  "</div>" +
  "</div>"
)
