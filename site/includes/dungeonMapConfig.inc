<?php
  
    // set up exit doors from each dungeon to the originating map: [destination map number][centre entrance door x and y][tile x and y when leaving dungeon][item frequency][items available][index for this dungeon in Flash's randomDungeons array][level-locked NPCs [npc details, earliest level possible to meet them on, latest level they can be encountered on] ] 
$dungeonDetails = array(
'the-barrow-mines' => array(
"1",
array("25","35"),
array("16,20","17,20","18,20"),
array(1,1,2,2,3,4,5,6,7,8,9),
array("6","6","6","6","2","2","3","22","35","25","26","27"),
"1",
array(array("npc details",2,2))
)
);




?>