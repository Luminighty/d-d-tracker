function $(selector) {
	return document.querySelector(selector);
}

function UpdateStats() {
	var dexMod = parseInt( $(`#dexMod`).children[0].innerHTML);
	var perMod = parseInt( $(`#perMod`).innerHTML.split(' ')[0]);
	$(`.passper`).innerHTML = (10 + perMod);
	$(`.ini`).innerHTML = (dexMod >= 0) ? `+${dexMod}` : dexMod;
	$(".hp").max = $(".maxhp").value
}
UpdateStats();
body.addEventListener("change", function(e) {
	UpdateStats();
});
