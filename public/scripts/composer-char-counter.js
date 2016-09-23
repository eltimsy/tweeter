$(document).ready(function () {
  $('.tweet-text').on('input', function (){

    let textTotal = $(this).val().length;
    let counterLink = $(this).siblings('span');
    let charCount = 140 - textTotal;
    $(counterLink).text(charCount);

    if(charCount < 0) {
      $(counterLink).css('color', 'red');
    } else {
      $(counterLink).css('color', 'teal');
    };
  })
});
