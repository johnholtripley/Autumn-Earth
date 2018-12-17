var artisan = {

    init: function() {
        var removeButtons = document.querySelectorAll(".deleteImageFile");
        for (var i = 0; i < removeButtons.length; i++) {
            removeButtons[i].onclick = artisan.removeFile;
        }
    },

    removeFile: function(e) {
        var whichFile = e.target.getAttribute('data-filename');
        //confirm prompt #########

        getJSON("/artisan/remove-file.php?filename=" + whichFile, function(data) {
            console.log("deleted", data);
            if (data) {
                if (data.success == 'true') {
                    // if successful show it deleted:
                    e.target.style.display = 'none';
                    e.target.previousElementSibling.style.display = 'none';
                    console.log("deleted ok");
                } else {
                    // otherwise show error  ####
                    console.log("couldn't be deleted");
                }
            }
        }, function(status) {
            console.log("error");
            // show error
        });
    }
}

if (document.getElementById('artisanSection')) {
    artisan.init();
}