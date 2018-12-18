<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
$fileWasDeleted = 'false';
if(isset($_SESSION['username'])){


// set to 'inactive' flag in DB ###

	$query2 = "select tblcharacters.charID from tblcharacters inner join tblacct on tblacct.currentCharID = tblcharacters.charID where tblacct.accountName='".$_SESSION['username']."'";
	$result2 = mysqli_query($connection, $query2) or die ("couldn't execute query2");
	$returned2 = mysqli_num_rows($result2);
	if ($returned2 > 0) {
		$row2 = mysqli_fetch_array($result2);
		$dir = "../images/user-generated/chr".$row2['charID']."/";
		$fileName = $_GET['filename'];
		$filePath = $dir.$fileName;
		if (is_file($filePath)) {
			$fileDeleted = unlink($filePath);
			if($fileDeleted) {
				$fileWasDeleted = 'true';
			}
		}
	}
	mysqli_free_result($result2);
}
echo '{"success": "'.$fileWasDeleted.'"}';
?>
