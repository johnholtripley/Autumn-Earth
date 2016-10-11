<?php


//print_r($_POST);

// data\chr999\cartography

$chr = $_POST['chr'];
$dungeonName = $_POST['dungeonName'];
$currentMap = $_POST['currentMap'];

$img = $_POST['data'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);

$fileName = '../data/chr'.$chr.'/cartography/'.$dungeonName.'/mask'.$currentMap.'.png';
file_put_contents($fileName, $fileData);
?>