function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}
var register = $("#register");
var login = $("#login");

document.body.addEventListener("click", function(e) {
	if(e.target.id == "toRegister") {
		login.style.display = "none";
		register.style.display = "block";
	}
	if(e.target.id == "toLogin") {
		register.style.display = "none";
		login.style.display = "block";
	}
});

var html = $("html")
window.addEventListener("resize", function(e) {
	if(window.innerWidth > 1950) {
		html.style.backgroundPosition = '0px 0px'; 
		html.style.backgroundSize = "cover";
	} else {
		html.style.backgroundSize = "initial";
	}
});

document.addEventListener("mousemove", function(e) {
	if(html.style.backgroundSize == "cover")
	return;
	var pos = {x: (window.innerWidth / 2) - e.clientX, y: (window.innerHeight / 2) - e.clientY};
	html.style.backgroundPosition = `${(-pos.x / 100) - 50}px ${(-pos.y / 100) - 100}px`; 
})