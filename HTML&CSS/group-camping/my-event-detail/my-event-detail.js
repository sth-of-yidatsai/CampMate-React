// modal create event
const modalCancel = document.querySelector(".modal-cancel");
const modalCard = document.querySelector(".modal-content");
const btnCancel = document.querySelector(".btn-cancel");
const btnCancelYes = document.querySelector(".btn-cancel-yes");
const btnCancelNo = document.querySelector(".btn-cancel-no");
const close = document.querySelector(".close");

// 綁定事件
btnCancel.addEventListener("click", openModal);
close.addEventListener("click", closeModal);
window.addEventListener("click", event => {
	if (event.target === modalCancel && !modalCard.contains(event.target)) {
		closeModal();
	}
});
btnCancelNo.addEventListener("click", closeModal);

// 點擊「退出」按鈕時進行其他操作
cancelYes.addEventListener("click", () => {
	// 執行退出操作
	closeModalWindow(); // 執行後關閉modal
});

// 打開modal
function openModal() {
	modalCancel.classList.add("show");
	btnCancel.setAttribute("aria-expanded", "true");
}
// 關閉modal
function closeModal() {
	modalCancel.classList.remove("show");
	btnCancel.setAttribute("aria-expanded", "false");
}
