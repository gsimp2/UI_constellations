$(document).ready(function () {

  if (round == "1") {
    text = "Continue learning"
  }
  else {
    text = "Challenge yourself"
  }
  let newHtml = `
    <button class="btn quiz" type="button" id="learn">`+ text + `</button>`
  $('#buttons').append(newHtml);
  $('#score').text("You got " + score + " out of 8 questions right");

  $('#learn').click(function () {
    if (round == "1")
      window.location.href = '/learn/3';
    else
      window.location.href = '/quiz/hard';
  });
  $('#easy').click(function () {
    if (round == "1")
      window.location.href = '/learn/1';
    else
      window.location.href = '/learn/3';
  })
});