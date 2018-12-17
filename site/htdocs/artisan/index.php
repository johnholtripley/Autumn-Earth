<?php




include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>






</head>

<body>
	<div id="artisanSection">
<h1>Artisan workshop</h1>
<?php

// show the contents if a character name is provided, or one isn't provided, but the user is logged in (then show theirs)

$characterNameToUse = '';
if (isset($_GET['account'])) {
$characterNameToUse = $_GET['account'];
} else {
	if(isset($_SESSION['username'])){

	$query3 = "select tblcharacters.cleanURL from tblcharacters inner join tblacct on tblacct.currentCharID = tblcharacters.charID where tblacct.accountName='".$_SESSION['username']."'";
	$result3 = mysqli_query($connection, $query3) or die ("couldn't execute query3");
	$returned3 = mysqli_num_rows($result3);
	if ($returned3 > 0) {

		$row3 = mysqli_fetch_array($result3);
		$characterNameToUse = $row3['cleanURL'];
	}
mysqli_free_result($result3);

	}
}



if ($characterNameToUse != '') {
	// see if this account exists:

$query = "select * from tblcharacters where cleanURL='".$characterNameToUse."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
			$returned = mysqli_num_rows($result);
		if ($returned > 0) {
		$row = mysqli_fetch_array($result);
			extract($row); 
			echo '<h2>'.$charName.'&apos;s creations</h2>';
			// get all uploaded Artisan items:
			// #######

$filesFound = array();
$dir = "../images/user-generated/chr".$charID."/";
    if (is_dir($dir)) {
    
        if ($dirHandle = opendir($dir)) {
            while (($file = readdir($dirHandle)) !== false) {
                if (is_file($dir . '/' . $file)) {

                    array_push($filesFound, $file);
                    
                }
            }
            closedir($dirHandle);
        }
    }
    if(count($filesFound) < 1) {
echo '<p>No items found.</p>';
    } else {
    
foreach ($filesFound as $fileName) {
    echo '<img src="'.$dir.$fileName.'" style="width:auto;height:auto;"><button class="deleteImageFile" data-filename="'.$fileName.'">delete</button>';
}


    }




} else {
		echo '<p>Sorry - couldn\'t find that account</p>';
 header("HTTP/1.0 404 Not Found");
}

mysqli_free_result($result);
	
}








?>

<?php 
$shouldShowForm = false;


if(isset($_SESSION['username'])){
if (!isset($_GET['account'])) {
$shouldShowForm = true;
} else {
	
	// make sure the URL account and session account match:


$query2 = "select tblcharacters.cleanURL from tblcharacters inner join tblacct on tblacct.currentCharID = tblcharacters.charID where tblacct.accountName='".$_SESSION['username']."'";

$result2 = mysqli_query($connection, $query2) or die ("couldn't execute query2");
$returned2 = mysqli_num_rows($result2);
		if ($returned2 > 0) {
			$row2 = mysqli_fetch_array($result2);
	
			if($row2['cleanURL'] == $_GET['account']) {
$shouldShowForm = true;
			}
			}
mysqli_free_result($result2);
;

}
}

if($shouldShowForm) {

?>

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


<input id="Filedata" class="fileInput" name="Filedata" data-multiple-caption="{count} files selected" multiple="" type="file" accept="image/*,capture=camera">
<label class="fileInputLabel" for="Filedata">
<span>Choose a file</span>
</label>


<br>
<br>
<input type="submit" value="upload image" id="uploadSubmitButton">
</fieldset>
</form>

<?php 

}
?>

</div>


<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
