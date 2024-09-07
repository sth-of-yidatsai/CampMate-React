// modal join event
const modalJoin = document.querySelector(".modal-join");
const btnJoin = document.querySelector(".btn-join");
const close = document.querySelector(".close");
// to other pages
const toGround = document.querySelector(".to-ground");
// head to other section
const headToIntro = document.querySelector(".head-to-intro");
const headToLocation = document.querySelector(".head-to-location");
const sectionIntro = document.querySelector("#introduction");
const sectionLocation = document.querySelector("#location");

// modal join event
btnJoin.addEventListener("click", event => {
	console.log("btn-join clicked!");
	modalJoin.classList.remove("d-none");
	btnJoin.setAttribute("aria-expanded", "true");
});
// document.addEventListener("click", event => {
// 	if (event.target === btnJoin) {
// 		console.log("btn-join clicked!");
// 		modalJoin.classList.remove("d-none");
// 		btnJoin.setAttribute("aria-expanded", "true");
// 	}
// });

// close modal join event
close.addEventListener("click", event => {
	console.log("close clicked!");
	modalJoin.classList.add("d-none");
	btnJoin.setAttribute("aria-expanded", "false");
});
// close modal join event
window.addEventListener("click", event => {
	if (event.target == modalJoin) {
		console.log("window clicked!");
		modalJoin.classList.add("d-none");
		btnJoin.setAttribute("aria-expanded", "false");
	}
});

// to ground detail page
toGround.addEventListener("click", event => {
	console.log("btn-more clicked!");
	window.location.href = "/group-camping/fake-pages/fake-ground-detail.html";
});
// to introduction section
headToIntro.addEventListener("click", () => {
	sectionIntro.scrollIntoView({ behavior: "smooth" });
});
// to location section
headToLocation.addEventListener("click", () => {
	sectionLocation.scrollIntoView({ behavior: "smooth" });
});
