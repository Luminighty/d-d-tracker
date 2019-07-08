function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

const body = document.body;

var offsetX = 0;
var offsetY = 0;

var selectedElement = null;
var Containers = $$(".Container");

for(var i = 0; i < Containers.length; i++) {
	Containers[i].style.zIndex = i+1;
}

function GetParent(e) {
	if(e.parentElement == null)
		return null;
	if(e.parentElement.classList.contains("Container"))
		return e.parentElement;
	return GetParent(e.parentElement);
}

document.addEventListener("mousedown", function(e) {
	const parent = GetParent(e.target);
	if(parent == null)
		return;

	var currentIndex = parseInt(parent.style.zIndex);

	for(var i = 0; i < Containers.length; i++)
		if(parseInt(Containers[i].style.zIndex) > currentIndex)
			Containers[i].style.zIndex = Containers[i].style.zIndex - 1;
	parent.style.zIndex = Containers.length;

	if(e.target.tagName == "H2") {
		e.preventDefault();
		Containers = $$(".Container");

		if(parent.getElementsByClassName("pin")[0] != null && parent.getElementsByClassName("pin")[0].checked)
			return;


		offsetX = e.offsetX;
		offsetY = e.offsetY;
		selectedElement = parent;

	}
});

var LockMovement = false;

var snap  = $("#snapInput")

document.addEventListener("mousemove", function(e) {
	if(selectedElement != null && !LockMovement) {
		e.preventDefault();
		selectedElement.style.position = "absolute";
		var s = snap.value;
		var posX = e.pageX - offsetX - 10;
		var posY = e.pageY - offsetY - 10;
		posX -= posX % s - (s/2);
		posY -= posY % s - (s/2);
		selectedElement.style.left = `${(posX - 10 > 0) ? posX : 0}px`;
		selectedElement.style.top = `${(posY > 0) ? posY : 0}px`;
	}
});


window.addEventListener("mouseup", function(e) {
	if(selectedElement != null) {
		console.log(selectedElement.id + " " + selectedElement.style.left + " " + selectedElement.style.top);
		selectedElement = null;
	}
});