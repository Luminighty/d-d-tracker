function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

function GetContainer(selector) {
	if(selector.classList.contains("Container"))
		return selector;
	
	return GetContainer(selector.parentNode);
}

var ShowSpellsList = $$(".ShowSpells");
var EditSpellDescription = $$(".ShowSpells");
var HideEmptyLevels = $$(".ShowSpells");


var SpellPrefab = $("#SpellPrefab");
var ClassPrefab = $("#SpellCasterContainerPrefab");

body.addEventListener("change", function(e) {
	if(e.target.classList.contains("ShowSpells")) {
		ShowSpells(e.target);
		return;
	}
	if(e.target.classList.contains("EditSpellDescription")) {
		ShowEditSpell(e.target);
		return;
	}
	if(e.target.classList.contains("HideEmptyLevels")) {
		ShowEmptyLevels(e.target);
		return;
	}
	if(e.target.classList.contains("SlotTotal")) {
		e.target.parentNode.parentNode.querySelector(".SlotExpended").max = e.target.value;
		return;
	}
	var SpellCastingAbilities = $$(".SpellCastingAbility");
	for(var i = 0; i < SpellCastingAbilities.length; i++)
	UpdateSpellStats(SpellCastingAbilities[i]);
});

body.addEventListener("click", function(e) {

	if(e.target.classList.contains("RemoveSpell")) {
		RemoveSpell(e.target);
		return;
	}
	
	if(e.target.classList.contains("AddSpell")) {
		AddSpell(e.target);
		return;
	}

	if(e.target.classList.contains("RemoveClass")) {
		RemoveClass(e.target);
		return;
	}
	if(e.target.id == "AddClass") {
		AddClass(e.target);
		return;
	}
});

function RemoveClass(e) {
	if(confirm("You can't undo this action and this will delete every spell you had!\nAre you sure you want to continue?")) {
		GetContainer(e).remove();
	}
}
function AddClass(e) {
	var text = prompt("Spellcaster class name (Must be unique!)");
	if(text == null || text == "")
		return;
	if($("#" + text + " SpellcastingContainer") != null) {
		alert("Name Already Exists!");
		return;
	}
	var ini = ClassPrefab.cloneNode(true);
	ini.id = text + " SpellcastingContainer";
	body.appendChild(ini);
	ini.style.zIndex = body.children.length + 1;
	ini.children[2].innerText = text + " Spellcasting";
}

function UpdateSpellStats(e) {
	var mod = parseInt($(`#${e.value}`).children[0].innerText);
	var pro = parseInt($("#Proficiency").value);
	var container = GetContainer(e);
	container.querySelector(".SpellSaveDc").children[0].innerText = 8 + mod + pro;
	container.querySelector(".SpellAttackBonus").children[0].innerText = mod + pro;
}

function RemoveSpell(e) {
	e.parentNode.parentNode.remove();
}
function AddSpell(e) {
	var ini = SpellPrefab.cloneNode(true);
	ini.removeAttribute("id");
	e.previousElementSibling.appendChild(ini)
}

function ShowSpells(e) {
	var SpellContainer = GetContainer(e);
	SpellContainer.querySelector(".SpellList").style.display = (e.checked) ? "table" : "none";
}

function ShowEditSpell(e) {
	var SpellContainer = GetContainer(e);
	var AddSpellButtons = SpellContainer.querySelectorAll(".AddSpell");
	var RemoveSpellButtons = SpellContainer.querySelector(".SpellList").querySelectorAll(".RemoveButton");
	var SpellDescriptions = SpellContainer.querySelectorAll(".SpellDescription");
	var SpellTooltips = SpellContainer.querySelector(".SpellList").querySelectorAll(".tooltiptext");
	for(var i = 0; i < AddSpellButtons.length; i++) {
		AddSpellButtons[i].style.display = (e.checked) ? "inline-block" : "none";
	}	
	for(var i = 0; i < RemoveSpellButtons.length; i++) {
		RemoveSpellButtons[i].style.display = (e.checked) ? "inline-block" : "none";
		SpellDescriptions[i].style.display = (e.checked) ? "inline-block" : "none";
		SpellTooltips[i].style.display = (e.checked) ? "none" : "initial";
		SpellTooltips[i].style.width = "200px";
		SpellTooltips[i].innerText = SpellDescriptions[i].value;
	}

}

function ShowEmptyLevels(e) {
	var SpellContainer = GetContainer(e);
	var SpellLevels = SpellContainer.querySelector(".SpellList").children;
	for(var i = 0; i < SpellLevels.length; i++) {
		var ul = SpellLevels[i].querySelector("ul");
		if(ul.children.length == 0 && !e.checked) {
			SpellLevels[i].style.display = "none";
		} else {
			SpellLevels[i].style.display = "inline-block";
		}
	}
}


for(var i = 0; i < ShowSpellsList.length; i++) {
	ShowSpells(ShowSpellsList[i]);
	ShowEditSpell(EditSpellDescription[i]);
	ShowEmptyLevels(HideEmptyLevels[i]);
}