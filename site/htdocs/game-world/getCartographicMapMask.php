<?php




$chr = $_GET['chr'];
$dungeonName = $_GET['dungeonName'];
$currentMap = $_GET['currentMap'];

$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';

$fileName = '../data/chr'.$chr.'/cartography/'.$dungeonName.'/mask'.$currentMap.'.png';


 if (is_file($fileName)) {
 
           header("Location: ".$protocol.$_SERVER['SERVER_NAME'] . "/".$fileName);
        } else {
        	// no mask found:
        	
       	header("Location: ".$protocol.$_SERVER['SERVER_NAME'] . "/images/cartography/blank-mask.png");
        }







?>