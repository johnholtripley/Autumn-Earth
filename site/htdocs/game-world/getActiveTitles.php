<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");

$whichIds = '';
if(isset($_GET["whichIds"]));
$whichIds = $_GET["whichIds"];
 
$allIds = explode("|", $whichIds);
$titleIdString="";

for($i=0;$i<count($allIds);$i++) {
	if($i!=0) {
		$titleIdString.=", ";
	}
	$titleIdString .= intval($allIds[$i]);
}

$query = "SELECT * FROM tbltitles where titleid in (".$titleIdString.")";
$result = mysql_query($query) or die ();


$outputJson = '{';

while ($row = mysql_fetch_array($result)) {
	extract($row);
	
	$outputJson .= '"'.$titleID.'": "'.$titleName.'",';

}

// remove last comma:

$outputJson = rtrim($outputJson, ",");

$outputJson .= '}';

echo $outputJson;

?>