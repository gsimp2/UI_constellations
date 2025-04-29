let time_entered = 0;
let time_left = 0;
let click_times = {};

function flip_card(constellation, index) {
	let flashcard = $("#flashcard-" + index);
	let name = constellation["name"];
	let back_photo = "/static/" + constellation["back-photo"];

	let newHtml = `
	<div class="learn revealed">
	  <img src="${back_photo}" class="img-fluid mb-2" alt="${name}">
	  <p class = "title">${name}</p>
	  <p class = "info">"${constellation.nickname}"</p>
	  <p><span class = "info">Key Feature:</span> ${constellation.feature}</p>
	  <p><span class = "info">Best Visibility:</span> ${constellation.visibility}</p>
	</div>
  `;

	flashcard.replaceWith(newHtml);
}

function save_learn_metadata() {
	let data_to_save = {
		"time_entered": time_entered,
		"time_left": time_left,
		"click_times": click_times,
	}
	console.log(data_to_save);
	$.ajax({
		type: "POST",
		url: "/save_learn/" + page,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data_to_save),
		success: function (result) {
			console.log(result)
			if (page != "4") {
				window.location.href = '/learn/' + (parseInt(page) + 1).toString();
			}
			else {
				window.location.href = '/quiz/start';
			}
		},
		error: function (request, status, error) {
			console.log("Error");
			console.log(request)
			console.log(status)
			console.log(error)
		}
	})
}

$(document).ready(function () {
	let buttons_clicked = 0;
	time_entered = $.now();
	$(".reveal-btn").click(function () {
		buttons_clicked += 1;
		let click_time = $.now();
		let index = $(this).data("index");
		let constellation = constellations[index];
		click_times[constellation["name"]] = click_time;
		flip_card(constellation, index)

		if (buttons_clicked == 4) {
			let btnname = "Next"
			if (page == "4") {
				btnname = "Finish"
			}
			let newBtn = `
		<button class="btn btn-primary mt-2 nextpage-btn" id="nextbtn">
				${btnname}
				</button>`;
			$('#nextpage').append(newBtn);
		}
	});
	$(document).on("click", "#nextbtn", function () {
		time_left = $.now();
		for (key in click_times) {
			click_times[key] = time_left - click_times[key];
		}
		save_learn_metadata();
	});
});