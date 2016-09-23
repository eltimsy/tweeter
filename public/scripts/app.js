'use strict'

function e(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createTweetElement(tweet) {
  let user = [e(tweet.user.name), e(tweet.user.handle), e(tweet.user.avatars.small)];
  let content = e(tweet.content.text);
  let createdAt = e(tweet.created_at);

  let theDay = Math.floor((Date.now() - createdAt)/86400000);
  let theHour = Math.floor((Date.now() - createdAt)/3600000);
  let theMinute = Math.floor((Date.now()- createdAt)/60000);
  let theSecond = Math.floor((Date.now()- createdAt)/1000);
  let newTime = "";

  if(theDay > 0) {
    newTime = theDay + " days ago.";
  } else if(theHour > 1) {
    newTime = theHour + " hours ago.";
  } else if (theHour === 1) {
    newTime = theHour + " hour ago.";
  } else if(theMinute > 0) {
    newTime = theMinute + " minutes ago.";
  } else {
    newTime = theSecond + " seconds ago.";
  }

  let template = _.template(
    "<article class='tweet-box'>" +
      "<header>" +
        "<h2> <img src= <%= usericon %>> <%= username %> </h2>" +
        "<h4 class='atName'> <%= userhandle %> </h4>" +
      "</header>" +
      "<p class='tweet-content'> <%= paragraph %> </p>" +
      "<footer>" +
        "<div class='time-frame'> <%= newTime %> </div>" +
        "<div class='social-buttons'>" +
          "<i class='fa fa-flag'></i>" +
          "<i class='fa fa-retweet'></i>" +
          "<i class='fa fa-heart'></i>" +
        "</div>" +
      "</article>"
  );

  return template({
    username: user[0],
    usericon: user[2],
    userhandle: user[1],
    paragraph: content,
    newTime: newTime
  });
}

function renderTweets(tweets) {
  let $allData = $("<div>");
  for(let tweet of tweets) {
    let $tweet = createTweetElement(tweet);
    $allData.append($tweet);
  }
  $("#all-tweets").append($allData);
}

function resetTweets() {
  $("#all-tweets").empty();
  $(".tweet-text").val("");
  $(".counter").text("140");
}

function loadTweets(url, user) {
  $.ajax({
    url: url,
    method: 'GET',
    success: function(data) {
      if(data === undefined) {
        alert("no data");
      } else {
        resetTweets();
        renderTweets(data);
      }
    },
    error: function(request, status, error) {
      alert(request.reponseText);
    }
  });
}

function postTweets(tweetData) {
  $.ajax({
    url: '/tweets',
    method: 'post',
    data: tweetData,
    success: function(data) {
      if(data === undefined) {
        alert("no data");
      } else {
        if(username) {
          loadTweets('/tweets/my');
        } else {
          loadTweets('/tweets');
        }
      }
    },
    error: function(request, status, error) {
      alert(request.reponseText);
    }
  });
}


function makeLogin(user) {
  if(user){
    var template = _.template(
      '<div class="full-logout">' +
        '<div class="login-name"> Welcome! <%= username %> </div>' +
        '<form class="logout-form" action="/logout" method="POST">' +
          '<input class="button" type="submit" value="Logout">' +
        '</form>'+
      '</div>'
    )

  } else {
    var template = _.template(
      '<div class="full-login">' +
        '<form class="login-form" action="/login" method="POST">' +
          '<input class="login-box" id="username" type="text" name="username" placeholder="name" style="width: 100px">' +
          '<input class="button" type="submit" value="Login">' +
        '</form>' +
      '</div>'
    )
  }
  return template({
    username: user
  });
}

function checkUser() {
  $.ajax({
    url: '/auth',
    method: 'get',
    success: function(data) {
      if(!data.username) {
        let $newlogin = makeLogin(data.username);
        $(".full-login").css({"margin":"0"});
        $(".full-login").empty().append($newlogin);
        loadTweets('/tweets');
      } else {
        let $newlogin = makeLogin(data.username);
        $(".full-login").css({"margin":"0"});
        $(".full-login").empty().append($newlogin);
        loadTweets('/tweets/my', data.username);
      }
    },
    error: function(request, status, error) {
      alert(request.responseText);
    }
  });
}

$(document).ready(function() {

  checkUser();

  $('#nav-bar').on('submit', ".login-form", function(ev) {
    let login = $(this).serialize();
    ev.preventDefault();
    console.log("data", login)
    $.ajax({
      url: '/login',
      method: 'post',
      data: login,
      success: function(data) {
        if(data === undefined) {
            alert("no error");
          } else {
            checkUser();
          }
        },
      error: function(request, status, error) {
        alert(request.reponseText);
      }
    });
  })

  $('#nav-bar').on('submit', ".logout-form", function(ev) {
    ev.preventDefault();
    $.ajax({
      url: '/logout',
      method: 'post',
      success: function() {
        checkUser();
      },
      error: function(request, status, error) {
        alert(request.reponseText);
      }
    });
  })


  $('.container').on('click', 'article.tweet-box', function() {
    // tweet tweet
  });

  $(".tweet-form").on("submit", function(ev) {
    ev.preventDefault();
    let textTotal = $('.tweet-text').val().length;
    let tweetData = $(this).serialize();

    $('.error-message').text('');
    $('.error-message').fadeIn();

    if(textTotal === 0) {
      $('.error-message').text("Type something please");
      $('.error-message').fadeOut(1500);
    } else if(textTotal > 140) {
      $('.error-message').text("You typed more than 140 characters!");
      $('.error-message').fadeOut(1500);
    } else {
      postTweets(tweetData);
    }
  });

});
