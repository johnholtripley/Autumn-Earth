<?php




$chr = $_POST['chr'];
$isADungeon = false;
if(isset($_GET['dungeonName'])) {
$dungeonName = $_GET['dungeonName'];
$isADungeon = true;
}
$currentMap = $_POST['currentMap'];

$img = $_POST['data'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);
if ($isADungeon) {
$fileName = '../data/chr'.$chr.'/cartography/'.$dungeonName.'/mask'.$currentMap.'.png';
} else {
$fileName = '../data/chr'.$chr.'/cartography/mask'.$currentMap.'.png';	
}
file_put_contents($fileName, $fileData);
?>