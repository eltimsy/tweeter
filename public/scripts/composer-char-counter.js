$(document).ready(function () {
  $('.tweet-text').on('input',function (){

    let textTotal = $(this).val().length;
    let counterLink = $(this).siblings('span');
    $(counterLink).text(140 - textTotal);
    let totalCount = Number(counterLink.text());

    if(totalCount < 0) {
      $(counterLink).css('color', 'red');
    } else {
      $(counterLink).css('color', 'teal');
    };
  })
});
