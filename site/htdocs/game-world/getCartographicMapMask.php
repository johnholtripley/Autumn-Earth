<?php




$chr = $_GET['chr'];

$currentMap = $_GET['currentMap'];

$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';

$isADungeon = false;
if(isset($_GET['dungeonName'])) {
$dungeonName = $_GET['dungeonName'];
$isADungeon = true;
}
if ($isADungeon) {
$fileName = '../data/chr'.$chr.'/cartography/'.$dungeonName.'/mask'.$currentMap.'.png';
} else {
	$fileName = '../data/chr'.$chr.'/cartography/mask'.$currentMap.'.png';
}

 if (is_file($fileName)) {
 
           header("Location: ".$protocol.$_SERVER['SERVER_NAME'] . "/".$fileName);
        } else {
        	// no mask found:
        	
       	header("Location: ".$protocol.$_SERVER['SERVER_NAME'] . "/images/cartography/blank-mask.png");
        }







?>