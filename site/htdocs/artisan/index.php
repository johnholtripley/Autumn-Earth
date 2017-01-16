<?php




include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>






</head>

<body>




<form enctype="multipart/form-data" id="dragAndDropUpload" action="upload.php" method="post">
<fieldset>
<input type="radio" name="skew" id="skew0" value="0" checked="checked"> <label for="skew0"><span></span>don't convert to iso</label>
 | 
<input type="radio" name="skew" id="skew1" value="1"> <label for="skew1"><span></span>skew left</label>
 | 
<input type="radio" name="skew" id="skew2" value="-1"> <label for="skew2"><span></span>skew right</label>
<br>
<br>
<input type="radio" name="imagesizing" id="imgsizing1" value="crop"> <label for="imgsizing1"><span></span>crop image</label>
 | 
<input type="radio" name="imagesizing" id="imgsizing2" value="scale" checked="checked"> <label for="imgsizing2"><span></span>scale image</label>
<br>
<br>
<input type="hidden" name="MAX_FILE_SIZE" value="1024000">
<input type="hidden" name="sentViaAJAX" value="false">

<progress max="100" id="progessBar"><img src="/images/uploading.gif" alt="Uploading..."></progress>


<input id="Filedata" class="fileInput" name="Filedata" data-multiple-caption="{count} files selected" multiple="" type="file">
<label class="fileInputLabel" for="Filedata">
<span>Choose a file</span>
</label>


<br>
<br>
<input type="submit" value="upload image" id="uploadSubmitButton">
</fieldset>
</form>






<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
