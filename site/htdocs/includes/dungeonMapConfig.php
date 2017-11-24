<?php





$dungeonDetails = array(

'the-barrow-mines' => array(
'graphics' => '{"src": "blank.png", "centreX": 24, "centreY": 12},{"src": "block.png","centreX": 24,"centreY": 45},{"src": "red-block.png","centreX": 24,"centreY": 45},{"src": "grey-block.png","centreX": 24,"centreY": 45}',
'possibleItems' => '',
'suitableTemplates' => array(
	// template name => earliest level it can be encountered on, latest level it can be encountered on (INF or numeric):
'mining-expedition' => array(1,INF),
'store-room' => array(1,INF),
'pillar' => array(1,INF)
	)
	)
	);















// OLD FLASH VERSION:
  /*
    // set up exit doors from each dungeon to the originating map: [destination map number][centre entrance door x and y][tile x and y when leaving dungeon][item frequency][items available][index for this dungeon in Flash's randomDungeons array][level-locked NPCs [npc details, earliest level possible to meet them on, latest level they can be encountered on] ][level-locked templates [xml file name, earliest level possible, latest level possible] ] [npc quantity range min, npc range max][force mode for the first map]
$dungeonDetails = array(
'the-barrow-mines' => array(
"2",
array("11","35"),
array("1,1","2,1","3,1"),
array(1,1,2,2,3,4,5,6,7,8,9),
array("18","32"),
"1",
array(),
array(),
array(4,8),
"nest",
"zoneName"=>"The Barrow Mines",
"tileSet"=>' { "src": "blank.png", "centreX": 24, "centreY": 12 }, { "src": "dirt.png", "centreX": 24, "centreY": 24 }, { "src": "block.png", "centreX": 24, "centreY": 45 }'
)
);



$dungeonDetails = array(
'the-barrow-mines' => array(
"1",
array("11","35"),
array("1,1","2,1","3,1"),
array(1,1,2,2,3,4,5,6,7,8,9),
array("18"),
"1",
array(array("2,0,5,lockedNPCPos,lockedNPCDir,0,0,0,Red Diamond Collector,0,4.3,1,5,6,7",2,2), array("2,0,5,lockedNPCPos,lockedNPCDir,0,0,0,Dwarven Curator,0,4.3,1,5,13",2,2), array("2,0,4,lockedNPCPos,lockedNPCDir,0,0,0,Tourist,0,4.3,1,5,14,15",2,2)),
array(array(0,5,5), array(1,6,6), array(2,4,4), array(3,3,3), array(4,2,2)),
array(4,8),
"nest",
"zoneName"=>"The Barrow Mines",
"tileSet"=>' { "src": "blank.png", "centreX": 24, "centreY": 12 }, { "src": "dirt.png", "centreX": 24, "centreY": 24 }, { "src": "block.png", "centreX": 24, "centreY": 45 }'
)
);

*/


?>