var npc = {
	id: 0,
	hidden: false,
	elements: [],
	images: [],
	name: "",
	description: "",
	user: "",
	md5: "",
	gridSize: 1
}

var isLoading = false;
var loader = $("#loadHolder");
var guest = false;

function save() {
	if(window.location.protocol == "file:" || guest || isLoading)
		return;

	isSaving = true;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
		}
	}
	npc = GetData();
	console.log(npc);
	var json = JSON.stringify(npc);
	while(json.includes("+"))
		json = json.replace("+", "LUMICODEPLUS");
	while(json.includes("&"))
		json = json.replace("&", "LUMICODEAND");
	xmlhttp.open("POST", "php/npc/save.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("x=" + json);
}

function GetData() {
	var containers = $$(".Container");
	var d = {
		id: npc.id,
		hidden: npc.hidden,
		elements: [],
		images: [],
		name: npc.name,
		description: npc.description,
		user: npc.user,
		md5: npc.md5,
		gridSize: $("#snapInput").value
	}

	for(var i = 0; i < containers.length; i++) {
		if(containers[i].id.includes("Prefab"))
			continue;

		var element = {};
		element.Position = {
			width: containers[i].style.width,
			height: containers[i].style.height,
			left: containers[i].style.left,
			top: containers[i].style.top,
			index: containers[i].style.zIndex
		}
		element.Title = (EditTitles) ? containers[i].querySelector(".titleHolder").innerHTML : containers[i].querySelector(".titleInput").value;
		element.hidden = !containers[i].querySelector(".show").checked;
		element.locked = containers[i].querySelector(".pin").checked;

		if(containers[i].classList.contains("ListContainer")) {
			element.type = "List";
			element.values = [];
			element.titles = [];
			element.Position.width = containers[i].querySelector(".list_Holder").style.width;
			element.Position.height = containers[i].querySelector(".list_Holder").style.height;

			trs = containers[i].querySelectorAll(".list_Element");

			for(var j = 0; j < trs.length; j++) {
				element.values[j] = (showPreview) ? trs[j].querySelector(".list_Value").innerHTML : trs[j].querySelector(".list_Value").value;
				element.titles[j] = (showPreview) ? trs[j].querySelector(".list_Title").innerHTML : trs[j].querySelector(".list_Title").value;
			}

		}
		if(containers[i].classList.contains("ImageContainer")) {
			element.type = "Image";
			element.id = containers[i].querySelector("input[type='file']").id;
			d.images[d.images.length] = element.id.replace("_image", "") + ".img";

		}
		if(containers[i].classList.contains("TextAreaContainer")) {
			element.type = "TextArea";
			element.text = (showPreview) ? containers[i].querySelector(".textAreaDiv").innerHTML : containers[i].querySelector("textarea").value;
			element.Position.width = containers[i].querySelector(".textAreaDiv").style.width;
			element.Position.height = containers[i].querySelector(".textAreaDiv").style.height;
		}

		d.elements[d.elements.length] = element;

	}

	return d;
}

function SetData() {
	console.log("setData");
	document.title = "D&D - " + npc.name;
	if(guest) {
		$(".topnav").remove();
		LockMovement = true;
	} else {
		$("#snapInput").value = npc.gridSize;
		$("#set_Visibility").innerHTML = (npc.hidden) ? "Show NPC" : "Hide NPC";
	}

	for(var i = 0; i < npc.elements.length; i++) {
		if(npc.elements[i].hidden && guest) {
			npc.elements[i] = null;
			continue;
		}
		var e = npc.elements[i];
		var ini = null;
		
		//Element Data

		switch(e.type) {
			case "List":
				ini = AddElement(listPrefab, document.body);
				var table = ini.querySelector("table");

				ini.querySelector(".list_Holder").style.width = e.Position.width;
				ini.querySelector(".list_Holder").style.height = e.Position.height;
				
				if(guest) {
					ini.querySelector(".newLine").remove();
					ini.style.resize = "none";
				}
				for(var j = 0; j < e.titles.length; j++) {
					var tr = document.createElement("tr");
					tr.classList.add("list_Element");
					var tdTitle = document.createElement("td");
					var tdValue = document.createElement("td");
					var title = null;
					var value = null;
					var type = (guest) ? "div" : "input";

					title = document.createElement(type);
					value = document.createElement(type);

					value.classList.add("inputDiv");
					title.classList.add("inputDiv");

					if(guest) {
						title.innerHTML = e.titles[j];
						value.innerHTML = e.values[j];

					} else {
						title.value = e.titles[j];
						value.value = e.values[j];

						title.setAttribute("type", "text");
						value.setAttribute("type", "text");
					}
					title.classList.add("list_Title");
					value.classList.add("list_Value");

					tdTitle.appendChild(title);
					tdValue.appendChild(value);
					tr.appendChild(tdTitle);
					tr.appendChild(tdValue);
					if(guest) {
					table.appendChild(tr);
					} else {
						var button = GetElementInParents(table.querySelector(".newLine"), "tr");
						console.log(button);
						button.parentElement.insertBefore(tr, button);
					}
				}

				break;
			case "Image":
				ini = AddElement(imagePrefab, document.body);
				var id = e.id;
				ini.querySelector("label").htmlFor = id;
				ini.querySelector("img").src = "data/NPCs/" + npc.id + "/" + e.id.replace("_image", "") + ".img?t=" + new Date().getTime();
				ini.querySelector("input[type='file']").id = id;
				ini.querySelector("input[type='file']").addEventListener("change", ChangeImage);
				ini.style.width = e.Position.width;
				ini.style.height = e.Position.height;
				if(guest) {
					ini.style.resize = "none";
					ini.querySelector("input[type='file']").remove();

				}
				break;
			case "TextArea":
				ini = AddElement(textAreaPrefab, document.body);
					if(guest) {
						ini.querySelector("textarea").remove();
						var div = document.createElement("div");
						div.innerHTML = e.text;
						div.style.width = e.Position.width;
						div.style.height = e.Position.height;
						div.classList.add("textAreaDiv");
						ini.appendChild(div);
					} else {
						var textArea = ini.querySelector("textarea");
						textArea.style.width = e.Position.width;
						textArea.style.height = e.Position.height;
						textArea.value = e.text;
					}
				break;
			default:
			break;
		}

		//Styles

		ini.style.left = e.Position.left;
		ini.style.top = e.Position.top;
		ini.style.zIndex = e.Position.zIndex;
		ini.style.position = "absolute";
		ini.querySelector(".pin").checked = true;
		body.appendChild(ini);
		if(guest) {
			ini.querySelector("h2").style.cursor = "default";
			ini.querySelector(".pin").remove();
			ini.querySelector(".show").remove();
			ini.querySelector("h2").innerHTML = e.Title;
		} else {
			ini.querySelector(".pin").checked = e.locked;
			ini.querySelector(".show").checked = !e.hidden;
			ini.querySelector(".titleInput").value = e.Title;
		}

	}

}

function Load() {

	if(window.location.protocol == "file:") {
		loader.style.visibility = "hidden";
		return;
	}
	loader.style.visibility = "show";
	isLoading = true;

	var loggedIn = getCookie("loggedIn");
	var username = getCookie("md5username");
	if(loggedIn == null || loggedIn == false) {
		guest = true;
	} else {
		setCookie("loggedIn", true, 7);
		setCookie("md5username", username, 7);
	}
	var id = getQueryVariable("id");
	if(!id) {
		window.location = "index.php";
		return;
	}
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
			loader.style.visibility = "visible";
			if(!guest) {
				console.log(this.responseText);
				$(".topnav").style.visibility = "visible";
			}
			var response = this.responseText;
			if(response == "Not Found!") {
				window.location = "index.php";
			}
			while(response.includes("LUMICODEPLUS"))
				response = response.replace("LUMICODEPLUS", "+");
			while(response.includes("LUMICODEAND"))
				response = response.replace("LUMICODEAND", "&");
			npc = JSON.parse(response);
			//console.log(username);
			if(!guest && username != npc.md5)
				guest = true;
			
			SetData();
			isLoading = false;
			loader.style.visibility = "hidden";
    }
	};
	xmlhttp.open("GET", "php/npc/load.php?id=" + getQueryVariable("id"), true);
	xmlhttp.send();

}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/d-d";
}

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

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


window.addEventListener("mouseup", function(e) {
	if($("#loadHolder") != null && $("#loadHolder").style.visibility == "visible" || guest)
		return;
	setTimeout(save, 100);
});

body.addEventListener("keyup", function(e) {
	if(e.target.id == "loadHolder" || guest)
		return;
	setTimeout(save, 100);
});

Load();