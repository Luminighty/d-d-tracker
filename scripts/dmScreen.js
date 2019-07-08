/**
 * Find the index in the element's parent's children and returns it
 * @param {Element} e Element to look for
 */
function FindElementIndex(e) {
	var children = e.parentElement.children;
	for(var i = 0; i < children.length; i++)
		if(children[i] == e)
			return i;
	return -1;
}

(function(){

var settings = {
	sessionChars: [],
	initiative: [],
	currentTurn: -1,
	monsters: [],
	notes: []
}


function GetTurn(e) {
	if(e == null || e.parentElement == null)
		return;
	settings.currentTurn = FindElementIndex(e);
}

window.addEventListener("click", function(e) {
	var p = GetElementInParents(e.target, ".modal-content");
	if (p == null && !e.target.id.startsWith("modalOpen_")) {
		OnSessionCharPickCancel()
	}
	if(e.target.classList.contains("sessionCharOk")) {
		OnSessionCharPickOk();
		return;
	}

	if(e.target.classList.contains("sessionCharCancel"))
		OnSessionCharPickCancel();

	if(e.target.matches(".iniChar")) {
		GetTurn(e.target);
		SaveSettings();
	}
	if(GetElementInParents(e.target, ".PerceptionList") != null)
		OpenSessionCharSheet(GetElementInParents(e.target, ".listElement").dataset["charid"]);
});


//
//	Session Character Picker
//

function OpenSessionCharSheet(id) {
	id = id.split("/");
	window.open(`character.html?id=${id[1]}&user=${id[0]}`);
}

function SaveSettings() {
	xmlhttp = new XMLHttpRequest();
	var json = JSON.stringify(settings);
	while(json.includes("+"))
		json = json.replace("+", "LUMICODEPLUS");
	while(json.includes("&"))
		json = json.replace("&", "LUMICODEAND");
	xmlhttp.open("POST", "php/dmScreen/saveSession.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("x=" + json);
}

var sessionlist = $("#sessionCharModalList");
var sessionModal = $("#sessionCharModal");

function OnSessionCharPickOk() {
	settings.sessionChars = [];

	var selected = sessionlist.querySelectorAll(".listElement.active")
	for(var i = 0; i < selected.length; i++)
			settings.sessionChars.push(selected[i].dataset["charid"]);

		//save
	SaveSettings();
	location.reload();
}

function OnSessionCharPickCancel() {
	var list = sessionlist.querySelectorAll(".listElement")
	for(var i = 0; i < list.length; i++)
		if(settings.sessionChars.includes(list[i].dataset["charid"])) {
			list[i].classList.add("active");
		} else {
			list[i].classList.remove("active");
		}
	sessionModal.style.display = "none";
}


//  
//  Initiatives
//  

var iniPickedHolder = $(".iniPickedHolder");
var iniPickHolder = $(".iniPickHolder");
var iniList = $("#InitiativeList");

$("#iniNpcPickInput").addEventListener("focus", function(e) {
	if($("#iniNpcPick").classList.contains("active"))
		return;
	var active = e.target.parentElement.parentElement.querySelector(".active.listElement.selectable");
	if(active != null)
		active.classList.remove("active");
	e.target.parentElement.classList.add("active");
});
$("#iniNpcPickInput").addEventListener("keyup", function(e) {
	event.preventDefault();
	if (event.keyCode === 13)
		$("#iniPickAddOne").click();
});

$("#iniPickAddAll").addEventListener("click", function(e) {
	var chars = iniPickHolder.querySelectorAll(".iniChar:not(#iniNpcPick)");

	for(var i = 0; i < chars.length; i++)
		MoveToIniPicked(chars[i]);
	
	$("#iniNpcPick").classList.add("active");

});
$("#iniPickAddOne").addEventListener("click", function(e) {
	var active = iniPickHolder.querySelector(".active");
	if(active == null)
		return;
	
	if(active.id != "iniNpcPick") {
		MoveToIniPicked(active);
	} else {
		var input = $("#iniNpcPickInput");
		if(input.value == "")  {
			alert("Name can't be empty!")
			return;
		}
		var div = document.createElement("div");
		div.classList.add("listElement", "draggable", "selectable", "iniChar", "customChar");
		div.dataset["charid"] = "npc" + Date.now();
		div.innerHTML = input.value;
		input.value = "";
		input.focus();
		iniPickedHolder.appendChild(div);

	}

});
$("#iniPickRemoveOne").addEventListener("click", function(e) {
	var active = iniPickedHolder.querySelector(".active");
	if(active == null)
		return;
	MoveToIniPick(active);
});
$("#iniPickRemoveAll").addEventListener("click", function(e) {
	var chars = iniPickedHolder.querySelectorAll(".iniChar:not(#iniNpcPick)");

	for(var i = 0; i < chars.length; i++)
		MoveToIniPick(chars[i]);
	

});

$(".initiativeOk").addEventListener("click", function(e) {
	iniList.innerHTML = "";
	settings.initiative = [];
	var children = iniPickedHolder.children;
	for(var i = 0;i < children.length; i++) {
		var div = document.createElement("div");
		div.classList.add("listElement", "selectable", "iniChar");
		div.innerHTML = children[i].innerHTML;
		if(children[i].classList.contains("customChar")) {
			settings.initiative[i] = "customChar_" + children[i].innerHTML;
		} else {
			settings.initiative[i] = children[i].dataset.charid;
		}
		iniList.appendChild(div);
	}
	if(iniList.children[0] != null)
		iniList.children[0].classList.add("active")
	SaveSettings();
});

{
	//Load data
	GetTurn($(".iniChar.active"))
	var selected = sessionlist.querySelectorAll(".listElement.active")
	for(var i = 0; i < selected.length; i++)
			settings.sessionChars.push(selected[i].dataset["charid"]);

	var children = iniPickedHolder.children;
	for(var i = 0;i < children.length; i++)
		if(children[i].classList.contains("customChar")) {
			settings.initiative[i] = "customChar_" + children[i].innerHTML;
		} else {
			settings.initiative[i] = children[i].dataset.charid;
		}

}

function MoveToIniPicked(e) {
	if(e.nextElementSibling != null && e.nextElementSibling.id != "iniNpcPick") {
		e.nextElementSibling.classList.add("active");
	} else if(e.previousElementSibling != null) {
		e.previousElementSibling.classList.add("active");
	} else {
		e.nextElementSibling.classList.add("active");
	}
	iniPickedHolder.appendChild(e);
	e.classList.remove("active");
	e.classList.add("draggable");
}
function MoveToIniPick(e) {
	if(e.nextElementSibling != null) {
		e.nextElementSibling.classList.add("active");
	} else if(e.previousElementSibling != null) {
		e.previousElementSibling.classList.add("active");
	}
	if(e.classList.contains("customChar")) {
		e.remove();
		return;
	}
	iniPickHolder.insertBefore(e, iniPickHolder.lastElementChild);
	e.classList.remove("active");
	e.classList.remove("draggable");
}

})();
