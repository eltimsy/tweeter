
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
 function e(str) {
     var div = document.createElement('div');
     div.appendChild(document.createTextNode(str));
     return div.innerHTML;
 }

function createTweetElement(tweet) {
  var $user = [e(tweet.user.name), e(tweet.user.handle), e(tweet.user.avatars.small)];
  var $content = e(tweet.content.text)
  var $createdAt = e(tweet.created_at)
  var $handle = e(tweet.handle);

  var theDay = Math.floor((Date.now() - $createdAt)/86400000);
  var theHour = Math.floor((Date.now() - $createdAt)/3600000);
  var theMinute = Math.floor((Date.now()- $createdAt)/60000);
  var theSecond = Math.floor((Date.now()- $createdAt)/1000);
  var newTime = ""

  if(theDay > 0) {
    newTime = theDay + " days ago.";
  } else if(theHour > 0) {
    newTime = theHour + " hours ago.";
  } else if(theMinute > 0) {
    newTime = theMinute + " minutes ago.";
  } else {
    newTime = theSecond + " seconds ago.";
  }


  var template = _.template(
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
  var $allData = $("<div>");
  for(var data of tweets) {
    var $tweet = createTweetElement(data);
    //$("#all-tweets").append($tweet);
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

$(document).ready(function() {

  $('.container').on('click', 'article.tweet-box', function() {
    alert('Tweet, Tweet!');
  });
  $(".tweet-form").on("submit", function(env){
    env.preventDefault();
    var textTotal = $('.tweet-text').val().length;
    var tweetData = $(this).serialize();

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
