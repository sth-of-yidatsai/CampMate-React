// modal create event
const modalCreate = document.querySelector(".modal-create");
const btnCreate = document.querySelector(".btn-create");
const close = document.querySelector(".close");
// to my-event-detail page
const btnMore = document.querySelectorAll(".btn-more");
// const btnMore = [...document.querySelectorAll(".btn-more")];

// tag filter
const tags = document.querySelectorAll(".tag");

// modal create event
btnCreate.addEventListener("click", event => {
	console.log("btn-create clicked!");
	modalCreate.classList.remove("d-none");
	btnCreate.setAttribute("aria-expanded", "true");
});
// close modal join event
close.addEventListener("click", event => {
	console.log("close clicked!");
	modalCreate.classList.add("d-none");
	btnCreate.setAttribute("aria-expanded", "false");
});
// close modal join event
window.addEventListener("click", event => {
	if (event.target == modalCreate) {
		console.log("window clicked!");
		modalCreate.classList.add("d-none");
		btnCreate.setAttribute("aria-expanded", "false");
	}
});

// to my-event-detail page
btnMore.forEach(button => {
	button.addEventListener("click", () => {
		console.log("btn-more clicked!");
		window.location.href = "/group-camping/my-event-detail/my-event-detail.html";
	});
});
// btnMore.map(button => {
// 	button.addEventListener("click", event => {
// 		window.location.href = "/group-camping/my-event-detail/my-event-detail.html";
// 		return;
// 	});
// });

// tag filter
// tag的點擊處理函數
function handleTagClick(event) {
	// 移除所有tag的 active 樣式
	tags.forEach(tag => {
		tag.classList.remove("active");
	});
	// 為點擊的tag添加 active 樣式
	event.currentTarget.classList.add("active");
}

// 使用 forEach 綁定點擊事件
tags.forEach(tag => {
	tag.addEventListener("click", handleTagClick);
});
