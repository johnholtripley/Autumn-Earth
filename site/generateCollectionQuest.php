<?PHP

// create an item with those items in
// graphic of that item when opened just shows lines where entries go
// as encountered, name of item is filled in
// first time turned = item reward
// subsequent times, just gold

// NPC gives 'incomplete collection' item. Once complete, this then changes id and becomes a 'complete collection' item - and this is what the quest is looking for to 'close' the quest and give the hero the reward

$thisMapsId = $_GET["requestingZone"];
if(is_numeric($thisMapsId)) {
  // determine 'zone' that this map belongs to
  // ####################
} else {
// is a random map and the clean URL of the name is passed through
  $thisDungeonsName = $thisMapsId;
  // load config for this dungeon:
  include("includes/dungeonMapConfig.inc");
  $allStandardItems = $dungeonDetails[$thisDungeonsName][4];
  // get level locked items:
  $dir = "templates/dungeon/".$thisDungeonsName."/level-locked/";
  for ($i = 0;$i < count($dungeonDetails[$thisDungeonsName][7]);$i++) {
    $thisTemplateToLoad = $dungeonDetails[$thisDungeonsName][7][$i][0];
    $templateToLoad = $dir.$thisTemplateToLoad.".xml";
    $xmlparser = xml_parser_create();
    xml_set_element_handler($xmlparser, "XMLTemplateStartTag", "XMLEndTag");
    xml_set_character_data_handler($xmlparser, "XMLTemplateTagContents");
    $fp = fopen($templateToLoad, "r");
    while ($data = fread($fp, 4096)) {
      // remove whitespace:
      $data = eregi_replace(">" . "[[:space:]]+" . "<", "><", $data);
      if (!xml_parse($xmlparser, $data, feof($fp))) {
        // error handling - #####
      } 
    }
    xml_parser_free($xmlparser);
  }
  // remove duplicates:
  $allPossibleItems = array_unique($allStandardItems);
  
  
  // remove things like chest, treasure map and event activator
  $exclusionList = array(22,35,44);
  $allPossibleItems = array_diff($allPossibleItems, $exclusionList);
  
  
  // return zone name for inclusion in the item's tooltip:
  $zoneName = ucwords(str_replace("-", " ", $thisMapsId));
  // zoneRequesting is used to match up this data with the requesting item
  echo "catalogueListOK=true&allItems=".implode(",", $allPossibleItems)."&zoneRequesting=".$thisMapsId."&zoneName=".$zoneName;
} 

function XMLTemplateStartTag($parser, $name, $attribs) {
  global $elementType;
  $elementType = strtolower($name);
}

function XMLEndTag($parser, $name) {
  
}

function XMLTemplateTagContents($parser, $data) {
  global $elementType, $allStandardItems;
  if($elementType == "item") {
    $thisItemArray = explode(",",str_ireplace(" ", "", $data));
    $thisItemType = $thisItemArray[2];
    array_push($allStandardItems, $thisItemType);
  }
}

?>