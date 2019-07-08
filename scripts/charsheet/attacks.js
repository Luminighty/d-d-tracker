function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

var AttackPrefab = $("#AttackPrefab")
var AttackContainer = $("#AttackContainer");

$("#AddAttack").addEventListener("click", function(e) {
	var ini = AttackPrefab.cloneNode(true);
	ini.id = "";
	AttackContainer.querySelector("tbody").appendChild(ini);
	ini.querySelector(".AttackBonus").addEventListener("blur", BlurAttackBonus);
	ini.querySelector(".AttackBonus").addEventListener("focus", FocusAttackBonus);
});

body.addEventListener("change", function(e) {
	if(!e.target.classList.contains("AttackBonus")) {
	var AttackBonuses = $$(".AttackBonus");
	for(var i = 0; i < AttackBonuses.length; i++) {
		FocusAttackBonus(AttackBonuses[i]);
		BlurAttackBonus(AttackBonuses[i]);
	}
}
});

body.addEventListener("click", function(e) {
	if(e.target.classList.contains("RemoveAttack"))
		RemoveAttack(e.target);
});

$(".AttackBonus").addEventListener("blur", function(e) {
	if(e.target.classList.contains("AttackBonus"))
	BlurAttackBonus(e);
});

$(".AttackBonus").addEventListener("focus", function(e) {
	if(e.target.classList.contains("AttackBonus"))
	FocusAttackBonus(e);
});

function RemoveAttack(e) {
	e.parentElement.parentElement.remove();
}

var help = "Example: 2 + strMod + intAb + pro";

function FocusAttackBonus(e) {
	if(e.target != null)
		e = e.target;
	e.value = e.nextElementSibling.innerHTML;
	e.nextElementSibling.innerHTML = help;
}

function BlurAttackBonus(e) {
	if(e.target != null)
		e = e.target;
	e.nextElementSibling.innerHTML = e.value;

	if(e.value == "") {
		e.value = "+0";
		return;
	}

	//CalculateBonus
	var v = e.value.split("+");
	var bonus = 0;

	if(e.value != null)
	for(var i = 0; i < v.length; i++) {
		var m = v[i].split("-");
		bonus += GetStat(m[0].trim());
		for(var j = 1; j < m.length; j++) {
			bonus -= GetStat(m[j].trim());
		}
	}
	e.value = (bonus >= 0) ? `+${bonus}` : bonus;
}

function GetStat(stat) {
	if(stat == "pro") {
		return parseInt($("#Proficiency").value);
	}

	if(!isNaN(stat))
		return parseInt(stat);
	if(stat.split(' ').length > 1)
		return 0;
	var newstat = $("#" + stat);
	if(newstat == null) {
		return 0;
		console.log(`${stat} not found!`);
	} else {
		return (stat.includes("Mod")) ? parseInt(newstat.children[0].innerHTML) : parseInt(newstat.value);
	}
}