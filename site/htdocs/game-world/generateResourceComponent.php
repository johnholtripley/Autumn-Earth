<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/plant-latin-names.php");
$possiblePlantLatinSyllables = sortSequentialSyllables($plantLatinSyllables);
$latinName = ucfirst(selectSyllables($possiblePlantLatinSyllables,3,5));

echo '<h1 style="font-style:italic;">var. '.$latinName.'</h1>';
?>
