'use strict'
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
 function e(str) {
     let div = document.createElement('div');
     div.appendChild(document.createTextNode(str));
     return div.innerHTML;
 }

function createTweetElement(tweet) {
  let $user = [e(tweet.user.name), e(tweet.user.handle), e(tweet.user.avatars.small)];
  let $content = e(tweet.content.text)
  let $createdAt = e(tweet.created_at)
  let $handle = e(tweet.handle);

  let theDay = Math.floor((Date.now() - $createdAt)/86400000);
  let theHour = Math.floor((Date.now() - $createdAt)/3600000);
  let theMinute = Math.floor((Date.now()- $createdAt)/60000);
  let theSecond = Math.floor((Date.now()- $createdAt)/1000);
  let newTime = ""

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


  //$tweet.append($header, $paragraph, $foote);
  return template({
    username: $user[0],
    usericon: $user[2],
    userhandle: $user[1],
    paragraph: $content,
    newTime: newTime
  });
}

function renderTweets(tweets) {
  let $allData = $("<div>");
  for(let data of tweets) {
    let $tweet = createTweetElement(data);
    $allData.append($tweet);
  }
  $("#all-tweets").append($allData);
}

function loadTweets() {
  $.ajax({
    url: '/tweets',
    method: 'GET',
    success: function(data) {
      if(data === undefined) {
        alert("no data");
      } else {
        $("#all-tweets").empty();
        $(".tweet-text").val("");
        $(".counter").text("140");
        renderTweets(data)
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
        loadTweets();
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
      '<div class="full-login">' +
        '<div class="login-name"> <%= username %> </div>' +
        '<form action="/logout" method="POST" style="margin:10px;">' +
          '<input type="submit" value="Logout">' +
        '</form>'+
      '</div>'
    )

  } else {
    var template = _.template(
      '<div class="full-login">' +
        '<form class="login-form" action="/login" method="POST" style="margin:10px;">' +
          '<input id="username" type="text" name="username" placeholder="name" style="width: 100px">' +
          '<input type="submit" value="Login">' +
        '</form>' +
      '</div>'
    )
  }
  return template({
    username: user
  });
}

$(document).ready(function() {

  $('.full-login').on("submit", function(ev) {
    ev.preventDefault();
    console.log($('#username').val());
    let $newlogin = makeLogin($('#username').val());
    $(".full-login").empty();
    $(".full-login").append($newlogin);
  })

  $('.container').on('click', 'article.tweet-box', function() {
    alert('Tweet, Tweet!');
  });
  $(".tweet-form").on("submit", function(env) {
    env.preventDefault();
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

  loadTweets();

});
