//SELECTORS
let comment_btn = $(".add_comment");
let comment_form = $(".comment-form");

//Event Listeners
$(document).ready(() => {
  //default
  comment_form.hide();

  comment_btn.click(() => {
    comment_form.toggle();
  });
});
