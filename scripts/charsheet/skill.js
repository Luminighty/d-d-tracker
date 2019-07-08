function $(selector) {
	return document.querySelector(selector);
}
function $$(selector) {
	return document.querySelectorAll(selector);
}

Skills = $$(".skill");


body.addEventListener("change", function(e) {
	for(var i = 0; i < Skills.length; i = i+1) {
		var Proficiency = parseInt($("#Proficiency").value);
		var e = Skills[i];
		var sibling = e.nextElementSibling;
		var text = sibling.children[0].innerHTML;
		var words = text.split(' ');
		var name = "";
		for(var j= 0; j < e.classList.length; j++) {
			if(e.classList[j].includes("Mod"))
				name = e.classList[j];
		}
		var mod = parseInt( $(`#${name}`).children[0].innerHTML);
		mod += (e.checked) ? Proficiency : 0;
		var skillname = "";
		for(var j = 1; j < words.length; j++)
			skillname += " " + words[j];
		sibling.children[0].innerHTML = (mod >= 0) ? `+${mod} ${skillname}` : `${mod} ${skillname}`;
	}
});