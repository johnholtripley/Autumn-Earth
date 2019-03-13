<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

 // if no quest id is passed in, then get all active
$isAnUpdate = true;

$chr = $_GET["chr"];



if(isset($_GET["questID"])) {
    // it's set, just find the details for the quest and return it as an update
$activeQuests = array($_GET["questID"]);
$isAnUpdate = true;
$journalMarkupToOutput = '';
$numberOfQuests = 1;
} 


include($_SERVER['DOCUMENT_ROOT']."/includes/questJournalEntry.php");




// create JSON response:
echo '{"markup": ["'.addcslashes($journalMarkupToOutput, '"\\/').'"],"regions": '.json_encode($regions).'}';

 
 
?>