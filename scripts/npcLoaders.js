document.body.addEventListener("click", function(e) {
	if(e.target.classList.contains("removeNpc")) {
		var tr = GetElementInParents(e.target, ".NpcElement");
		if(tr == null) {
			console.log("error!");
			return;
		}
		DeleteNpc(tr);
		return;
	}
	var tr = GetElementInParents(e.target, ".NpcElement");
	if(tr != null) {
		LoadNpc(tr);
		return;
	}
	if(e.target.classList.contains("npcCreate")) {
		CreateNpc(e.target);
	}
});

function CreateNpc(e) {
	
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var clone = $(".NpcElement").cloneNode(true);
			Log(this.responseText);
			clone.querySelector(".npc_Name").innerHTML = "Unknown";
			clone.querySelector("img").src = "data/NPCs/" + this.response + "/avatar.img";
			clone.id = this.responseText;
			clone.removeAttribute("hidden");

			e.parentElement.parentElement.appendChild(clone);
		}
	}

	xmlhttp.open("POST", "php/npc/save.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("x=NEW");
	
}

function DeleteNpc(e) {
	if(prompt("This will delete '" + e.querySelector(".npc_Name").innerHTML.toUpperCase() + "' forever!\nType 'DELETE' if you want to continue.") == "DELETE") {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "php/npc/delete.php", true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		xmlhttp.send("x=" + e.id);
		e.remove();
	}
}


function LoadNpc(e) {
	window.open("http://luminight.web.elte.hu/d-d/npc.html?id=" + e.id);
}
