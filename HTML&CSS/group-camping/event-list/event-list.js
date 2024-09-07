// modal create event
const modalCreate = document.querySelector(".modal-create");
const btnCreate = document.querySelector(".btn-create");
const close = document.querySelector(".close");
// to event-detail page
const btnMore = document.querySelectorAll(".btn-more");
// to event-list
const headToList = document.querySelector(".head-to-list");
const sectionEventList = document.querySelector("#event-list");

// modal create event
btnCreate.addEventListener("click", event => {
	console.log("btn-create clicked! open modal.");
	modalCreate.classList.remove("d-none");
	btnCreate.setAttribute("aria-expanded", "true");
});
// close modal create event
close.addEventListener("click", event => {
	console.log("close clicked! close modal.");
	modalCreate.classList.add("d-none");
	btnCreate.setAttribute("aria-expanded", "false");
});
// close modal create event
window.addEventListener("click", event => {
	if (event.target == modalCreate) {
		console.log("window clicked! close modal.");
		modalCreate.classList.add("d-none");
		btnCreate.setAttribute("aria-expanded", "false");
	}
});

// to event-detail page
btnMore.forEach(button => {
	button.addEventListener("click", event => {
		console.log("btn-more clicked! go to page: event-detail.");
		window.location.href = "/group-camping/event-detail/event-detail.html";
	});
});

// to event-list section
headToList.addEventListener("click", event => {
	console.log("head-to-list clicked! head to section: event-list");
	sectionEventList.scrollIntoView({ behavior: "smooth" });
});
