$(document).ready(function() {
  /*
   * Client-side JS logic goes here
   * jQuery is already loaded
   * Reminder: Use (and do all your DOM work in) jQuery's document ready function
   */
   var data = [
     {
       "user": {
         "name": "Newton",
         "avatars": {
           "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
           "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
           "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
         },
         "handle": "@SirIsaac"
       },
       "content": {
         "text": "If I have seen further it is by standing on the shoulders of giants"
       },
       "created_at": 1461116232227
     },
     {
       "user": {
         "name": "Descartes",
         "avatars": {
           "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
           "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
           "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
         },
         "handle": "@rd" },
       "content": {
         "text": "Je pense , donc je suis"
       },
       "created_at": 1461113959088
     },
     {
       "user": {
         "name": "Johann von Goethe",
         "avatars": {
           "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
           "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
           "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
         },
         "handle": "@johann49"
       },
       "content": {
         "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
       },
       "created_at": 1461113796368
     }
   ];

  function renderTweets(tweets) {

  }
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

    $newDivTime.attr("data-time",footer);
    $newDivTime.append($newNodeText);
    $newDivSocial.append($newIFlag, $newIretweet, $newIheart);
    $newFooter.append($newDivTime, $newDivSocial);
    return $newFooter
  }

  function createTweetElement(tweet) {
    var $tweet = $("<article>").addClass("tweet-box");
    var $user = [tweet.user.name, tweet.user.handle, tweet.user.avatars.small];
    var $content = [tweet.content.text]
    var $createdAt = [tweet.created_at]
    console.log($createdAt)
    var $footer = createFooter($createdAt);
    var $paragraph = createParagraph($content);
    var $header = createTweetHeader($user);

    console.log($header);
    var $handle = tweet.handle;
    $tweet.append($header, $paragraph, $footer);
    return $tweet;
  }

  function renderTweets(tweets) {
    for(var data of tweets) {
      var $tweet = createTweetElement(data);
      console.log($tweet);
      $("#all-tweets").append($tweet);
    }
  }

  renderTweets(data);

});
