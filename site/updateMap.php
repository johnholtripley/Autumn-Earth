<?php



// make changes to xml
// make changes to minimap





$whichMap = $_POST["currentmap"];
$terrainType = $_POST["terraintype"];





/*
// need to be careful of whitespace before and after php tags as these will be sent to flash
// check php.ini - if script is longer than 30 seconds it will end

$ChangesSavedOk = "true";




// check that there are any changes:
if (strlen($_POST["changes"]) != 0) {

	// convert from string to 2d array:
	$changesarray = explode("_",$_POST["changes"]);
	for($i=0; $i<count($changesarray); $i++) {
		$changesarray[$i] = explode("*",$changesarray[$i]);
	}
	//



	
	// save map changes:
	
	// use while instead of do..while so that if changes is empty, then the loop won't run at all

	while (count($changesarray)>0) {

		$thismapnumber = intval($changesarray[0][0]);
		
		//create parser
		if(!($parser = xml_parser_create("UTF-8"))) {
			//return error
			//return how far through changes the php got, and then completely stop all php script
			$ChangesSavedOk = "false1";
		} 
		$skipwhite = xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
		$stopcasefolding = xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
			
		$whichmap = "data/" . $_POST["username"] . "/map" . $thismapnumber . ".xml";
		
		//get entire file
		if (!($fp = fopen($whichmap, "r"))) {
			//return error
			//return how far through changes the php got, and then completely stop all php script
			$ChangesSavedOk = $whichmap;
		} 
		$data = fread($fp, filesize($whichmap));
		//parse file into array
		xml_parse_into_struct($parser, $data, &$structure, &$index);
		//destroy parser
		xml_parser_free($parser);
		// close file
		fclose($fp);
		//setup arrays to store data:
		$rowsarray = array();
		$npcsarray = array();
		$itemsarray = array();
		$plansarray = array();
		//
		foreach($structure as $s) {
			if ($s["type"] == "open") {
				// is the map node, so create the initial part of the xml (as these values won't change)
				$xmlstringtosave = '<?xml version="1.0" encoding="UTF-8"?><map mname="'. $s['attributes']['mname'] . '" inside="' . $s['attributes']['inside'] . '">';
			}
			if ($s["tag"] == "weather") {
				// get weather value
				$weathervalue = $s["value"];
			} elseif ($s["tag"] == "npc") {
				// add npc data to the array
				array_push($npcsarray, $s["value"]);
			} elseif ($s["tag"] == "item") {
				// add item data to the array
				array_push($itemsarray, $s["value"]);
			} elseif ($s["tag"] == "row") {
				// add row data to the array
				array_push($rowsarray, $s["value"]);
			} elseif ($s["tag"] == "plans") {
				// add plan data to the array
				array_push($plansarray, $s["value"]);
			}
		}
		


		
		while (intval($changesarray[0][0]) == $thismapnumber) {
		
			// ***** apply changes to xml
		
		// $changesarray[0] - will be the element to act upon
		
			switch ($changesarray[0][1]) {
				case 5:
				//is a plans change
				
				if ($changesarray[0][2] == 1) {
				
				// is an addition
					
					array_push($plansarray, $changesarray[0][3]);
				} else {
				
				
					
					
					// is a change to currently made item:
				$plansarray[0] = $changesarray[0][3];
				}
			
				case 4:
				//is a weather change
				$weathervalue = intval($changesarray[0][2]);
				break;
				case 3:
				//is an item change
				$itemindex = $changesarray[0][2];
				if ($changesarray[0][3] == -1) {
					// is a removal
					array_splice($itemsarray, $itemindex, 1);
				} elseif ($changesarray[0][3] == "add") {
					// is an addition
					
					array_push($itemsarray, $changesarray[0][4]);
				} else {
					// is a change
					$itemsarray[$itemindex] = $changesarray[0][3];
				}
				break;
				case 2:
				// is a tile change
				
				//expand row string into array to be able to reference the correct element easily:
				
				$row = $changesarray[0][2];
				$column = $changesarray[0][3];
				
				$thisrowarray = explode(",", $rowsarray[$row]);
				// set change:
				$thisrowarray[$column] = $changesarray[0][4];
				// convert row back to string:
				$rowsarray[$row] = implode(",", $thisrowarray);
				
				
				break;
				case 1:
				// is an npc change
				if ($changesarray[0][3] == -1) {
					// is a removal
					array_splice($npcsarray, ($changesarray[0][2]), 1);
				} elseif ($changesarray[0][3] == "add") {
					// is an addition
					
					array_push($npcsarray, $changesarray[0][4]);
				} else {
					// is a change
					$npcsarray[($changesarray[0][2])] = $changesarray[0][3];
				}
				
				break;
				
				
				
				default :
				// do nothing
			}
			
		
			// then remove first element
			$removedelement = array_shift($changesarray);
	
		}
		
		// re-build xml file from the arrays into $xmlstringtosave:
			
			for($ri=0; $ri<count($rowsarray); $ri++) {
				$xmlstringtosave .= "<row>" . $rowsarray[$ri] . "</row>";
			}
			
			for($ri=0; $ri<count($npcsarray); $ri++) {
				$xmlstringtosave .= "<npc>" . $npcsarray[$ri] . "</npc>";
			}
			
			for($ri=0; $ri<count($itemsarray); $ri++) {
				$xmlstringtosave .= "<item>" . $itemsarray[$ri] . "</item>";
			}
			
						for($ri=0; $ri<count($plansarray); $ri++) {
				$xmlstringtosave .= "<plans>" . $plansarray[$ri] . "</plans>";
			}
			
			
			
			
			
		//add weather value now it has had the possibility to be changed:
		$xmlstringtosave .= "<weather>" . $weathervalue . "</weather>";
		//
		$xmlstringtosave .= "</map>";
		//
		
		//print("<br />");
		//print_r($npcsarray);
		//print("<br />");

		//

				
		if(!($filename=fopen($whichmap,"w"))) {
			//return error
			//return how far through changes the php got ($whichmap), and then completely stop all php script
			$ChangesSavedOk = $whichmap;
		}
		
		fwrite($filename, $xmlstringtosave); 
		fclose($filename);
			
	}

} 

*/
$ChangesSavedOk = $whichMap .",".$terrainType;
// send variable to flash: 
print "changeswassuccess=".$ChangesSavedOk;

?>