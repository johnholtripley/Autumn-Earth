<?php

//include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
//include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$chr = $_GET["chr"];
$map = $_GET["map"];

header('Content-Type: application/json');
$mapDataFile = file_get_contents('../data/chr' .  $chr . '/map' . $map . '.json');

$pos = strrpos($mapDataFile, '##procedural##');
if ($pos !== false) {
    $mapData = json_decode($mapDataFile, true);
    // check for any procedural elements that need to be added:

    for($i=0;$i<count($mapData['map']['items']); $i++) {
        if(($mapData['map']['items'][$i]['type'] == 32) || ($mapData['map']['items'][$i]['type'] == 33)) {
            if(isset($mapData['map']['items'][$i]['inscription'])) {
                if($mapData['map']['items'][$i]['inscription'] == "##procedural##") {
                    // generate a book:
                    include_once($_SERVER['DOCUMENT_ROOT']."/game-world/generateBook.php");
                    $newTimeStamp = new DateTime();
                    $mapData['map']['items'][$i]['inscription'] = array();
                    $mapData['map']['items'][$i]['inscription']['title'] = createProceduralTitle();
                    $mapData['map']['items'][$i]['inscription']['timeCreated'] = $newTimeStamp->getTimestamp();
                    $mapData['map']['items'][$i]['inscription']['content'] = createProceduralBook();
                }
            }
        }
    }

    for($i=0;$i<count($mapData['map']['npcs']); $i++) {
        if($mapData['map']['npcs'][$i]['name'] == "##procedural##") {
            // create a procedural hen:
            include_once($_SERVER['DOCUMENT_ROOT']."/includes/replaceImageHue.php");
            $mapData['map']['npcs'][$i]['name'] = "Hen";
            $newColour = substr(md5(rand()), 0, 6);
            replaceHue('npcs/brown-hen.png','281108',$newColour,40);
            $mapData['map']['npcs'][$i]['src'] = "procedural/brown-hen-".$newColour.".png";
            $mapData['map']['npcs'][$i]['width'] = 20;
            $mapData['map']['npcs'][$i]['height'] = 20;
            $mapData['map']['npcs'][$i]['spriteWidth'] = 31;
            $mapData['map']['npcs'][$i]['spriteHeight'] = 29;
            $mapData['map']['npcs'][$i]['centreX'] = 21;
            $mapData['map']['npcs'][$i]['centreY'] = 24;
            $mapData['map']['npcs'][$i]['movement'] = array("-");
            $mapData['map']['npcs'][$i]['facing'] = 's';
            $mapData['map']['npcs'][$i]['walkThroughDoors'] = false;
            $mapData['map']['npcs'][$i]['speed'] = 2;
            $mapData['map']['npcs'][$i]['speech'] = array(["", "sound", "hen"]);
            $mapData['map']['npcs'][$i]['speechIndex'] = 0;
            $mapData['map']['npcs'][$i]['isCollidable'] = true;
            $mapData['map']['npcs'][$i]['isMoving'] = false;
            $mapData['map']['npcs'][$i]['animation']["walk"] = array("length"=>"1", "n"=>"0", "e"=>"0", "s"=>"0", "w"=>"0");
        }
    }

    echo json_encode($mapData);
} else {
    // no procedural content, so don't parse it, just output:
    echo $mapDataFile;
}




?>