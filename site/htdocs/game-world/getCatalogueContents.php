<?php
 
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

if(isset($_GET["itemIds"])) {
$idsRequired = $_GET["itemIds"];
$catalogueName = $_GET["name"];
$allIdsRequired = explode("|",$idsRequired);
$markupToOutput = createCatalogueMarkup($allIdsRequired, $catalogueName, 'active');

echo '{"markup": "'.addcslashes($markupToOutput, '"\\/').'"}';

} 
 
?>