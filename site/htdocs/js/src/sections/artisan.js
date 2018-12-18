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
            if (data) {
                if (data.success == 'true') {
                    // if successful show it deleted:
                    e.target.style.display = 'none';
                    e.target.previousElementSibling.style.display = 'none';
                } else {
                    artisan.removeFileError(e.target);
                }
            }
        }, function(status) {
            artisan.removeFileError(e.target);
        });
    },

    removeFileError: function(whichElement) {
        whichElement.insertAdjacentHTML('afterend', '<div class="error">Couldn\'t delete the file - please try again</div>');
    }
}

if (document.getElementById('artisanSection')) {
    artisan.init();
}