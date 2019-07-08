(function(){
    var modal = document.getElementById('questModal');
    var btn = document.getElementById("questCreator");
    var span = document.getElementById("questClose");

    btn.onclick = function() {
        //set it to be NEW
        id = "new";
        modal.querySelector("h2").innerHTML = "Create Quest";
        $(".questOK").innerHTML = "Create";
        modal.querySelector("#questTitle").value = "";
        modal.querySelector("#questDescription").value = "";
        modal.querySelector("#questComplete").checked = false;

        modal.style.display = "block";
    }

    var id = "new";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    $(".questCancel").addEventListener("click", function(e) {
        modal.style.display = "none";
    });
    var descriptionLabel = $("#descriptionLength");

    function UpdateDescription(e) {
        descriptionLabel.innerHTML = `(${e.value.length}/500)`;
        if(e.value.length > 500) {
            descriptionLabel.style.fontWeight = "bold";
            descriptionLabel.style.color = "#FF0000";
        } else {
            descriptionLabel.style.fontWeight = "normal";
            descriptionLabel.style.color = "#000000";
        }
    }

    $("#questDescription").addEventListener("keyup", function(e) {UpdateDescription(e.target)});

    $(".questOK").addEventListener("click", function(e) {

        var quest = {
            id: id,
            title: modal.querySelector("#questTitle").value,
            description: modal.querySelector("#questDescription").value,
            completed: modal.querySelector("#questComplete").checked
        };
        if(quest.completed == null)
            completed = false;

        if(quest.description.length > 500) {
            descriptionLabel.classList.add("alertError");
            ;
            setTimeout(function() {descriptionLabel.classList.remove("alertError");}, 300);
            
            return;
        }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                var tr;
                if(id == "new") {
                    var prefab = $("#questPrefab");
                    tr = prefab.cloneNode(true);
                    tr.id = "quests_" + this.responseText;

                    tr.removeAttribute("hidden")
                    var lastChild = prefab.parentElement.lastChild;
                    if(!quest.completed)
                        lastChild = prefab.parentElement.querySelector(".completedQuest");
                    prefab.parentElement.insertBefore(tr, lastChild);
                } else {
                    tr = $("#quests_" + id);
                }
                tr.querySelector(".questTitle").innerHTML = quest.title;
                tr.querySelector(".questDescription").innerHTML = quest.description;
                if(quest.completed) {
                    tr.classList.add("completedQuest");
                } else {
                    tr.classList.remove("completedQuest");
                }
                //Log(this.responseText);
                var noQuests = $("#noQuests");
                if(noQuests != null)
                    noQuests.remove();
            }
        }
        var tr = GetElementInParents(e.target, "tr");
        xmlhttp.open("POST", "php/quest_save.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("x=" + JSON.stringify(quest));


        modal.style.display = "none";
    });

    function deleteQuest(e) {
        
        if(confirm("This will delete the quest")) {
            GetContainer(e).remove();
        }
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        var p = GetElementInParents(event.target, ".modal-content");
        if (p == null && event.target != btn) {
            modal.style.display = "none";
        }
    }

    document.body.addEventListener("click", function(e) {
        if(e.target.classList.contains("editQuest")) {
            //console.log(e);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                //Log(this.responseText);


                if(this.readyState == 4 && this.status == 200 && this.responseText != "") {
                    var dung = JSON.parse(this.responseText);
                    modal.querySelector("h2").innerHTML = "Edit Quest";
                    modal.querySelector("#questTitle").value = dung.title;
                    modal.querySelector("#questDescription").value = dung.description;
                    UpdateDescription($("#questDescription"));
                    modal.querySelector("#questComplete").checked = dung.completed;
                    $(".questOK").innerHTML = "Update";
                    id = dung.id;

                    modal.style.display = "block";
        
                }
            }
            var tr = GetElementInParents(e.target, "tr");
            xmlhttp.open("POST", "php/quest_load.php", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("id=" + new String(tr.id).replace("quests_", ""));
            //LOAD QUEST FOR EDITING
        }
        if(e.target.classList.contains("removeQuest")) {
            var tr = GetElementInParents(e.target, "tr");

            if(!confirm("This will delete '" + tr.querySelector(".questTitle").innerHTML.toUpperCase() + "' forever!\nAre you sure you want to continue?"))
                return;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    Log(this.responseText);
                    tr.remove();
                    
                }
            }
            xmlhttp.open("POST", "php/quest_delete.php", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("id=" + new String(tr.id).replace("quests_", ""));


        }
    });
})();