var articleListTemplate = _.template(
  "<div class='newsRow news' id='article<%= ID %>'>" +
  "<button type='button' class='delete' data-dismiss='alert' onclick='deleteClicked(event)'>" +
  "<span aria-hidden='true'>×</span>" +
  "</button>" +
  "<div class='newsInfo'>" +
  "<h2 class='titleLink'><a href=<%= url %>><%= articleTitle %></a></h2>" +
  "<p><%= author %>" +
  "<p><%= datePosted %></p>" +
  "<p><%= newsDescription %></p>" +
  "<p class='keywords'>Keywords: <%= keywords %></p>" +
  "<p><%= sourceSite %></p>" +
  /*  "<a href=https://www.facebook.com/dialog/share?app_id=145634995501895&amp;display=popup&amp;href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&amp;redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer>Share on facebook</a>" +
    "<p onclick='callfacebook(event)'>Facebook</p>" +
    "<div class='fb-share-button' data-href='<%= url %>' data-layout='icon'></div> " + */
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
