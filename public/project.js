function handleXMLHTTPGet(getFrom, queryString, callbackFunc) {

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": window.location.origin + getFrom + '?' + queryString,
    "method": "GET",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "b8241e93-87d3-1713-4188-5ec9c2653f79",
      "content-type": "application/x-www-form-urlencoded"
    }
  };
  $.ajax(settings).done(callbackFunc);
}


function handleXMLHTTPPost(postTo, postData, callbackFunc) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": window.location.origin + postTo,
    "method": "POST",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "b8241e93-87d3-1713-4188-5ec9c2653f79",
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": postData
  };

  $.ajax(settings).done(callbackFunc);
}
