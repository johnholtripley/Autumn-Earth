<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


function cleanInput($input) {
    // https://stackoverflow.com/questions/7128856/strip-out-html-and-special-characters
    $output = strip_tags($input);
    // Clean up things like &amp;
    $output = html_entity_decode($output);
    $output = mysqli_escape_string($output);
    return $output;
}	


$returnedResult = false;



/*
$recipientCharacterID = 999;
$senderCharacterID = 999;
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
        */


//if($_POST['postData']) {
$recipientCharacterID = null;
$recipientCharacterName = null;
$postedData = json_decode($_POST['postData'],true);
$postSubject = $postedData['subject'];
$postMessage = $postedData['message'];
$senderCharacterID = $postedData['senderID'];
if(isset($postedData['recipientCharacterName'])) {
    $recipientCharacterName = $postedData['recipientCharacterName'];
}
$postFromName = $postedData['fromName'];
$attachment = $postedData['attachments'];
if(isset($postedData['recipientID'])) {
    $recipientCharacterID = $postedData['recipientID'];
}
//}
        
if($recipientCharacterID == null) {
    // look up to find the id:
    $recipientCharacterID = mysqli_result(mysqli_query($connection, "SELECT charID from tblcharacters WHERE charName = '".$recipientCharacterName."'"),0);
}

if($recipientCharacterID) {
    $query = "INSERT INTO tblmail (senderID, senderName, characterID, title, mailContents, sentTime,mailRead,attachment,attachmentTaken)
    VALUES ('".$senderCharacterID."','".$postFromName."','".$recipientCharacterID."','".cleanInput($postSubject)."','".cleanInput($postMessage)."',NOW(),'0','".json_encode($attachment)."','0')";
    $result = mysqli_query($connection, $query);
    $returnedResult = "false";
    if($result) {
        $returnedResult = "true";
    }
} else if ($recipientCharacterName != null) {
    // might be an NPC who could create a reply (like Animal Crossing?):
    // #####################
}

header('Content-Type: application/json');
// return success or fail:
echo '{"success":"'.$returnedResult.'"}';


?>