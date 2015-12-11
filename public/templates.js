var compiled = _.template(
  "<div class='newsItem'>" +
  "<div class='newsInfo'>" +
  "<h2 class='titleLink'><a href=<%= url %>><%= articleTitle %></a></h2>" +
  "<p>Date: <%= datePosted %></p>" +
  "<p><%= newsDescription %></p>" +
  "<p class='keywords'>Keywords: <%= keywords %></p>" +
  "<p>From: <%= sourceSite %></p>" +
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
  "<div class='newsError'>" +
  "<h2>Error loading <%= errorMsg %>. Sorry! </h2>" +
  "</div>"
);

var articleTileTemplate = _.template(
  "<div class='newsItem'>" +
  "<div class='newsInfo'>" +
  "<h2 class='titleLink'><a href=<%= url %>><%= articleTitle %></a></h2>" +
  "<p>From: <%= sourceSite %></p>" +
  "</div> " +
  "<div class='newsPhoto'>" +
  "<a href=<%= thumbnail %>><img src='<%= thumbnail %>'/></a>" +
  "</div>" +
  "</div>"
);
