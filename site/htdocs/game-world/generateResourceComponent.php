<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

include($_SERVER['DOCUMENT_ROOT']."/includes/herbarium/plant-latin-names-genera.php");
$possiblePlantLatinSyllables = sortSequentialSyllables($plantLatinSyllables);
$latinName = ucfirst(selectSyllables($possiblePlantLatinSyllables,3,5));

echo '<h1 style="font-style:italic;">var. '.$latinName.'</h1>';


$totalLevels = 10;
$baseMin = 100;
$baseMax = 1000;
$itemClassLevelMax = 4;

for ($itemClassLevel=1;$itemClassLevel<=$itemClassLevelMax;$itemClassLevel++) {

echo '<div style="float:left;width: '.(100/$itemClassLevelMax).'%">';
$minCap = round(max($baseMin,$baseMin+($itemClassLevel-13/10)*($baseMax-$baseMin)/$totalLevels));
$maxCap = round(min($baseMax,$baseMin+($itemClassLevel+3/10)*($baseMax-$baseMin)/$totalLevels));

echo "min: "+$minCap."<br>";
echo "max: "+$maxCap."<br>";

for ($i=0;$i<=$totalLevels;$i++) {
	echo $i." - ".($minCap + (($maxCap-$minCap)/$totalLevels*$i))."<br>";
}
echo "</div>";

}

?>
