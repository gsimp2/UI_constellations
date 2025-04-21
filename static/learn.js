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

$(document).ready(function () {
	let buttons_clicked = 0;
	$(".reveal-btn").click(function () {
		buttons_clicked += 1;
		let index = $(this).data("index");
		let constellation = constellations[index];
		flip_card(constellation, index)

		if (buttons_clicked == 4) {
			let newBtn = `
		<button class="btn btn-primary mt-2 nextpage-btn" id="nextbtn">
					Next
				</button>`;
			$('#nextpage').append(newBtn);
		}
	});
	$(document).on("click", "#nextbtn", function () {
		window.location.href = '/learn/' + (parseInt(page) + 1).toString();
	});
});