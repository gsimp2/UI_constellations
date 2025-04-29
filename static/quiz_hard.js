let currentConstellation = null;
let currentName = null;
let hasAnswered = false;

$(document).ready(function () {
  initQuiz();

  $("#answer-input").on("keypress", function (event) {
    if (event.which === 13 && !hasAnswered) {
      checkAnswer();
      event.preventDefault();
    }
  });

  $("#submit-btn").on("click", checkAnswer);
  $("#next-btn").on("click", nextQuestion);
});

function initQuiz() {
  $("#image-container").empty();
  $("#feedback-text").empty();
  $("#learn-text").empty();
  $("#score").text("0/0");
  hasAnswered = false;

  $.ajax({
    type: "POST",
    url: "/quiz/hard/init",
    contentType: "application/json",
    success: function (response) {
      currentConstellation = response.constellation;
      currentName = response.name;
      $("#score").text(`${response.score}/${response.current_index}`);
      updateProgressBar(response.current_index);
      displayQuestion();
    },
    error: function (xhr, status, error) {
      console.error("Error initializing quiz:", error);
    },
  });
}

function updateProgressBar(idx) {
  let rects = $(".progress-rect");

  rects.removeClass("filled");

  for (let i = 0; i < idx; i++) {
    $(rects[i]).addClass("filled");
  }
}

function displayQuestion() {
  hasAnswered = false;
  $("#feedback-text").empty();
  $("#learn-text").empty();

  $("#answer-input").val("").prop("disabled", false);
  $("#submit-btn").prop("disabled", false);
  $("#next-btn").prop("disabled", true);

  $("#image-container").html(
    `<img src="/static/${currentConstellation["challenge-photo"]}" alt="${currentConstellation.name}" class="img-fluid">`
  );

  $("#answer-input").focus();
}

function checkAnswer() {
  if (hasAnswered) return;
  hasAnswered = true;

  const userAnswer = $("#answer-input").val().trim();

  $("#answer-input").prop("disabled", true);
  $("#submit-btn").prop("disabled", true);
  $("#next-btn").prop("disabled", false);

  $.ajax({
    type: "POST",
    url: "/quiz/hard/submit",
    contentType: "application/json",
    data: JSON.stringify({
      name: currentName,
      answer: userAnswer,
    }),
    success: function (response) {
      if (response.is_correct) {
        $("#feedback-text").html(`<span class="correct">Correct!</span>`);
      } else {
        $("#image-container").html(
          `<img src="/static/${currentConstellation["back-photo"]}" alt="${currentConstellation.name}" class="img-fluid">`
        );
        $("#feedback-text").html(
          `<span class="incorrect">Incorrect! The correct answer is: ${currentConstellation.name}</span>`
        );
        $("#learn-text").html(
          `<span> ${currentConstellation.name} "${currentConstellation.nickname}" has the following feature(s): ${currentConstellation.feature}</span>`
        );
      }

      $("#score").text(`${response.score}/${response.total}`);

      if (response.complete) {
        $("#next-btn")
          .text("See Results")
          .on("click", function () {
            updateProgressBar(16);
            showResults(response.score, response.total);
          });
      } else {
        currentConstellation = response.next.constellation;
        currentName = response.next.name;
        updateProgressBar(response.next.current_index);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error submitting answer:", error);
    },
  });
}

function nextQuestion() {
  displayQuestion();
}

function showResults(score, total) {
  $("#image-container").hide();
  $("#answer-container").hide();
  $("#feedback-container").hide();

  let resultsHtml = `
    <h1 class="mb-4">Great job!</h1>
    <h2 class="mb-4">Your score: ${score}/${total}</h2>
    <div class="row justify-content-center mt-4">
      <div class="col-6">
        <button id="retake-btn" class="btn learn">Retake Quiz</button>
      </div>
      <div class="col-6">
        <button id="main-menu-btn" class="btn learn">Return to Main Menu</button>
      </div>
    </div>
  `;

  $("#quiz-container").html(resultsHtml);

  $("#retake-btn").on("click", function () {
    resetQuiz();
  });

  $("#main-menu-btn").on("click", function () {
    window.location.href = "/";
  });
}

function resetQuiz() {
  $.ajax({
    type: "POST",
    url: "/quiz/hard/reset",
    contentType: "application/json",
    success: function () {
      window.location.reload();
    },
    error: function (xhr, status, error) {
      console.error("Error resetting quiz:", error);
    },
  });
}
