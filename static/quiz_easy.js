let constellations = shuffledConstellations;
let currentIndex = 0;
let score = 0;

$(document).ready(function () {

    if (localStorage.getItem('quizState')) {

        let savedState = JSON.parse(localStorage.getItem('quizState'));
        constellations = savedState.constellations;
        currentIndex = savedState.currentIndex;
        score = savedState.score;

    } else {

        constellations = shuffledConstellations;
        currentIndex = 0;
        score = 0;
        saveProgress();

    }

    $("#score").text(`Score: ${score}/${currentIndex}`);

    constellation = constellations[currentIndex]
    console.log(constellation)

    let nextButton = $("#next-btn");
    let optionButtons = $(".option");

    displayQuestion(constellation);
    updateProgressBar();

    optionButtons.on("click", function () {

        checkAnswer(this, constellation);

    });

    nextButton.on("click", function () {

        feedback = $("#feedback-text")
        nextButton = $("#next-btn");

        feedback.empty();

        if (currentIndex < constellations.length - 1) {

            nextButton.prop("disabled", true);

            constellation = constellations[currentIndex];
            displayQuestion(constellation);

        } else if (currentIndex == constellations.length - 1) {

            nextButton.text("Finish");
            nextButton.prop("disabled", true);

            constellation = constellations[currentIndex];
            displayQuestion(constellation);

        } else {

            localStorage.removeItem('quizState');
            window.location.href = "/quiz/finish";

        }

    });

});

function saveProgress() {

    localStorage.setItem('quizState', JSON.stringify({

        constellations: constellations,
        currentIndex: currentIndex,
        score: score

    }));

}

function displayQuestion(constellation) {

    constellationOptions = constellation["options"];
    constellationName = constellation["name"];

    enableOptions();

    imageURL = "/static/learnphotos/" + constellationName.replace(/\s/g, '') + "2.webp"

    const image = $("#image-container")
    image.html(
        `<img src="${imageURL}" alt="${constellationName}" class="img-fluid">`
    );

    for (let i = 0; i < constellationOptions.length; i++) {

        option = constellationOptions[i]
        optionButton = $(`#${i}`)
        optionButton.text(option)

    }
      
}

function checkAnswer(selectedOption, constellation) {

    disableOptions();
    next = $("#next-btn");
    next.prop("disabled", false);

    let selectedText = $(selectedOption).text();
    $("#next-btn").prop("disabled", false);
    currentIndex = currentIndex + 1;

    if (selectedText === constellation["name"]) {

        score = score + 1;
        $("#feedback-text").text("Correct!").css("color", "green");

    } else {

        $("#feedback-text").html(
          `<span class="incorrect">Incorrect! The correct answer is: ${constellation.name}</span>`
        );

    }

    saveProgress();

    updateProgressBar();
    $("#score").text(`Score: ${score}/${currentIndex}`);

}

function disableOptions() {

    options = [0, 1, 2, 3];

    for (let i = 0; i < options.length; i++) {

        optionButton = $(`#${i}`);
        optionButton.prop("disabled", true);

    }

}

function enableOptions() {

    options = [0, 1, 2, 3];

    for (let i = 0; i < options.length; i++) {

        optionButton = $(`#${i}`);
        optionButton.prop("disabled", false);

    }

}

function updateProgressBar() {
    let totalSteps = constellations.length;
    let rects = $(".progress-rect");

    rects.removeClass("filled");  // clear all

    for (let i = 0; i < currentIndex; i++) {
        $(rects[i]).addClass("filled");  // fill up to currentIndex
    }
}