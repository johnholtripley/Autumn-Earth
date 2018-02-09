<?php




$chr = $_POST['chr'];
$dungeonName = $_POST['dungeonName'];
$currentMap = $_POST['currentMap'];



$img = $_POST['data'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);

if(intval($currentMap)<0) {
$fileName = '../data/chr'.$chr.'/cartography/'.$dungeonName.'/mask'.$currentMap.'.png';
} else {
$fileName = '../data/chr'.$chr.'/cartography/mask'.$currentMap.'.png';	
}
file_put_contents($fileName, $fileData);
?>