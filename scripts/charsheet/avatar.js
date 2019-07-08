function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

img = $("#avatarImg");

$("#avatarButton").addEventListener("change", function(e) {
	var button = e.target;
	var file = button.files[0];

	if(file == null)
		return;

	if(!file.type.startsWith("image/"))
		return;
	console.log(player.id);
	var reader = new FileReader();
	reader.onload = (function(aImg) { return function(e) {

		var img = new Image;
		img.onload = function() {
			if(img.width > 750 || img.height > 750) {
				alert("Maximum image size is 750x750 px");
				return;
			}
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					aImg.src = this.responseText + "?t=" + new Date().getTime();
				}
			};
			var formData = new FormData();
			console.log(player.id);
			formData.append("id", player.id);
			formData.append("img", file, file.name);
			xmlhttp.open("POST", "php/uploadavatar.php", true);
			xmlhttp.send(formData);

		}
		img.src = reader.result;


		
	};})(img);
	reader.readAsDataURL(file);
});
{
var container = $("#PictureContainer");

container.children[0].addEventListener("change", function(e) {
	if(e.target.checked) {
		container.style.resize = "none";
		img.parentElement.htmlFor = "";
	} else {
		container.style.resize = "both";
		img.parentElement.htmlFor = "avatarButton";
	}
});

}