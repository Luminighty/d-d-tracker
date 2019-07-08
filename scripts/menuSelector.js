function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

var contents = $$(".content");

document.body.addEventListener("click", function(e) {
	if(e.target.id.startsWith("Menu_")) {
		e.preventDefault()
		for(var i = 0; i < contents.length; i++) {
			contents[i].style.display = "none";
		}
		var str = e.target.id.replace("Menu_", "");
		$("#" + str).style.display = "block";
		$(".active").classList.remove("active");
		e.target.classList.add("active");
		setCookie("selected", str, 7);
	}

});

var consoleElement = $("#console");

function Log(message) {
	consoleElement.innerHTML += "<br>" + message;
}