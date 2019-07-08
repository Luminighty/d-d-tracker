function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

var ItemPrefab = $("#ItemPrefab");
var GroupPrefab = $("#InventoryGroupPrefab");

var foldouts = $$(".InventoryFoldout");

var AddItemContainer = $("#AddItemContainer");
var EditGroupsContainer = $("#EditGroupsContainer");
var InventoryContainer = $("#InventoryContainer");

for(var i = 0; i < foldouts.length; i++)
	InventoryFoldout(foldouts[i]);

//Shows The Editor
$("#AddItemButton").addEventListener("click", function(e) {
	AddItemContainer.hidden = !AddItemContainer.hidden;
	EditGroupsContainer.hidden = true;
});

//Shows The Editor
$("#EditGroupsButton").addEventListener("click", function(e) {
	EditGroupsContainer.hidden = !EditGroupsContainer.hidden;
	AddItemContainer.hidden = true;
});

var Name = $("#ItemNameInput");
var Quantity = $("#ItemQuantityInput");
var Value = $("#ItemValueInput");
var Weight = $("#ItemWeightInput");
var Rarity = $("#ItemRarityInput");
var Description = $("#ItemDescriptionInput");
var Group = $("#ItemGroupInput");

var GroupWeight;

var GroupName = $("#ItemGroupNameInput");

function ConvertValue(value) {
	var convertValue = 0;
	var splitValue = value.toLowerCase().split(' ');
	for(var i = 0; i < splitValue.length; i++) {
		var trim = splitValue[i].substr(0, splitValue[i].length - 2);
		if(splitValue[i].endWith("cp"))
			convertValue += parseInt(trim);
		if(splitValue[i].endWith("sp"))
			convertValue += parseInt(trim) * 10;
		if(splitValue[i].endWith("ep"))
			convertValue += parseInt(trim) * 50;
		if(splitValue[i].endWith("gp"))
			convertValue += parseInt(trim) * 100;
		if(splitValue[i].endWith("pp"))
			convertValue += parseInt(trim) * 1000;
	}
	return convertValue;
}

//Item Editor buttons
$("#AddItem").addEventListener("click", function(e) {
	if(Name.value == "") {
		alert("No item name was given!")
		return;
	}
	if(Group.options.length == 0) {
		alert("Add item groups!")
		return;
	}
	var ini = ItemPrefab.cloneNode(true);
	ini.id = "";
	ini.classList.add(Rarity.value.toLowerCase());
	ini.querySelector(".ItemName").innerText = Name.value;
	ini.querySelector(".ItemValue").innerText = Value.value;
	ini.querySelector(".ItemWeight").innerText = Weight.value + "lb.";
	ini.querySelector(".Description").innerText = Description.value;
	ini.querySelector(".ItemQuantity").value = Quantity.value;
	InventoryContainer.querySelector("ul").children[Group.selectedIndex].querySelector("table").appendChild(ini);
	var foldout = InventoryContainer.querySelector("ul").children[Group.selectedIndex].querySelector(".InventoryFoldout");
	foldout.checked = true;
	InventoryFoldout(foldout);
	
	Name.value = "";
	Quantity.value = 0;
	Value.value = "";
	Weight.value = 0;
	Rarity.selectedIndex = 0;
	Description.value = "";
});

$("#ResetButton").addEventListener("click", function(e) {
	Name.value = "";
	Quantity.value = 0;
	Value.value = "";
	Weight.value = 0;
	Rarity.selectedIndex = 0;
	Description.value = "";
});

//Group Editor buttons
$("#AddItemGroup").addEventListener("click", function(e) {

	if(GroupName.value == "") {
		alert("No group name was given!")
		return;
	}
	var ini = GroupPrefab.cloneNode(true);
	console.log(ini);
	ini.id = "";
	ini.querySelector(".InventoryGroupName").innerHTML = GroupName.value;
	InventoryContainer.querySelector("ul").appendChild(ini);
	var option = document.createElement("option");
	option.text = GroupName.value;
	Group.add(option);
	option = document.createElement("option");
	option.text = GroupName.value;
	GroupName.value = "";
	$("#ItemGroups").add(option);
	$("#AddItemButton").style.visibility = "visible";
});

$("#DeleteItemGroup").addEventListener("click", function(e) {
	if(Group.options.length == 0) {
		return;
	}
	if(!confirm("You can't undo this action and this will delete every item you had!\nAre you sure you want to continue?"))
		return;
	var groups = $("#ItemGroups");
	console.log(InventoryContainer.querySelector("ul").children);
	console.log(groups.selectedIndex);
	InventoryContainer.querySelector("ul").children[groups.selectedIndex].remove();
	Group.remove(groups.selectedIndex);
	groups.remove(groups.selectedIndex);
	
	$("#AddItemButton").style.visibility = (Group.options.length == 0) ? "hidden" : "visible";
});
$("#AddItemButton").style.visibility = (Group.options.length == 0) ? "hidden" : "visible";


$("#InventoryContainer").addEventListener("click", function(e) {
	if(e.target.classList.contains("RemoveItem")) {
		RemoveItem(e.target);
		return;
	}	
	if(e.target.classList.contains("InventoryFoldout")) {
		InventoryFoldout(e.target);
		return;
	}
	if(e.target.classList.contains("UpButton") || e.target.classList.contains("DownButton")) {
		
		SortButton(e.target, (e.target.classList.contains("UpButton")) ? 1 : -1, (e.target.classList.contains("GroupButton")));
		return;
	}	
	if(e.target.classList.contains("InventoryFoldout")) {
		InventoryFoldout(e.target);
		return;
	}
});

$("#InventoryContainer").addEventListener("change", function() {
	var groups = $$(".InventoryGroup");
	var weight = 0;
	for(var i = 0; i < groups.length; i++)
		weight += UpdateWeight(groups[i].querySelector(".AddToWeightCarried"));

	UpdateMaxWeight();
	var title = InventoryContainer.querySelector("h2");
	var MaxWeight = $("#strAb").value * 15
	title.innerHTML = `Inventory ${weight}/${MaxWeight} lb.`;
});

function UpdateWeight(e) {
	if(!e.checked)
		return 0;
	var weight = 0;
	var Items = e.parentNode.parentNode.querySelector("table").children;
	for(var i = 0; i < Items.length; i++) {
		var weightHolder = Items[i].querySelector(".ItemWeight").innerHTML;
		var count = Items[i].querySelector(".ItemQuantity").value;
		if(weightHolder == "")
			continue;
		var trim = weightHolder.substr(0, weightHolder.length - 3);
		weight += parseFloat(trim) * count;
	}
	return weight;
}

function UpdateMaxWeight() {
}

function InventoryFoldout(e) {
	e.parentNode.parentNode.querySelector("table").hidden = !e.checked;
}

function RemoveItem(e) {
	e.parentNode.parentNode.remove();
}
function SortButton(e, way, isGroup) {
	if(way == 1 && e.parentNode.parentNode.previousElementSibling != null)
		e.parentNode.parentNode.parentNode.insertBefore(e.parentNode.parentNode, e.parentNode.parentNode.previousElementSibling);
	if(way == -1 && e.parentNode.parentNode.nextElementSibling != null)
		e.parentNode.parentNode.parentNode.insertBefore(e.parentNode.parentNode.nextElementSibling, e.parentNode.parentNode);
	if(isGroup == true) {
		var groupInput = $("#ItemGroupInput");
		var index = 0;
		var child = e.parentNode.parentNode;
		while( (child = child.previousSibling) != null ) 
		index++;
		if(way == 1 && groupInput.children[index].previousElementSibling != null)
		groupInput.insertBefore(groupInput.children[index], groupInput.children[index].previousElementSibling);
		if(way == -1 && groupInput.children[index].nextElementSibling != null)
		groupInput.insertBefore(groupInput.children[index].nextElementSibling, groupInput.children[index]);
	}
}