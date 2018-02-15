<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

header('Content-Type: application/json');


// trim the first 11 characters to get the MD5 hash of the mail id
$mailId = substr($_GET["id"], 11);
$hasAttachment = false;
$query = "SELECT * FROM tblmail where MD5(mailId)='".$mailId."'";

      $result = mysql_query($query);
if(mysql_num_rows($result)>0) {
  while ($row = mysql_fetch_array($result)) {
    extract($row);
    if($attachment) {
      if(!$attachmentTaken) {
        $hasAttachment = true;
        $attachmentOutput = $attachment;
      }
    }
  }
}


if($hasAttachment) {
	echo '{"item":';
	echo $attachmentOutput;
	echo ', "id": "'.$mailId.'"}';
} else {
  echo '{"item":"null"}';
}

mysql_free_result($result);

?>