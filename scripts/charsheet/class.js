function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

var classPrefab = $("#ClassPrefab");
var classLevelInput = $("#ClassLevelInput");
var classNameInput = $("#ClassNameInput");


document.addEventListener("click", function(e) {
	if(e.target.classList.contains("RemoveLevel")) {
		RemoveLevel(e.target);
		return;
	}
	if(e.target.classList.contains("AddLevel")) {
		AddLevel(e.target);
	}
});

function RemoveLevel(e) {
	e.parentNode.parentNode.remove();
}

function AddLevel(e) {
	if(classNameInput.value == "") {
		alert("Must specify a classname!");
		return;
	}
	var ini = classPrefab.cloneNode(true);
	ini.id = "";
	ini.querySelector(".ClassName").innerHTML = classNameInput.value;
	ini.querySelector(".AddedClassLevelInput").value = classLevelInput.value;
	classLevelInput.value = "";
	classNameInput.value = "";
	e.parentNode.parentNode.parentNode.insertBefore(ini, e.parentNode.parentNode);
}