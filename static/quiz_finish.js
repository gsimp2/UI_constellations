$(document).ready(function () {

    $('#score').text("You got " + score + " out of 8 questions right");

    $('#learn').click(function () {
      window.location.href = '/learn/1';
    });
    $('#easy').click(function () {
      window.location.href = '/quiz/easy';
    })
    $('#hard').click(function () {
      window.location.href = '/quiz/hard';
    })
  });