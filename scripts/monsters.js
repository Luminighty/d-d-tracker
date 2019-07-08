(function() {

	var Monsters = [];
	var list = $("#MonsterDatabaseList");

	{
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", "php/dmScreen/monstersLastUpdate.php");
		xmlhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				var currentUpdate = parseInt(this.responseText);
				var lastUpdate = window.localStorage.getItem("lastMonsterUpdate")
				if(lastUpdate == null || lastUpdate < currentUpdate) {
					window.localStorage.setItem("lastMonsterUpdate", currentUpdate);
					UpdateMonsters();
				} else {
					Monsters = JSON.parse(window.localStorage.getItem("Monsters"));
					if(Monsters == null) {
						Monsters = [];
					}
					console.log(Monsters);
				}

				//Update 

			}
		}
		xmlhttp.send();

	}

	function UpdateMonsters() {
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", "php/dmScreen/getMonsters.php");
		xmlhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				Monsters = JSON.parse(this.responseText);
				window.localStorage.setItem("Monsters", JSON.stringify(Monsters));
			}
		}
		xmlhttp.send();
	}

	$("#monsterURLButton").addEventListener("click", function(e) {
		console.log(e);
		var site = prompt("Paste a monster from 'https://roll20.net/compendium/dnd5e/Monsters%20List#content' here:");
		if(!site.startsWith("https://roll20.net/compendium/dnd5e/")) {
			alert("Wrong address");
			return;
		}
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET","php/dmScreen/urlMonster.php?url=" + site);
		xmlhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				response = JSON.parse(this.responseText);

				if(response.isError) {
					alert("Error: " + response.list);
				} else {
					console.log(response);
					var id = Date.now();
					var m = {
						id: id,
						Name: response.n,
						SubTitle: `${response.Size} ${response.Type}, ${response.Alignment}`,
						HP: response.HP,
						AC: response.AC,
						Speed: response.Speed,
						STR: response.STR,
						DEX: response.DEX,
						CON: response.CON,
						INT: response.INT,
						WIS: response.WIS,
						CHA: response.CHA,
						Features: "",
					}
					response["Challenge"] = `${response["Challenge Rating"]} (${response["data-XP"]} XP)`;
					CreateNewEntry(m.Name, m.id);
					var features = ["Saving Throws", "Skills","Vulnerabilities", "Damage Vulnerabilities", "Resistances", "Immunities", "Condition Immunities","Senses", "Languages", "Challenge"];
					m["Features"] = "";
					for(var f in features) {
						f = features[f];
						if(response[f] != "—")
							m["Features"] += "<b>" + f + "</b>: " + response[f] + "\n";
					}
					m["Traits"] = "";
					for(var t in response["data-Traits"]) {
						t = response["data-Traits"][t];
						m["Traits"] += "<b>" + t.Name + "</b>: " + t.Desc + "\n";
					}

					m["Actions"] = "";
					for(var t in response["data-Actions"]) {
						t = response["data-Actions"][t];
						if(t.Desc != null) {
							m["Actions"] += "<b>" + t.Name + "</b>: " + t.Desc + "\n";
						} else {
							m["Actions"] += "<b>" + t.Name + "</b>: " + t.Type + " " + t["Type Attack"] + ": +" + t["Hit Bonus"] + " to hit, reach " + t.Reach + ", " + t.Target + ". Hit: (" + t.Damage + ") " + t["Damage Type"] + " damage." + "\n";
						}
					}

					m["LegendaryActions"] = "";
					for(var t in response["data-Legendary Actions"]) {
						t = response["data-Legendary Actions"][t];
						m["LegendaryActions"] +="<b>" +t.Name + "</b>: " + t.Desc + "\n";
					}
					m["Reactions"] = "";
					for(var t in response["data-Reactions"]) {
						t = response["data-Reactions"][t];
						m["Reactions"] +="<b>" +t.Name + "</b>: " + t.Desc + "\n";
					}

					Monsters[id] = m;
					setTimeout(LoadMonsterToEditor, 100, m);
					// Load Monster
				}
			}
		}
		xmlhttp.send();
	});

	list.addEventListener("click", function(e) {
		if(!e.target.classList.contains("selectable") || e.target.classList.contains("newMonster"))
			return;
		var monster = Monsters[e.target.dataset["monsterid"]];
		console.log(e.target.dataset["monsterid"]);
		console.log(JSON.stringify(monster));
		LoadMonsterToEditor(monster);
	});


	$(".newMonster").addEventListener("click", function(e) {
		setTimeout(() => {
			console.log(e);
			LoadMonsterToEditor();
			var id = Date.now();
			CreateNewEntry("Unknown", id);
			Monsters[id] = NewMonster(id);
		}, 10);
	});

	function CreateNewEntry(name, id) {
		if(list.querySelector(".active") != null)
			list.querySelector(".active").classList.remove("active");
		var newListElement = document.createElement("div");
		newListElement.classList.add("listElement", "Monster", "selectable", "active");
		newListElement.dataset["monsterid"] = id;
		newListElement.innerHTML = name;

		list.insertBefore(newListElement, list.children[list.children.length - 1]);
		newListElement.scrollIntoView();
	}

	function NewMonster(id) {
		var m = {
			id: id,
			Name: "Unknown",
			SubTitle: ``,
			HP: "",
			AC: "",
			Speed: "",
			Challenge: ``,
			STR: 10,
			DEX: 10,
			CON: 10,
			INT: 10,
			WIS: 10,
			CHA: 10,
			Features: "",
			LegendaryActions: "",
			Reactions: "",
			Actions: "",
			Traits: "",
		}
		return m;
	}

	function LoadMonsterToEditor(m) {
		function SetInputField(name, value) {
			$("#monster" + name).value = (value == null) ? "" : value;
		}

		SetInputField("Name", ((m == null) ? "" : m.Name));
		SetInputField("SubTitle", ((m == null) ? "" : m.SubTitle));
		SetInputField("HP", ((m == null) ? "" : m.HP));
		SetInputField("AC", ((m == null) ? "" : m.AC));
		SetInputField("Speed", ((m == null) ? "" : m.Speed));
		SetInputField("STR", ((m == null) ? "" : m.STR));
		SetInputField("DEX", ((m == null) ? "" : m.DEX));
		SetInputField("CON", ((m == null) ? "" : m.CON));
		SetInputField("INT", ((m == null) ? "" : m.INT));
		SetInputField("WIS", ((m == null) ? "" : m.WIS));

		SetInputField("Features", ((m == null) ? "" : m.Features));

		SetInputField("Traits", ((m == null) ? "" : m.Traits));
		SetInputField("Reactions", ((m == null) ? "" : m.Reactions));
		SetInputField("Actions", ((m == null) ? "" : m.Actions));
		SetInputField("LegendaryActions", ((m == null) ? "" : m.LegendaryActions));
	}



	//
	//	Add Monsters
	//

	var ColorPicker = $("#monsterColor");
	var currentColorElement = null;

	$(".monsterPickedHolder").addEventListener("mouseover", function(e) {
		if(e.target.classList.contains("listElement")) {
			e.target.style.backgroundColor = "rgb(189, 189, 189)";
		}
	});
	$(".monsterPickedHolder").addEventListener("mouseout", function(e) {

		if(e.target.classList.contains("listElement")) {
			e.target.style.backgroundColor = e.target.dataset["color"];
		}
	});
	$(".monsterPickedHolder").addEventListener("click", function(e) {
		if(e.target.classList.contains("listElement")) {
			ColorPicker.value = e.target.dataset["color"];
			currentColorElement = e.target;
			ColorPicker.click();
		}
	});

	ColorPicker.addEventListener("change", function(e) {
		currentColorElement.style.backgroundColor = ColorPicker.value;
		currentColorElement.dataset["color"] = ColorPicker.value;
		currentColorElement = null;
	});

}());