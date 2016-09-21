$(document).ready(function() {
  $(".compose").on("click", function() {
    $(".new-tweet").slideToggle("slow", function() {
        $(".tweet-text").select();
    });
  });
});
