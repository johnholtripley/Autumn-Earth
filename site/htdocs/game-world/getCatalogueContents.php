<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");



if(isset($_GET["itemIds"])) {
 
$idsRequired = $_GET["itemIds"];
$allIdsRequired = explode("|",$idsRequired);
$catalogueName = $_GET["name"];

echo createCatalogueMarkup($allIdsRequired, $catalogueName);


} 





 
 
?>