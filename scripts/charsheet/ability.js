function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

var abilities = $$(".ability");

body.addEventListener("change", function(e) {
	if(e.target.classList.contains("ability")) {
		const mod = (e.target.value - 10) / 2;
		e.target.nextElementSibling.firstChild.innerHTML = `${(mod >= 0) ? ("+" + Math.trunc(mod)) : Math.floor(mod) }`;
	}
});
