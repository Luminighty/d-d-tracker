(function(){

    var currentModal = null;


    // When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
    var p = GetElementInParents(event.target, ".modal-content");
    if (p == null && currentModal != null && !event.target.id.startsWith("modalOpen_")) {
        currentModal.style.display = "none";
    }
});


    document.body.addEventListener("click", function(e) {
        if(e.target.classList.contains("modal_Close") || e.target.classList.contains("modal_Cancel"))
            GetElementInParents(event.target, ".modal").style.display = "none";

        
            if(e.target.id.startsWith("modalOpen_")) {
                currentModal = $("#" + e.target.id.substring("modalOpen_".length) + "Modal");
                currentModal.style.display = "block";
            }
    });
})();