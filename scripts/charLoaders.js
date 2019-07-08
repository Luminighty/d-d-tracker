document.body.addEventListener("click", function(e) {
	if(e.target.classList.contains("removeChar")) {
		var tr = GetElementInParents(e.target, ".CharElement");
		if(tr == null) {
			console.log("error!");
			return;
		}
		DeleteChar(tr);
		return;
	}
	var tr = GetElementInParents(e.target, ".CharElement");
	if(tr != null) {
		LoadChar(tr);
		return;
	}
	if(e.target.classList.contains("charCreate")) {
		CreateChar(e.target);
	}
});

function CreateChar(e) {
	
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var clone = $(".CharElement").cloneNode(true);
			clone.querySelector(".Name").innerHTML = "Unknown";
			clone.querySelector("img").src = "data/" + getCookie("md5username") + "/images/" + this.response + ".img";
			clone.id = this.responseText;
			clone.removeAttribute("hidden");

			e.parentElement.parentElement.insertBefore(clone, e.parentElement);
		}
	}

	xmlhttp.open("POST", "php/save.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("x=NEW&user="+getCookie("md5username"));
	
}

function DeleteChar(e) {
	if(prompt("This will delete '" + e.querySelector(".Name").innerHTML.toUpperCase() + "' forever!\nType 'DELETE' if you want to continue.") == "DELETE") {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "php/delete.php", true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		xmlhttp.send("x=" + e.id + "&user="+getCookie("md5username"));
		e.remove();
	}
}

/**
 * Find a parent element that matches the selector
 * @param {Element} element main Element
 * @param {NodeSelector} selector the element to look for
 */
function GetElementInParents(element, selector) {
	if(element.matches(selector))
		return element;
	if(element.parentElement != null)
		return GetElementInParents(element.parentElement, selector);
	return null;
}

function LoadChar(e) {
	document.location.href = "http://luminight.web.elte.hu/d-d/character.html?id=" + e.id;
}

function preloadImage(url)
{
    var img=new Image();
    img.src=url;
}

var imgs = [
	"media/trashClosed.png",
	"media/trashOpen.png",
	"media/edit0.png",
	"media/edit1.png"
]

for(var i = 0; i < imgs.length; i++)
	preloadImage(imgs[i]);

function getCookie(cname) {
var name = cname + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for(var i = 0; i <ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0) == ' ') {
		c = c.substring(1);
	}
	if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	}
}

	return "";
}

function setCookie(cname, cvalue, exdays) {
var d = new Date();
d.setTime(d.getTime() + (exdays*24*60*60*1000));
var expires = "expires="+ d.toUTCString();
document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}