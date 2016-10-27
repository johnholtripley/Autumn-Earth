<?php



// make changes to xml




$ChangesSavedOk = "true";


$thismapnumber = intval($_POST["currentmap"]);

if($thismapnumber<0) {
// dungeon map:

		$whichmap = "data/chr" . $_POST["username"] . "/dungeon/".$_POST["cleanDungeonURL"]."/" . $thismapnumber . ".xml";
} else {


		$whichmap = "data/chr" . $_POST["username"] . "/map" . $thismapnumber . ".xml";
		}
		
		
		//create parser
		if(!($parser = xml_parser_create("UTF-8"))) {
			//return error
				$ChangesSavedOk = "false";
		} 
		$skipwhite = xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
		$stopcasefolding = xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
			
		
		//get entire file
		if (!($fp = fopen($whichmap, "r"))) {
			//return error
			//return how far through changes the php got, and then completely stop all php script
			$ChangesSavedOk = "false";
		} 
		$data = fread($fp, filesize($whichmap));
	//parse file into array
		xml_parse_into_struct($parser, $data, $structure, $index);
		//destroy parser
		xml_parser_free($parser);
		// close file
		fclose($fp);


$xmlRows = "";

$thisrowarray = explode("|", $_POST["mapData"]);

	for($ri=0; $ri<count($thisrowarray); $ri++) {
				$xmlRows .= "<row>" . $thisrowarray[$ri] . "</row>";
			}
			
			$xmlstringEnd = "";

foreach($structure as $s) {
			if ($s["type"] == "open") {
				// is the map node, so create the initial part of the xml (as these values won't change)
				$xmlstringStart = '<?xml version="1.0" encoding="UTF-8"?><map mname="'. $s['attributes']['mname'] . '" inside="' . $s['attributes']['inside'] . '" maxheight="' .$s['attributes']['maxheight']. '">';
			} else if (($s["tag"] != "row") && ($s["type"] != "close")) {
				// ignore <rows>s as these will be overwritten
			$xmlstringEnd .= "<".$s["tag"].">";
			$xmlstringEnd .= $s["value"];
			$xmlstringEnd .= "</".$s["tag"].">";
		}
}

$xmlstringEnd .= "</map>";



$xmlFinalOutput = $xmlstringStart.$xmlRows.$xmlstringEnd;



	if(!($savefilename=fopen($whichmap,"w"))) {
			//return error
			$ChangesSavedOk = "false";
		}
		
		fwrite($savefilename, $xmlFinalOutput); 
		fclose($savefilename);


// send variable to flash: 
print "changeswassuccess=".$ChangesSavedOk;
?>