<?php
$thisInstrumentsId = $_GET["instrId"];
$thisSongsId = $_GET["songId"];
$thisCharId = $_GET["chr"];

if (is_numeric($thisSongsId)) {
	// ###### validate instrument name as well - with database check for all known instruments
	$songFilename = "songs/".$thisInstrumentsId."-".$thisSongsId.".mp3";
	if (is_file($songFilename)) {
		header("Location: http://www.autumnearth.com/music/".$songFilename);
	} else {
		createNewSongFile($thisInstrumentsId, $thisSongsId);
	}
}

function createNewSongFile($instrumentsId, $songsID) {
	global $thisInstrumentsId, $thisSongsId, $thisCharId;

$songPath = "../data/chr".$thisCharId."/music/";
$filename = "song".$thisSongsId.".json";
$getJsonData = file_get_contents($songPath.$filename);

	// $songListing array of elements each with [song name] [length in m/s required]
	// this comes from pre-processed ABC notation from database

/*
	$songListing = array(
	array("g4",500), 
	array("g4",500), 
	array("g4",500), 
	array("a4",500), 
	array("b4",1000), 
	array("a4",1000), 
	array("g4",500), 
	array("b4",500), 
	array("a4",500), 
	array("a4",500), 
	array("g4",1000));




$songListing = array(
	array("e4",750),
	array("f4",250),
	array("e4",250),
	array("d4",250),
	array("c4",500),
	array("as3",500),
	array("d4",500),
	array("c4",750),
	array("z4",250),
	array("g3",250),
	array("as3",250),
	array("c4",500),
		array("as3",250),
		array("g3",250),
		array("f3",500),
		array("d3",500),
		array("e3",250),
		array("f3",250),
		array("g3",500),
		array("g3",500),
		array("z4",500),
		array("c4",250),
		array("d4",250),
		array("c4",250),
		array("d4",250),
		array("e4",500),
		array("c4",500),
		array("f4",500),
		array("e4",250),
		array("d4",250),
		array("c4",500),
		array("z4",500),
		array("f4",250),
		array("e4",250),
		array("c4",500),
		array("f4",250),
		array("e4",250),
		array("f4",250),
		array("g4",750),
		array("g4",1000)
	);
*/



$songData = json_decode($getJsonData, true);
$songListing = $songData["score"];

	
	$fields = "H8ChunkID/VChunkSize/H8Format/H8Subchunk1ID/VSubchunk1Size/vAudioFormat/vNumChannels/VSampleRate/VByteRate/vBlockAlign/vBitsPerSample";
	$data = '';
	
	for ($i =0; $i<count($songListing); $i++) {
	
	if (stripos($songListing[$i][0], "z") !== false) {
		// is a rest - use the instrument independant file:
		$wav = "./instruments/z.wav";
	} else {
		$wav = "./instruments/psaltery/".$songListing[$i][0].".wav";
	}
	
		
		$msRequired = $songListing[$i][1];
		$fp = fopen($wav,'rb');
		$header = fread($fp,36);
		$info = unpack($fields,$header);
		
		/*
		// this was in original code, my 'while' loop should catch this, but may need restoring if errors occur with some wav formats:
		// read optional extra stuff
		if($info['Subchunk1Size'] > 16){
		$header .= fread($fp,($info['Subchunk1Size']-16));
		}
		*/
		
		$SubChunk2ID = fread($fp,4);
		while ($SubChunk2ID != 'data') { 
			// $SubChunk2ID should be 'data' - error handling to catch alternatives:
			$thisChunkSize = fread($fp, 4);
			$thisSubchunk2Size  = unpack('Vsize',$thisChunkSize);
			// read this amount of bytes to get the to the next chunk:
			$thisChunkData = fread($fp,$thisSubchunk2Size['size']);
			$header .= $SubChunk2ID.$thisChunkSize.$thisChunkData;
			$SubChunk2ID = fread($fp,4);
		} 
		$header .= $SubChunk2ID ;
		$Subchunk2Size  = unpack('Vsize',fread($fp, 4));
		$size  = $Subchunk2Size['size'];
		$numberOfBytesToRead = $msRequired/1000*$info['ByteRate'];
		// read actual wav data:
		$data .= fread($fp,$numberOfBytesToRead);
		fclose($fp);
	}
	
	// write out wav
	header("Content-type: audio/x-wav");
	header('Content-Disposition: attachment; filename="'.$instrumentsId.'-'.$songsID.'.wav"');
	echo $header.pack('V',strlen($data)).$data;
	// ############# needs to be compressed to mp3
}

?>