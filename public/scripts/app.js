$(document).ready(function() {
  /*
   * Client-side JS logic goes here
   * jQuery is already loaded
   * Reminder: Use (and do all your DOM work in) jQuery's document ready function
   */
  function createTweetHeader(header){
    var $newHeader = $("<header>");
    var $newHtwo = $("<h2>");
    var $newImage = $("<img>");
    var $newNodeName = $(document.createTextNode(header[0]));
    var $newHfour = $("<h4>").addClass("atName");
    var $newNodeHandle = $(document.createTextNode(header[1]));

    $newImage.attr("src", header[2]);
    $newHeader.append($newHtwo, $newHfour);
    $newHfour.append($newNodeHandle);
    $newHtwo.append($newImage, $newNodeName);
    return $newHeader;
  }

  function createParagraph(para) {
    var $newPara = $("<p>").addClass("tweet-content");

    $newPara.append(para);
    return $newPara;
  }

  function createFooter(footer) {
    var $newFooter = $("<footer>");
    var $newDivTime = $("<div>").addClass("time-frame");
    var $newDivSocial = $("<div>").addClass("social-buttons");
    var $newIFlag = $("<i>").addClass("fa fa-flag");
    var $newIretweet = $("<i>").addClass("fa fa-retweet");
    var $newIheart = $("<i>").addClass("fa fa-heart");
    var $newNodeText = $(document.createTextNode("Just tweeted"));
    var theDay = Math.floor((Date.now() - footer)/86400000);

    $newDivTime.attr("data-time",footer);
    $newDivTime.append(theDay + " days ago.");
    $newDivSocial.append($newIFlag, $newIretweet, $newIheart);
    $newFooter.append($newDivTime, $newDivSocial);
    return $newFooter
  }

  function createTweetElement(tweet) {
    var $tweet = $("<article>").addClass("tweet-box");
    var $user = [tweet.user.name, tweet.user.handle, tweet.user.avatars.small];
    var $content = [tweet.content.text]
    var $createdAt = [tweet.created_at]
    var $footer = createFooter($createdAt);
    var $paragraph = createParagraph($content);
    var $header = createTweetHeader($user);
    var $handle = tweet.handle;

    $tweet.append($header, $paragraph, $footer);
    return $tweet;
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
