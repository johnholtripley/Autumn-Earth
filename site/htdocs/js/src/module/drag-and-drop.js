var dragAndDropForm = document.getElementById('dragAndDropUpload');

var isAdvancedUpload = function() {
    // https://css-tricks.com/drag-and-drop-file-uploading/
    return (('draggable' in dragAndDropForm) || ('ondragstart' in dragAndDropForm && 'ondrop' in dragAndDropForm)) && 'FormData' in window && 'FileReader' in window;
};

function dragDropEnter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragDropOver(e) {
    e.stopPropagation();
    e.preventDefault();
    dragAndDropForm.classList.add('isDraggedOver');
}

function dragDropLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    dragAndDropForm.classList.remove('isDraggedOver');
}

function dragDropDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    dragAndDropForm.classList.remove('isDraggedOver');
    var files = e.dataTransfer.files;
    dragDropHandleFiles(files);
}

function dragDropHandleFiles(files) {
    for (var i = 0; i < files.length; i++) {
        dragDropFileUpload(files[i]);
    }
}

function unloadPrompt(e) {
var confirmationMessage = "Upload not complete - are you sure want to leave this page yet?";
  e.returnValue = confirmationMessage;     
  return confirmationMessage;   
}

function dragDropFileUpload(file) {


window.addEventListener("beforeunload", unloadPrompt, false);


    // https://developer.mozilla.org/en/docs/Using_files_from_web_applications
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    progressBar = document.getElementById('progessBar');
    this.xhr = xhr;
    this.xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) {
           
            progressBar.value = Math.round((e.loaded * 100) / e.total);
        }
    }, false);

    xhr.upload.addEventListener("load", function(e) {
        window.removeEventListener("beforeunload", unloadPrompt, false);
        progressBar.value = '100';
    }, false);

    xhr.open("POST", dragAndDropForm.getAttribute('action'));

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        	progressBar.classList.remove('active');
            alert(xhr.responseText); // handle response.
        }
    };

    fd.append('Filedata', file);
    fd.append('sentViaAJAX', 'true');


    // send the form radio buttons for the Artisan section:

var radios = document.getElementsByName("skew");
if (radios) {
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
        	fd.append('skew', radios[i].value);
            
        }
    }
}
var radios = document.getElementsByName("imagesizing");
if (radios) {
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
        	fd.append('imagesizing', radios[i].value);
            
        }
    }
}

// send the form checkbox for Music section:
var checkbox = document.getElementsByName("switchInput");
if(checkbox) {
	fd.append('switchInput', checkbox.value);
}

    xhr.send(fd);
    progressBar.classList.add('active');
}


if(dragAndDropForm) {
    
if (isAdvancedUpload) {
    dragAndDropForm.classList.add('canDragAndDrop');
    dragAndDropForm.addEventListener("dragenter", dragDropEnter, false);
    dragAndDropForm.addEventListener("dragover", dragDropOver, false);
    dragAndDropForm.addEventListener("dragleave", dragDropLeave, false);
    dragAndDropForm.addEventListener("dragend", dragDropLeave, false);
    dragAndDropForm.addEventListener("drop", dragDropDrop, false);
}
}
