function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

var option = $("#optionShowUnusedHitDice")

var HitDices = $$(".currentHitDice");

function SetVisibility() {
	HitDices = $$(".currentHitDice");
	
	for(var i = 0; i < HitDices.length; i++) {
		if(HitDices[i].value != 0 || option.checked) {
			HitDices[i].parentElement.parentElement.style.display = "table-row";
		} else {
			HitDices[i].parentElement.parentElement.style.display = "none";
		}
	}
}

option.addEventListener("change", SetVisibility);
SetVisibility();

var conMods = $$(".SetModCon")

$("#conAb").addEventListener("change", function() {
	setTimeout(function() {
		var conMod = parseInt($("#conMod").firstChild.innerHTML);
		for(var i = 0; i < conMods.length; i++) {
			conMods[i].innerHTML = (conMod >= 0) ? `+${conMod}` : conMod;
		}
	},10);
});

body.addEventListener("change", function(e) {
	if(e.target.classList.contains("maxHitDice")) {
		e.target.parentNode.parentNode.firstElementChild.max = e.target.value;
	}
});