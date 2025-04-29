let constellations;

$(document).ready(function () {

    if (localStorage.getItem('quizState')) {

        let savedState = JSON.parse(localStorage.getItem('quizState'));
        constellations = savedState.constellations;
        currentIndex = savedState.currentIndex;
        score = savedState.score;

        if (currentIndex >= 16) {

            sendScoreAndFinish()

        }

    } else {

        constellations = shuffledConstellations;
        currentIndex = 0;
        score = 0;
        saveProgress();

    }

    let nextButton = $("#next-btn");
    let optionButtons = $(".option");

    displayQuestion();
    updateProgressBar();

    optionButtons.on("click", function () {

        checkAnswer(this);

    });

    nextButton.on("click", function () {

        feedback = $("#feedback-text")
        nextButton = $("#next-btn");

        feedback.empty();

        if (currentIndex < constellations.length - 1) {

            nextButton.prop("disabled", true);

            constellation = constellations[currentIndex];
            displayQuestion();

        } else if (currentIndex == constellations.length - 1) {

            nextButton.text("Finish");
            nextButton.prop("disabled", true);

            constellation = constellations[currentIndex];
            displayQuestion();

        } else {

            sendScoreAndFinish()

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

    constellation = constellations[currentIndex]
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

function checkAnswer(selectedOption) {

    constellation = constellations[currentIndex];
    constellationName = constellation["name"];

    disableOptions();
    next = $("#next-btn");
    next.prop("disabled", false);

    imageURLLeft = "/static/learnphotos/" + constellationName.replace(/\s/g, '') + "2.webp"
    imageURLRight = "/static/learnphotos/" + constellationName.replace(/\s/g, '') + ".jpeg"

    const image = $("#image-container");
    image.html(
        `<img src="${imageURLRight}" alt="${constellationName}"><img src="${imageURLLeft}" alt="${constellationName}">`
    );

    let selectedText = $(selectedOption).text();
    $("#next-btn").prop("disabled", false);
    currentIndex = currentIndex + 1;

    if (selectedText === constellation["name"]) {

        score = score + 1;
        $("#feedback-text").text("Correct! " + constellation["message"]).attr("class", "correct");

    } else {

        $("#feedback-text").text("Incorrect! The correct answer is " + constellationName + ". " + constellation["message"]).attr("class", "incorrect");

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
        body: JSON.stringify({
            score: score,
        })
    })
    .then(response => {
        if (response.ok) {
            localStorage.removeItem('quizState');
            window.location.href = '/quiz/finish'; // 👈 Redirect to the finish page
        } else {
            console.error('Failed to send score.');
        }
    })
    .catch(error => {
        console.error('Error sending score:', error);
    });
}

