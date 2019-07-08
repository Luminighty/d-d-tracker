function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

window.addEventListener("mouseup", function(e) {
	if($("#loadHolder") != null && $("#loadHolder").style.visibility == "visible")
	return;
	setTimeout(save, 100);
});
body.addEventListener("keyup", function(e) {
	if(e.target.id == "loadHolder")
	return;
	setTimeout(save, 100);
});

function save() {
	if(window.location.protocol == "file:" || isLoading || isGuest)
		return;
	isSaving = true;
	var xmlhttp = new XMLHttpRequest();
	player = GetData();
	console.log(player);
	var json = JSON.stringify(player);
	while(json.includes("+"))
		json = json.replace("+", "LUMICODEPLUS");
	while(json.includes("&"))
		json = json.replace("&", "LUMICODEAND");
		
	xmlhttp.open("POST", "php/save.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("x=" + json);
}

function GetData() {
	var username = getCookie("md5username");
	var id = getQueryVariable("id");

	var d = {
		id: id,
		username: username,
		charname: $("#CharName").value,
		abilities: [],
		skills: [],
		savingThrows: [],

		proficiencies : "",
		background: "",
		features: "",
		notes: "",
		description: "",
		personality: [],

		stats: [],
		deathsaves: [],
		hitdices: [],
		experience: [],
		classes: [],
		inventory: [],
		attacks: [],
		spellcastings: [],
		layout: [],
		unusedHitDiceShow: false,
		gridSize: 1,
	};
	document.title = "D&D - " + d.charname;

	//Done

	d.unusedHitDiceShow = $("#optionShowUnusedHitDice").checked;
	d.gridSize = $("#snapInput").value;

	var abilities = $("#abilityContainer").children[2].children;
	for(var i = 0; i < abilities.length; i++)
		d.abilities[i] = abilities[i].children[1].value;

	var savingThrows = $("#savingThrowContainer").children[2].children;
	for(var i = 0; i < savingThrows.length; i++)
		d.savingThrows[i] = savingThrows[i].children[0].checked;

	var skills = $("#SkillsContainer").children[2].children;
	for(var i = 0; i < skills.length; i++)
		d.skills[i] = skills[i].children[0].checked;
	
	d.proficiencies = $("#ProficienciesArea").value;
	d.background = $("#Background").value;
	d.features = $("#Features").value;
	d.notes = $("#Notes").value;
	d.description = $("#Description").value;

	var personalityContainer = $("#PersonalityContainer");
	for(var i = 0; i < 4; i++)
		d.personality[i] = personalityContainer.children[2 + (i*2)].value;
	
	for(var i = 0; i < statNames.length; i++)
		d.stats[i] = (statNames[i] != "inspiration") ? $(`#${statNames[i]}`).value : $(`#${statNames[i]}`).checked;

	for(var i = 0; i < 3; i++)
		d.deathsaves[i] = deathsavesSuccesses[i].checked;
	for(var i = 3; i < 6; i++)
		d.deathsaves[i] = deathSaveFailures[i - 3].checked;

	HitDices = $("#HitDiceContainer").querySelectorAll("tr");
	for(var i = 0; i < 4; i++) {
		d.hitdices[(i * 2)] = HitDices[i].querySelector(".currentHitDice").value;
		d.hitdices[(i * 2) + 1] = HitDices[i].querySelector(".maxHitDice").value;
	}

	var xps = $$(".XpRow");
	for(var i = 0; i < xps.length; i++) {
		if(xps[i].id == "XpGainPrefab")
		continue;
		var event = [ xps[i].querySelector(".XpEvent").innerHTML, xps[i].querySelector(".XpValue").innerHTML];
		d.experience.push(event);
	}
	d.experience.push(window.xp);


	var classes = $$(".ClassRow");
	for(var i = 0; i < classes.length; i++) {
		if(classes[i].id == "ClassPrefab")
		continue;
		var c = [ classes[i].querySelector(".ClassName").innerHTML, classes[i].querySelector(".AddedClassLevelInput").value];
		d.classes.push(c);
	}

	var attacks = $$(".AttackItem");
	d.attacks[0] = $(".AttackArea").value;
	for(var i = 0; i < attacks.length; i++) {
		if(attacks[i].id == "AttackPrefab")
		continue;
		var bonus = (attacks[i].querySelector(".tooltiptext").innerHTML.includes("Example")) ? attacks[i].querySelector(".AttackBonus").value : attacks[i].querySelector(".tooltiptext").innerHTML;
		var c = [
			attacks[i].querySelector(".AttackName").value,
			bonus,
			attacks[i].querySelector(".AttackDamage").value,
			attacks[i].querySelector(".AttackType").value,
		];
		d.attacks.push(c);
	}

	var invGroups = $$(".InventoryGroup");
	for(var i = 0; i < invGroups.length; i++) {
		if(invGroups[i].id == "InventoryGroupPrefab")
		continue;
		var g = {
			name: invGroups[i].querySelector(".InventoryGroupName").innerHTML,
			weightChecked: invGroups[i].querySelector(".AddToWeightCarried").checked,
			foldout: invGroups[i].querySelector(".InventoryFoldout").checked,
			items: [],
		};

		var items = invGroups[i].querySelectorAll(".InventoryItem");
		for(var j = 0; j < items.length; j++) {
			if(items[j].id == "ItemPrefab")
			continue;
			var item = {
				name: items[j].querySelector(".ItemName").innerHTML,
				quantity: items[j].querySelector(".ItemQuantity").value,
				value: items[j].querySelector(".ItemValue").innerHTML,
				weight: items[j].querySelector(".ItemWeight").innerHTML,
				description: items[j].querySelector(".Description").innerHTML,
				rarity: (items[j].classList.length > 1) ? items[j].classList[1] : "common",
			}
			g.items.push(item);
		}
		d.inventory.push(g);
	}


	var spellcasters = $$(".SpellContainer");
	for(var i = 0; i < spellcasters.length; i++) {
		if(spellcasters[i].id == "SpellCasterContainerPrefab")
		continue;
		var c = {
			name: spellcasters[i].children[2].innerHTML,
			ability: spellcasters[i].querySelector(".SpellCastingAbility").selectedIndex,
			maxPreparedSpells: spellcasters[i].querySelector(".MaxPreparedSpells").value,
			showList: spellcasters[i].querySelector(".ShowSpells").checked,
			showEditor: spellcasters[i].querySelector(".EditSpellDescription").checked,
			showEmpty: spellcasters[i].querySelector(".HideEmptyLevels").checked,
			left: spellcasters[i].style.left,
			top: spellcasters[i].style.top,
			slots: [],
		};

		var slotHolders = spellcasters[i].querySelector(".SpellList").children;
		//Slots
		for(var j = 0; j < 10; j++) {
			var slot = {
				Total: slotHolders[j].querySelector(".SlotTotal").value,
				SlotExpended: slotHolders[j].querySelector(".SlotExpended").value,
				spells: [],
			}
			var spellHolder = slotHolders[j].querySelector("ul").children;
			for(var k = 0; k < spellHolder.length; k++) {
				var spell = {
					name: spellHolder[k].querySelector(".SpellName").value,
					prepared: spellHolder[k].querySelector(".SpellPrepared").checked,
					description: spellHolder[k].querySelector(".SpellDescription").value,
				}
				slot.spells.push(spell);
			}

			c.slots.push(slot);
		}


		d.spellcastings.push(c);
	}

	//Not Done
	var Containers = $$(".Container")
	for(var i = 0; i < Containers.length; i++)
		if(!Containers[i].classList.contains("SpellContainer")) {
			d.layout[i] = {
				left: "0px",
				top: "0px",
				index: "",
				pin: false,
				width: "",
				height: "",
			}
			d.layout[i]['left'] = Containers[i].style.left;
			d.layout[i]['top'] = Containers[i].style.top;
			d.layout[i]['width'] = Containers[i].style.width;
			d.layout[i]['height'] = Containers[i].style.height;
			d.layout[i]['index'] = Containers[i].style.zIndex;
			d.layout[i]['pin'] = Containers[i].querySelector(".pin").checked;
		}

	return d;
}
var HitDices = $("#HitDiceContainer").querySelectorAll("tr");
var deathsavesSuccesses = $("#deathSaveSuccesses").children;
var deathSaveFailures = $("#deathSaveFailures").children;
var statNames = ["hp", "maxhp", "inspiration", "ac", "speed", "temphp", "Proficiency"];

var player;
var loader = $("#loadHolder");

var isLoading = false;
var isGuest = false;

function LoadData() {
	if(window.location.protocol == "file:") {
		loader.style.visibility = "hidden";
		return;
	}
	isLoading = true;

	var loggedIn = getCookie("loggedIn");
	var username = getCookie("md5username");
	var userId = getQueryVariable("user");
	console.log(userId);
	if(userId == null || username == userId)
		if(loggedIn == null || loggedIn == false) {
			window.location = "index.php";
		} else {
			setCookie("loggedIn", true, 7);
			setCookie("md5username", username, 7);
		}
	var id = getQueryVariable("id");
	if(!id) {
		window.location = "index.php";
		return;
	}
	isGuest = userId != false && username != userId;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			loader.style.visibility = "visible";
			console.log(this.responseText);
			var response = this.responseText;
			if(response == "Not Found!") {
				window.location = "index.php";
			}

			if(isGuest)
				LockInputs();

			while(response.includes("LUMICODEPLUS"))
				response = response.replace("LUMICODEPLUS", "+");
			while(response.includes("LUMICODEAND"))
				response = response.replace("LUMICODEAND", "&");
			player = JSON.parse(response);
			console.log("LOAD");
			console.log(player);
			SetData();
			isLoading = false;
		}
	};
	var link = "php/load.php?id=" + getQueryVariable("id") + ((userId != null) ? `&user=${userId}` : "");
	xmlhttp.open("GET", link, true);
	xmlhttp.send();
}

function SetData() {

	//Done
	
	$("#optionShowUnusedHitDice").checked = player.unusedHitDiceShow;
	$("#snapInput").value = (player.gridSize == null) ? 1 : player.gridSize;

	setValueContainers("#abilityContainer", player.abilities, "value");
	setValueContainers("#savingThrowContainer", player.savingThrows, "check");
	setValueContainers("#SkillsContainer", player.skills, "check");

	setTextAreaContainer("#ProficienciesContainer", player.proficiencies);
	setTextAreaContainer("#FeaturesContainer", player.features);
	setTextAreaContainer("#BackgroundContainer", player.background);
	setTextAreaContainer("#DescriptionContainer", player.description);
	setTextAreaContainer("#NotesContainer", player.notes);

	var personalityContainer = $("#PersonalityContainer");
	for(var i = 0; i < 4; i++)
		personalityContainer.children[2 + (i*2)].value = player.personality[i];

	$("#CharName").value = player.charname;
	document.title = "D&D - " + player.charname;

	for(var i = 0; i < statNames.length; i++)
		if(statNames[i] != "inspiration")
			$(`#${statNames[i]}`).value = player.stats[i];
			else 
			$(`#${statNames[i]}`).checked = player.stats[i];

	for(var i = 0; i < 3; i++)
		deathsavesSuccesses[i].checked = player.deathsaves[i];
	for(var i = 3; i < 6; i++)
		deathSaveFailures[i - 3].checked = player.deathsaves[i];

	HitDices = $("#HitDiceContainer").querySelectorAll("tr");
	for(var i = 0; i < 4; i++) {
		HitDices[i].querySelector(".currentHitDice").value = player.hitdices[i * 2];
		HitDices[i].querySelector(".maxHitDice").value = player.hitdices[(i * 2) + 1];
	}


	var container = $("#ExperienceContainer");
	var prefab = $("#XpGainPrefab");
	var xpEventInput = $("#XpEventInput");
	var AddXpInput = $("#AddXpInput");
	var rev = player.experience.reverse();
	for(var i = 1; i < player.experience.length; i++) {
		var ini = prefab.cloneNode(true);
		ini.id = "";
		ini.querySelector(".XpEvent").innerHTML = rev[i][0];
		ini.querySelector(".XpValue").innerHTML = rev[i][1];
		var before = container.children[2].querySelectorAll("tr");
		before[0].parentNode.insertBefore(ini,before[2]);
	}

	window.xp = (rev[0] == null) ? 0 : rev[0];
	$("#XpValue").innerHTML = `Experience ${window.xp}xp`;

	var container = $("#ClassContainer");
	prefab = $("#ClassPrefab");
	rev = player.classes.reverse();
	for(var i = 0; i < player.classes.length; i++) {
		var ini = prefab.cloneNode(true);
		ini.id = "";
		ini.querySelector(".ClassName").innerHTML = rev[i][0];
		ini.querySelector(".AddedClassLevelInput").value = rev[i][1];
		var before = container.children[2].querySelectorAll("tr");
		before[0].parentNode.insertBefore(ini,before[1]);
	}

	var container = $("#AttackContainer");
	prefab = $("#AttackPrefab");
	rev = player.attacks;
	for(var i = 1; i < player.attacks.length; i++) {
		var ini = prefab.cloneNode(true);
		ini.id = "";
		ini.querySelector(".AttackName").value = rev[i][0];
		ini.querySelector(".tooltiptext").innerHTML = rev[i][1];
		ini.querySelector(".AttackDamage").value = rev[i][2];
		ini.querySelector(".AttackType").value = rev[i][3];
		container.querySelector("tbody").appendChild(ini);
		ini.querySelector(".AttackBonus").addEventListener("blur", window.BlurAttackBonus);
		ini.querySelector(".AttackBonus").addEventListener("focus", window.FocusAttackBonus);
	}
	$(".AttackArea").value = rev[0];

	var container = $("#InventoryContainer");
	prefab = $("#InventoryGroupPrefab");
	ItemPrefab = $("#ItemPrefab");
	rev = player.inventory;
	for(var i = 0; i < player.inventory.length; i++) {
		var ini = GroupPrefab.cloneNode(true);
		ini.id = "";
		ini.querySelector(".InventoryGroupName").innerHTML = rev[i]["name"];
		ini.querySelector(".AddToWeightCarried").checked = rev[i]["weightChecked"],
		ini.querySelector(".InventoryFoldout").checked = rev[i]["foldout"],
		InventoryContainer.querySelector("ul").appendChild(ini);

		var option = document.createElement("option");
		option.text = rev[i]["name"];
		var Group = $("#ItemGroupInput");
		Group.add(option);
		option = document.createElement("option");
		option.text = rev[i]["name"];
		$("#ItemGroups").add(option);
		$("#AddItemButton").style.visibility = "visible";

		var Weight = 0;
		for(var j = 0; j < rev[i].items.length; j++) {
			var item = ItemPrefab.cloneNode(true);
			item.id = "";
			var rarity = (rev[i].items[j]["rarity"] == null) ? "common" : rev[i].items[j]["rarity"];
			item.classList.add(rarity);
			item.querySelector(".ItemName").innerText = rev[i].items[j]["name"];
			item.querySelector(".ItemValue").innerText = rev[i].items[j]["value"];
			item.querySelector(".ItemWeight").innerText = rev[i].items[j]["weight"];
			item.querySelector(".Description").innerText = rev[i].items[j]["description"];
			item.querySelector(".ItemQuantity").value = rev[i].items[j]["quantity"];
			ini.querySelector("table").appendChild(item);


		}
		ini.querySelector("table").hidden = !rev[i]["foldout"];
	}


	
	prefab = $("#InventoryGroupPrefab");
	ItemPrefab = $("#ItemPrefab");
	rev = player.spellcastings;

	for(var i = 0; i < player.spellcastings.length; i++) {

		//Create Container
		var ini = ClassPrefab.cloneNode(true);
		ini.id = player.spellcastings[i].name + "Container";
		body.appendChild(ini);
		ini.style.zIndex = body.children.length + 1;
		ini.children[2].innerText = rev[i]["name"];
		ini.querySelector(".SpellCastingAbility").selectedIndex = rev[i]["ability"];
		ini.querySelector(".MaxPreparedSpells").value = rev[i]["maxPreparedSpells"];
		ini.querySelector(".ShowSpells").checked = rev[i]["showList"];
		ini.querySelector(".EditSpellDescription").checked = rev[i]["showEditor"];
		ini.querySelector(".HideEmptyLevels").checked = rev[i]["showEmpty"];
		ini.style.left = rev[i].left;
		ini.style.top = rev[i].top;

		for(var j = 0; j < 10; j++) {
			var slot = rev[i].slots[j];
			var holder = ini.querySelector(".SpellList").children[j];
			holder.querySelector(".SlotTotal").value = slot.Total;
			holder.querySelector(".SlotExpended").value = slot.SlotExpended;

			for(var k = 0; k < slot.spells.length; k++) {

				var spell = SpellPrefab.cloneNode(true);
				spell.removeAttribute("id");
				spell.querySelector(".SpellName").value = slot.spells[k].name;
				spell.querySelector(".SpellPrepared").checked = slot.spells[k].prepared;
				spell.querySelector(".tooltiptext").value = slot.spells[k].description;
				spell.querySelector(".SpellDescription").value = slot.spells[k].description;
				holder.querySelector("ul").appendChild(spell)

			}

		}

	}
	//Not Done

	var Containers = $$(".Container")
	if(player.layout != null && player.layout[0] != null)
	for(var i = 0; i < Containers.length; i++) {
		if(player.layout[i] == null)
			continue;
		if(!Containers[i].classList.contains("SpellContainer")) {
			if(player.layout[i].left != "")
			Containers[i].style.left = player.layout[i]['left'];
			if(player.layout[i].top != "")
			Containers[i].style.top = player.layout[i]['top'];
			if(player.layout[i].index != "")
			 Containers[i].style.zIndex = player.layout[i]['index'];
			if(player.layout[i].pin != "")
			 Containers[i].querySelector(".pin").checked = player.layout[i]['pin'];

			if(player.layout[i].width != "")
			 Containers[i].style.width = player.layout[i]['width'];
			if(player.layout[i].height != "")
			 Containers[i].style.height = player.layout[i]['height'];
		}
	}

	$("#PictureContainer").querySelector("img").src ="data/" + player.username + "/images/" + player.id + ".img";

	setTimeout(RefreshData, 10);

}

function setTextAreaContainer(valueHolder, data) {
	var holder = $(valueHolder).children[2];
	holder.value = data;
}

function setValueContainers(valueHolder, datas, type) {
	var values = $(valueHolder).children[2].children;
	for(var i = 0; i < values.length; i++)
		switch(type) {
			case "check":
			values[i].children[0].checked = datas[i];
			break;
			case "value":
			values[i].children[1].value = datas[i];
			break;
			default:
			console.error(type + " value type not found!");
			break;
		}
}

function ClickOn(element) {
	
	if ("createEvent" in document) {
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("click", true, true);
		element.dispatchEvent(evt);
	}
	else
	element.fireEvent("onclick");
	
}

function RefreshData() {
	
	var everything = body.getElementsByTagName("*");
	for(var i = 0; i < everything.length; i++) {
		if ("createEvent" in document) {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("change", true, true);
			everything[i].dispatchEvent(evt);
		}
		else
		everything[i].fireEvent("onchange");
	}
	loader.style.visibility = "hidden";
}

LoadData();


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

function LockInputs() {
	var exceptions = [".InventoryFoldout", ".pin", ".ShowSpells"];
	var sheet = document.styleSheets[0];
	sheet.insertRule("input:disabled, textarea:disabled, select:disabled { background-color: white; color: black; }", 1);
	function DisableArray(array) {
		main_Loop:
		for(var i = 0; i < array.length; i++) {
			for(var j = 0; j < exceptions.length; j++)
				if(array[i].matches(exceptions[j]))
					continue main_Loop;
			if(array[i].style != null) {
			array[i].style.color = array[i].style.color + " !important";
			array[i].style.backgroundColor = array[i].style.backgroundColor + " !important";
			}
			array[i].disabled = true;
		}
	}
	DisableArray($$("input"));
	DisableArray($$("textarea"));
	DisableArray($$("button"));
	DisableArray($$("select"));

	var div = document.createElement("div");
	div.innerHTML = "Spectating only!"
	div.classList.add("guest");
	document.body.appendChild(div);
	div.addEventListener("click", function(e) {
		div.remove();
	});
}