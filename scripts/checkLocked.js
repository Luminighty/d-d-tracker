(function() {
	setInterval(function() {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				if(xmlhttp.responseText.startsWith("false")) {
					window.location = "503.html";
				} else if(xmlhttp.responseText.endsWith("true")) {
					console.warn("Site is locked!");
				}
			}
		}
		xmlhttp.open("GET", "php/isLocked.php", true);
		xmlhttp.send();
	}, 5000);

})();
