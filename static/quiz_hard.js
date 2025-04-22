let constellations = initConstellationsData;
let constellationList = [];
let currentIndex = 0;
let score = 0;
let totalQuestions = 0;
let hasAnswered = false;

$(document).ready(function () {
  for (const name in constellations) {
    constellationList.push({
      name: name,
      ...constellations[name],
    });
  }

  displayQuestion();

  $("#answer-input").on("keypress", function (event) {
    if (event.which === 13 && !hasAnswered) {
      checkAnswer();
      event.preventDefault();
    }
  });

  $("#submit-btn").on("click", checkAnswer);

  $("#next-btn").on("click", nextQuestion);
});

function displayQuestion() {
  const currentConstellation = constellationList[currentIndex];

  hasAnswered = false;
  $("#feedback-text").empty();

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

  const currentConstellation = constellationList[currentIndex];
  const userAnswer = $("#answer-input").val().trim();

  $("#answer-input").prop("disabled", true);
  $("#submit-btn").prop("disabled", true);
  $("#next-btn").prop("disabled", false);

  totalQuestions++;

  const isCorrect =
    userAnswer.toLowerCase() === currentConstellation.name.toLowerCase();
  if (isCorrect) {
    score++;
  }

  if (isCorrect) {
    $("#feedback-text").html(`<span class="correct">Correct!</span>`);
  } else {
    $("#feedback-text").html(
      `<span class="incorrect">Incorrect! The correct answer is: ${currentConstellation.name}</span>`
    );
  }
  $("#score").text(`${score}/${totalQuestions}`);
}

function nextQuestion() {
  currentIndex++;

  const end = 2;
  if (currentIndex >= end) {
    showResults();
  }

  if (currentIndex >= constellationList.length) {
    showResults();
  }

  displayQuestion();
}

function showResults() {
  $("#image-container").hide();
  $("#answer-container").hide();
  $("#feedback-container").hide();

  let resultsHtml = `
    <h1 class="mb-4">Great job!</h1>
    <h2 class="mb-4">Your score: ${score}/${totalQuestions}</h2>
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
  window.location.reload();
}
