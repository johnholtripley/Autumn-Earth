<?php
  
    // set up exit doors from each dungeon to the originating map: [destination map number][centre entrance door x and y][tile x and y when leaving dungeon][item frequency][items available][index for this dungeon in Flash's randomDungeons array][level-locked NPCs [npc details, earliest level possible to meet them on, latest level they can be encountered on] ][level-locked templates [xml file name, earliest level possible, latest level possible] ] [npc range min, npc range max]
$dungeonDetails = array(
'the-barrow-mines' => array(
"1",
array("25","35"),
array("16,20","17,20","18,20"),
array(1,1,2,2,3,4,5,6,7,8,9),
array("6","6","6","6","2","2","3","22","35","25","26","27"),
"1",
array(array("2,0,5,lockedNPCPos,lockedNPCDir,0,0,0,Red Diamond Collector,0,4.3,1,5,6,7",1,1), array("2,0,5,lockedNPCPos,lockedNPCDir,0,0,0,Dwarven Curator,0,4.3,1,5,13",1,1)),
array(array(0,1,1), array(1,2,2)),
array(4,8)
)
);




?>