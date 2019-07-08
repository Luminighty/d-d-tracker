(function() {
	
	window.addEventListener("click", function(e) {
		if(!e.target.classList.contains("listElement") || !e.target.classList.contains("selectable"))
			return;
		if(e.target.parentElement.classList.contains("multipleSelect")) {
			console.log("multipleSelect")
			if(e.target.classList.contains("active")) {
				e.target.classList.remove("active");

			} else {
				e.target.classList.add("active");
			}

		} else {
			var active = e.target.parentElement.querySelector(".active.listElement.selectable");
			if(active != e.target) {
				if(active != null)
					active.classList.remove("active");
				e.target.classList.add("active");
			}
		}

	})

})();