let constellations = shuffledConstellations;
let currentIndex = 0;
let score = 0;


$(document).ready(function () {

    constellation = constellations[currentIndex]
    console.log(constellation)

    let nextButton = $("#next-btn");
    let optionButtons = $(".option");

    displayQuestion(constellation);

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

            window.location.href = "/quiz/finish";

        }

    });

});


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

    let scoreCard = $("#score");
    scoreCard.text(`${score}/${currentIndex}`);

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