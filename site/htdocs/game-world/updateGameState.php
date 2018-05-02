<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


$chr = $_GET['chr'];


// get type of action:
$action = $_GET['action'];

$field = $_GET['field'];
$value = $_GET['value'];


switch ($action) {
    case "add":
     // get the current value and append it:
    $query = 'select '.$field.' from tblcharacters where charID = "'.$chr.'"';

 $result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
  while ($row = mysqli_fetch_array($result)) {
    //extract($row);
   
    // check for [] to see if it's an array:
    $closingSquareBracketPos = strrpos($row[$field], ']');
if ($closingSquareBracketPos !== false) {
	$alteredValue = substr($row[$field], 0, $closingSquareBracketPos).','.urldecode($value).']';
} else {
	// just a string:
	$alteredValue = $row[$field].','.urldecode($value);
}




}


// insert this new value:

$query2 = "UPDATE tblcharacters SET ".$field."='".$alteredValue."' where charID = '".$chr."'";
$result2 = mysqli_query($connection, $query2);

}


        break;
    case "set":
       //
        break;
  
}




?>