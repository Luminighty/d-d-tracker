function GetElementInParents(element, selector) {
	if(element.matches(selector))
		return element;
	if(element.parentElement != null)
		return GetElementInParents(element.parentElement, selector);
	return null;
}


$("#set_Name").addEventListener("click", function(e) {
	e.preventDefault();
	var input = prompt("Enter the name of the NPC", npc.name);
	if(input != null)
		npc.name = input;
});

$("#set_Visibility").addEventListener("click", function(e) {
	e.preventDefault();
	npc.hidden = !npc.hidden;
	e.target.innerHTML = (npc.hidden) ? "Show NPC" : "Hide NPC";
});

$("#change_Mode").addEventListener("click", function(e) {
	e.preventDefault();
	deleteElements = !deleteElements;
	if(deleteElements) {
		document.documentElement.classList.add("DeleteCursor");
	} else {
		document.documentElement.classList.remove("DeleteCursor");
	}
	e.target.innerHTML = (deleteElements) ? "Delete Mode" : "Move Mode";
});

$("#set_Description").addEventListener("click", function(e) {
	e.preventDefault();
	var input = prompt("Enter the description of the NPC (Shown on the NPC list)", npc.description);
	if(input != null)
	npc.description = input;
});

$("#add_list").addEventListener("click", function(e) {
	e.preventDefault();
	AddElement(listPrefab, document.body);
});

$("#add_txtbox").addEventListener("click", function(e) {
	e.preventDefault();
	AddElement(textAreaPrefab, document.body);
});

$("#add_img").addEventListener("click", function(e) {
	e.preventDefault();
	var img = AddElement(imagePrefab, document.body);
	img.querySelector("input[type='file']").addEventListener("change", ChangeImage);
	var id = Date.now() + "_image";
	img.querySelector("label").htmlFor = id
	img.querySelector("input[type='file']").id = id;
});

function AddElement(element, parent) {
	var i = element.cloneNode(true);
	i.id = "";
	i.style.top = "150px";
	i.style.left = "150px";
	i.removeAttribute("hidden");
	parent.appendChild(i);

	return i;

}

$("#show_Preview").addEventListener("click", function(e) {
	e.preventDefault();

	showPreview = !showPreview;

	/*
	if(EditTitles && showPreview) {
		$("#editTitles").click();
	}*/


	e.target.innerHTML = (showPreview) ? "Hide Preview" : "Show Preview";

	var containers = $$(".Container");
	for(var i = 0; i < containers.length; i++) {
		if(showPreview) {
			if(!containers[i].querySelector(".show").checked)
				containers[i].setAttribute("hidden", true);
		} else {
			if(containers[i].id.includes("Prefab"))
				continue;
			containers[i].removeAttribute("hidden");
		}
	}

	if(showPreview) {
		var textAreas = $$("textarea");
		var inputs = $$('input[type="text"]');
		var files = $$('input[type="file"]');
		var buttons = $$('.AddButton');

		for(var i = 0; i < textAreas.length; i++) {
			var div = document.createElement("div");
			div.innerHTML = textAreas[i].value;
			div.classList.add("textAreaDiv");
			div.style.width = textAreas[i].style.width;
			div.style.height = textAreas[i].style.height;
			textAreas[i].parentElement.appendChild(div);
			textAreas[i].remove();
		}
		for(var i = 0; i < inputs.length; i++) {
			if(inputs[i].classList.contains("titleInput"))
				continue;

			var div = document.createElement("div");
			div.innerHTML = inputs[i].value;
			div.classList.add("inputDiv");
			if(inputs[i].classList.contains("list_Title"))
				div.classList.add("list_Title");
			if(inputs[i].classList.contains("list_Value"))
				div.classList.add("list_Value");

			var holder = GetElementInParents(inputs[i], ".list_Holder");
			if(holder != null)
				holder.style.resize = "none";

			inputs[i].parentElement.appendChild(div);
			inputs[i].remove();
			
		}
		for(var i = 0; i < files.length; i++) {
			files[i].id = files[i].id + "Preview";
			var holder = GetElementInParents(files[i], ".ImageContainer");
			if(holder != null)
				holder.style.resize = "none";
		}
		for(var i = 0; i < buttons.length; i++) {
			buttons[i].style.display = "none";
		}

	} else {

		var textAreas = $$(".textAreaDiv");
		var inputs = $$('.inputDiv');
		var files = $$('input[type="file"]');
		var buttons = $$('.AddButton');

		for(var i = 0; i < textAreas.length; i++) {

			var div = document.createElement("textarea");
			div.value = textAreas[i].innerHTML;
			div.classList.add("textAreaDiv");
			div.style.width = textAreas[i].style.width;
			div.style.height = textAreas[i].style.height;
			textAreas[i].parentElement.appendChild(div);
			textAreas[i].remove();

		}
		for(var i = 0; i < inputs.length; i++) {
			var div = document.createElement("input");
			div.setAttribute("type", "text");
			div.innerHTML = inputs[i].value;
			div.classList.add("inputDiv");

			if(inputs[i].classList.contains("list_Title"))
				div.classList.add("list_Title");
			if(inputs[i].classList.contains("list_Value"))
				div.classList.add("list_Value");
			div.value = inputs[i].innerHTML;

			var holder = GetElementInParents(inputs[i], ".list_Holder");
			if(holder != null)
				holder.style.resize = "horizontal";

			inputs[i].parentElement.appendChild(div);
			inputs[i].remove();
			
		}
		for(var i = 0; i < files.length; i++) {
			files[i].id = files[i].id.replace("Preview", "");
			var holder = GetElementInParents(files[i], ".ImageContainer");
			if(holder != null)
				holder.style.resize = "both";
			
		}
		for(var i = 0; i < buttons.length; i++) {
			buttons[i].style.display = "inline-block";
		}

	}

});

$("#editTitles").addEventListener("click", function(e) {
	e.preventDefault();
	if(showPreview) {
		$("#show_Preview").click();
	}
	EditTitles = !EditTitles;
	e.target.style.fontWeight = (EditTitles) ? "bold" : "normal";

	var titles = $$(".titleHolder");
	for(var i = 0; i < titles.length; i++) {
		if(EditTitles) {
			titles[i].innerHTML = titles[i].firstChild.value;
		} else {
			var input = document.createElement("input");
			input.value = titles[i].innerHTML;
			input.setAttribute("class", "titleInput");
			input.setAttribute("type", "text");
			titles[i].innerHTML = "";
			titles[i].appendChild(input);
		}
	}

});

body.addEventListener("click", function(e) {
	console.log(e);
	if(deleteElements) {
		console.log(e.target);
		var list = GetElementInParents(e.target, ".list_Element");
		if(list != null) {
			var title = (list.querySelector(".list_Title").value == null) ?  list.querySelector(".list_Title").innerHTML : list.querySelector(".list_Title").value;
			var value = (list.querySelector(".list_Value").value == null) ?  list.querySelector(".list_Value").innerHTML : list.querySelector(".list_Value").value;
			if(confirm(`Are you sure you want to delete this LIST ELEMENT? (${title} - ${value})`)) {
				list.remove();
			}
			return;
		}

		var container = GetElementInParents(e.target, ".Container");
		if(container != null) {

			var title = (EditTitles) ? container.querySelector(".titleHolder").innerHTML : container.querySelector(".titleInput").value;

			if(confirm(`Are you sure you want to delete ${title.toUpperCase()}`)) {
				container.remove();
			}
		}
		return;
	}

	if(e.target.classList.contains("newLine")) {
		NewListElement(e.target);
		return;
	}

});

body.addEventListener("change", function(e) {
	if(e.target.classList.contains("imageLabel") || e.target.id == "avatar") {
		ChangeImage(e);
	}
});

function ChangeImage(e) {
	var button = e.target;
	var file = button.files[0];

	if(file == null)
		return;

	if(!file.type.startsWith("image/"))
		return;
	var reader = new FileReader();
	reader.onload = (function(aImg) { return function() {

		var img = new Image;
		img.onload = function() {
			if(img.width > 750 || img.height > 750) {
				alert("Maximum image size is 750x750 px");
				return;
			}

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					console.log(this.responseText);
					if(aImg != null)
					aImg.src = this.responseText.replace("../", "").replace("../", "") + "?t=" + new Date().getTime();
					
					setTimeout(save(), 500);
				}
			};
			var formData = new FormData();
			formData.append("id", npc.id);
			console.log(e.target.id.replace("_image", ""));
			formData.append("imgId", e.target.id.replace("_image", ""));
			console.log(e.target);
			formData.append("img", file, file.name);
			xmlhttp.open("POST", "php/npc/uploadavatar.php", true);
			xmlhttp.send(formData);

		};
		img.src = reader.result;

		
	};})(e.target.parentElement.querySelector(".image"));
	reader.readAsDataURL(file);
}




function NewListElement(e) {
	var tr = GetElementInParents(e, "tr");
	var prefab = $(".list_Element").cloneNode(true);
	prefab.querySelector(".list_Title").value = "";
	prefab.querySelector(".list_Value").value = "";

	tr.parentElement.insertBefore(prefab,tr);

}

var EditTitles = false;
var showPreview = false;
var deleteElements = false;

var listPrefab = $("#listPrefab");
var imagePrefab = $("#imagePrefab");
var textAreaPrefab = $("#textAreaPrefab");