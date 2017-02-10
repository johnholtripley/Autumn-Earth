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
	"size":"large"
},
{
	"name":"shop #2",
	"uniqueItems":[],
	"shopSpecialism": null,
	"categories": [3],
	"size":"small"
}
]

}';

$jsonData = json_decode($json, true);

echo $jsonData['mapNumber'];
echo $jsonData['shops'][0]["name"];
?>