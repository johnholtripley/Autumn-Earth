<?php





function generateProceduralName($sex, $race, $debug = false, $seed = null) {

if($seed != null) {
	$storedSeed = intval($seed);
} else {
	list($usec, $sec) = explode(' ', microtime());
	$storedSeed = floor((float) $sec + ((float) $usec * 100000));
}
mt_srand($storedSeed);


switch ($race) {
    case "huldra":
        include_once($_SERVER['DOCUMENT_ROOT']."/includes/retinue/huldra-first-names.php");
		include_once($_SERVER['DOCUMENT_ROOT']."/includes/retinue/huldra-surnames.php");
        break;
    case "dwarrow":
               include_once($_SERVER['DOCUMENT_ROOT']."/includes/retinue/dwarrow-first-names.php");
		include_once($_SERVER['DOCUMENT_ROOT']."/includes/retinue/dwarrow-surnames.php");
        break;
    case "human":
      //
        break;
}



if($race == "human") {
$possibleNames = array("huldra"=>array("female"=>array("Eila Goldéirin", "Ithania Dewstem", "Narianna Auriesin", "Starsong Elmlldan"), "male"=>array("Eranril Leafglade", "Corithras Feymote", "Galar'thus Aurborn")), "dwarrow"=>array("female"=>array("Liri Rustbraid", "Linai Stonebear", "Ingrys Irontale"), "male"=>array("Duri Steelforge", "Frimil Farmantle", "Furi Bronzeward")), "human"=>array("female"=>array("Seyna Teague", "Amberta Farthing", "Annora Alverold"), "male"=>array("George Cadon", "Garrett Mortmaine", "Argyle Croft")));
	$name = $possibleNames[$race][$sex][mt_rand(0, count($possibleNames[$race][$sex]) - 1)];
} else {



	// generate surname by combining prefix and suffix:
	$lastNamePrefix =  $surnamePrefixes[mt_rand(0, count($surnamePrefixes) - 1)];
	$lastNameSuffix =  $surnameSuffixes[mt_rand(0, count($surnameSuffixes) - 1)];
	// generate firstname using markov chain:
	if($sex == "female") {
		$textSource = $femaleFirstnames;
	} else {
		$textSource = $maleFirstnames;
	}
	$markovSequence = array();
	$startPhrases = array();
	$maxNumberOfLetters = mt_rand(4, 10);

	for ($j = 0; $j<count($textSource); $j++) {
		$i = 0;
		$textLength = strlen($textSource[$j]);
		do {
			$secondOrder = substr($textSource[$j], $i, 1) . $secondOrder = substr($textSource[$j], ($i+1), 1);
			if($i == 0) {
				array_push($startPhrases, $secondOrder);
			}
			if (array_key_exists($secondOrder, $markovSequence)) {
				array_push($markovSequence[($secondOrder)],substr($textSource[$j], ($i+2), 1));
			} else {
				$markovSequence[$secondOrder] = array(substr($textSource[$j], ($i+2), 1));
			}
			$i++;
		} while ($i < ($textLength-2));
	}

	$builtFirstName = '';
	$thisPair = $startPhrases[mt_rand(0, count($startPhrases) - 1)];
	$builtFirstName .= $thisPair;
	$i = 0;
	do {
		$secondLetterOfPair = substr($thisPair, 1, 1);
		$nextLetter = $markovSequence[$thisPair][mt_rand(0,count($markovSequence[$thisPair])-1)];
		$builtFirstName .= $nextLetter;
		$thisPair = $secondLetterOfPair.$nextLetter;
		$i++;
	} while ((array_key_exists($thisPair, $markovSequence)) && ($i<$maxNumberOfLetters));
	$name = ucfirst($builtFirstName)." ".ucfirst($lastNamePrefix.$lastNameSuffix);
}


	return $name;
}

?>