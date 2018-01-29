<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

 // if no quest id is passed in, then get all active

 $markupToOutput = '<ol><li>one</li><li>two</li></ol>';
$regions = array("Teldrassil","Kalimdor");

// create JSON response:
echo '{"markup": ["'.addcslashes($markupToOutput, '"\\/').'"],"regions": '.json_encode($regions).'}';

 
 
?>