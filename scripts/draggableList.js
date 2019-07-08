(function() {



var body = document.body;

var selected = {
	element: null,
	offsetY: 0,
	moveDistance: 0,
	isMoving: false,
	parent: null,
	elementIndex: 0,
	childHeight: 0,
};

window.addEventListener("mousemove", function(e) {
	if(selected.element != null) {
		selected.moveDistance += e.movementY;
		if(Math.abs(selected.moveDistance) > 5 && !selected.isMoving) {
			selected.isMoving = true;
			selected.element.style.opacity = "0.6";
			var width = selected.element.clientWidth;

			selected.element.style.zIndex = 10;

			var paddingLeft = window.getComputedStyle(selected.element, null).getPropertyValue('padding-left');
			var paddingRight = window.getComputedStyle(selected.element, null).getPropertyValue('padding-right');

			selected.childHeight = e.target.clientHeight;
			selected.parent = selected.element.parentElement;
			while(selected.parent.children[selected.elementIndex] != selected.element && selected.elementIndex < selected.parent.children.length)
				selected.elementIndex++;

			var left = selected.parent.getBoundingClientRect().left;
			body.appendChild(selected.element);

			width -= parseInt(paddingLeft) + parseInt(paddingRight);
			selected.element.style.position = "absolute";

			selected.element.style.width = width + "px";
			if(isNaN(left))
				left = 0;
			var parentLeft = window.getComputedStyle(selected.parent, null).getPropertyValue('left');
			if(!isNaN(parseInt(parentLeft)))
				left += parseInt(parentLeft);
			selected.element.style.left = `${parseInt(left) + 20}px`;
			selected.moveDistance += ((selected.elementIndex) * selected.childHeight) + (selected.childHeight / 2);
		}
		if(selected.isMoving) {
			selected.element.style.top = `${parseInt(e.y) - selected.offsetY}px`;
			if(selected.parent.children[selected.elementIndex] != null)
				selected.parent.children[selected.elementIndex].classList.remove("insertBeforeDraggableListElement");
			var childrenIndex = selected.moveDistance / parseInt(selected.childHeight);
			childrenIndex = parseInt(childrenIndex);
			childrenIndex = Math.max(childrenIndex, 0);
			selected.elementIndex = childrenIndex;
			if(selected.parent.children[selected.elementIndex] != null)
				selected.parent.children[childrenIndex].classList.add("insertBeforeDraggableListElement");

		}

	}

});
window.addEventListener("mousedown", function(e) {
	if(selected.element == null && e.target.matches(".draggable.listElement")) {
		selected.element = e.target;

		selected.offsetY = e.offsetY;
		selected.moveDistance = 0;
		selected.isMoving = false;

	}

});
window.addEventListener("mouseup", function(e) {
	if(selected.element != null && selected.isMoving) {
		selected.element.style.position = "relative";
		selected.element.style.left = "0px";
		selected.element.style.top = "0px";
		selected.element.style.opacity = "1";
		selected.element.style.width = "";
		if(selected.parent.children[selected.elementIndex] != null)
			selected.parent.children[selected.elementIndex].classList.remove("insertBeforeDraggableListElement");
		selected.parent.insertBefore(selected.element, selected.parent.children[selected.elementIndex]);
		selected.element.style.zIndex = 0;

		selected.offsetY = 0;
		selected.moveDistance = 0;
		selected.elementIndex = 0;

	}
	selected.element = null;
});

})();