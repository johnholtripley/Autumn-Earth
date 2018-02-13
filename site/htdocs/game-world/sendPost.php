<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


 	

$senderCharacterID = 999;
$recipientCharacterID = 999;
$postFromName = 'Tester person';
 $postSubject = 'Curiouser and curiouser';
 $postMessage = "'Curiouser and curiouser!' cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); 'now I'm opening out like the largest telescope that ever was! Good-bye, feet!' (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off). 'Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can; --but I must be kind to them,' thought Alice, 'or perhaps they won't walk the way I want to go! Let me see: I'll give them a new pair of boots every Christmas.'";
 $attachment = '{
            "type": 3,
            "quantity": 10,
            "quality": 100,
            "durability": 100,
            "currentWear": 0,
            "effectiveness": 100,
            "colour": 0,
            "enchanted": 0,
            "hallmark": 0,
            "inscription": ""
        }';


if($_POST['postData']) {
$postedData = json_decode($_POST['postData'],true);
$postSubject = $postedData['subject'];
$postMessage = $postedData['message'];
$senderID = $postedData['senderID'];
}

        



$query = "INSERT INTO tblmail (senderID, senderName, characterID, title, mailContents, sentTime,mailRead,attachment,attachmentTaken)
	VALUES ('".$senderCharacterID."','".$postFromName."','".$recipientCharacterID."','".mysql_escape_string($postSubject)."','".mysql_escape_string($postMessage)."',NOW(),'0','".$attachment."','0')";

	 $result = mysql_query($query);
$returnedResult = "false";
if($result) {
	$returnedResult = "true";
}

header('Content-Type: application/json');
// return success or fail:
echo '{"success":"'.$returnedResult.'"}';


?>