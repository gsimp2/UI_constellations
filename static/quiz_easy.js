let constellations;
let selectedOption = null;

$(document).ready(function () {

    // localStorage.removeItem('quizState');

    if (localStorage.getItem('quizState')) {

        let savedState = JSON.parse(localStorage.getItem('quizState'));
        constellations = savedState.constellations;
        currentIndex = savedState.currentIndex;
        score = savedState.score;
        // numFinishes = savedState.numFinishes;

        if (currentIndex >= 8) {
            sendScoreAndFinish();
        }

    } else {

        constellations = shuffledConstellations;
        currentIndex = 0;
        score = 0;
        // numFinishes = 0;
        saveProgress();

    }

    let nextButton = $("#next-btn");
    let optionButtons = $(".option");
    let submitButton = $("#submit-btn");

    nextButton.css("display", "none");

    displayQuestion();
    updateProgressBar();

    optionButtons.on("click", function () {
        selectedOption = this;

        $(".option").removeClass("selected");
        $(this).addClass("selected");

        submitButton.prop("disabled", false);
    });

    submitButton.on("click", function () {
        if (selectedOption !== null) {
            checkAnswer(selectedOption);
            selectedOption = null;
            submitButton.prop("disabled", true);
            submitButton.css("display", "none");
        }
    });

    nextButton.on("click", function () {
        $("#feedback-text").empty();
        $("#next-btn").css("display", "none");
        $("#submit-btn").css("display", "inline-block");
        $("#next-btn").prop("disabled", true);

        if (currentIndex < constellations.length - 1) {
            displayQuestion();
        } else if (currentIndex === constellations.length - 1) {
            $("#next-btn").text("Finish");
            displayQuestion();
        } else {
            sendScoreAndFinish();
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

function displayQuestion() {
    let constellation = constellations[currentIndex];
    let constellationOptions = constellation["options"];
    let constellationName = constellation["name"];

    enableOptions();
    $("#submit-btn").prop("disabled", true);
    $(".option").removeClass("selected");

    let imageURL = "/static/learnphotos/" + constellationName.replace(/\s/g, '') + "2.webp";
    $("#image-container").html(`<img src="${imageURL}" alt="${constellationName}" class="img-fluid">`);

    for (let i = 0; i < constellationOptions.length; i++) {
        let option = constellationOptions[i];
        let optionButton = $(`#${i}`);
        optionButton.text(option);
    }
}

function checkAnswer(selectedOption) {
    let constellation = constellations[currentIndex];
    let constellationName = constellation["name"];
    disableOptions();
    $("#next-btn").css("display", "inline-block");
    $("#next-btn").prop("disabled", false);

    let imageURLLeft = "/static/learnphotos/" + constellationName.replace(/\s/g, '') + "2.webp";
    let imageURLRight = "/static/learnphotos/" + constellationName.replace(/\s/g, '') + ".jpeg";

    $("#image-container").html(
        `<img src="${imageURLRight}" alt="${constellationName}"><img src="${imageURLLeft}" alt="${constellationName}">`
    );

    let selectedText = $(selectedOption).text();
    currentIndex += 1;

    if (selectedText === constellation["name"]) {
        score += 1;
        $("#feedback-text").text("Correct! " + constellation["message"]).attr("class", "correct");
    } else {
        $("#feedback-text").text("Incorrect! The correct answer is " + constellationName + ". " + constellation["message"]).attr("class", "incorrect");
    }

    saveProgress();
    updateProgressBar();
    $("#score").text(`Score: ${score}/${currentIndex}`);
}

function disableOptions() {
    [0, 1, 2, 3].forEach(i => {
        $(`#${i}`).prop("disabled", true);
    });
}

function enableOptions() {
    [0, 1, 2, 3].forEach(i => {
        $(`#${i}`).prop("disabled", false);
    });
}

function updateProgressBar() {
    let rects = $(".progress-rect");
    rects.removeClass("filled");
    for (let i = 0; i < currentIndex; i++) {
        $(rects[i]).addClass("filled");
    }
}

function sendScoreAndFinish() {
    fetch('/quiz/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: score, round: round })
    })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('quizState');
                // if (numFinishes) {
                //     localStorage.removeItem('quizState');
                // } else {
                //     localStorage.setItem('quizState', JSON.stringify({
                //         constellations: shuffledConstellations,
                //         currentIndex: 0,
                //         score: 0,
                //         numFinishes: 1
                //     }));
                // }
                window.location.href = '/quiz/finish/' + round;
            } else {
                console.error('Failed to send score.');
            }
        })
        .catch(error => {
            console.error('Error sending score:', error);
        });
}
