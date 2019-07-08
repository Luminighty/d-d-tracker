function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

var XpGainPrefab = $("#XpGainPrefab");
var XpEventInput = $("#XpEventInput");
var AddXpInput = $("#AddXpInput");
var XpValue = $("#XpValue");

document.addEventListener("click", function(e) {
	if(e.target.classList.contains("RemoveXp")) {
		RemoveXp(e.target);
		return;
	}
	if(e.target.classList.contains("AddXp")) {
		AddXp(e.target);
	}
});

function RemoveXp(e) {
	xp -= parseInt(e.parentNode.parentNode.querySelector(".XpValue").innerHTML);
	XpValue.innerHTML = `Experience ${xp}xp`;
	e.parentNode.parentNode.remove();
}

function AddXp(e) {
	if(AddXpInput.value == "")
		return;
	var ini = XpGainPrefab.cloneNode(true);
	ini.id = "";
	ini.querySelector(".XpEvent").innerHTML = XpEventInput.value;
	ini.querySelector(".XpValue").innerHTML = AddXpInput.value;
	xp += parseInt(AddXpInput.value)
	XpValue.innerHTML = `Experience ${xp}xp`;
	XpEventInput.value = "";
	AddXpInput.value = "";
	e.parentNode.parentNode.parentNode.insertBefore(ini, e.parentNode.parentNode.parentNode.children[2]);
}

var xp = 0;	
var xpRows = $$(".XpRow");
for(var i = 0; i < xpRows.length; i++) {
	if(xpRows[i].id != "XpGainPrefab")
	xp += parseInt(xpRows[i].querySelector(".XpValue").innerHTML);
}
XpValue.innerHTML = `Experience ${xp}xp`;