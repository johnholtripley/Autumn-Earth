<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");



$json ='{
"mapNumber": 3,
"shops": [
{
	"name":"shop #1",
	"uniqueItems":[6,19],
	"shopSpecialism": 2,
	"categories": [1,2],
	"size":"large",
	"currency":"money"
},
{
	"name":"shop #2",
	"uniqueItems":[],
	"shopSpecialism": null,
	"categories": [3],
	"size":"small",
	"currency":"money"
}
]

}';

$jsonData = json_decode($json, true);



// get colours:
$coloursQuery = "SELECT * from tblcolours";
$allColours = [];
$colourResult = mysql_query($coloursQuery) or die ("recipes failed");
while ($colourRow = mysql_fetch_array($colourResult)) {
	extract($colourRow);
	array_push($allColours, $colourName);
}

for ($i=0;$i<count($jsonData['shops']);$i++) {
echo "<h4>".$jsonData['shops'][$i]["name"]."</h4>";
$query2 = "SELECT tblinventoryitems.* from tblinventoryitems where tblinventoryitems.itemcategories in (".implode(",",$jsonData['shops'][$i]["categories"]).") order by tblinventoryitems.shortname ASC";

$result2 = mysql_query($query2) or die ("recipes failed:".$query2);

while ($row = mysql_fetch_array($result2)) {
	extract($row);
	echo $shortname."<br>";
}

}




?>