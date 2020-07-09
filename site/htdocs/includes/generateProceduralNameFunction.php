<?php





function generateProceduralName($sex, $race, $debug = false, $seed = null) {
global $surnamePrefixes, $surnameSuffixes, $femaleFirstnames, $maleFirstnames;
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
          include_once($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-first-names.php");
		include_once($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-surnames.php");
        break;
        break;
}






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
			// use mb_substr to allow UTF 8 characters:
			$secondOrder = mb_substr($textSource[$j], $i, 1) . $secondOrder = mb_substr($textSource[$j], ($i+1), 1);
			if($i == 0) {
				array_push($startPhrases, $secondOrder);
			}
			if (array_key_exists($secondOrder, $markovSequence)) {
				array_push($markovSequence[($secondOrder)],mb_substr($textSource[$j], ($i+2), 1));
			} else {
				$markovSequence[$secondOrder] = array(mb_substr($textSource[$j], ($i+2), 1));
			}
			$i++;
		} while ($i < ($textLength-2));
	}

	$builtFirstName = '';
	$thisPair = $startPhrases[mt_rand(0, count($startPhrases) - 1)];
	$builtFirstName .= $thisPair;
	$i = 0;
	do {
		$secondLetterOfPair = mb_substr($thisPair, 1, 1);
		$nextLetter = $markovSequence[$thisPair][mt_rand(0,count($markovSequence[$thisPair])-1)];
		$builtFirstName .= $nextLetter;
		$thisPair = $secondLetterOfPair.$nextLetter;
		$i++;
	} while ((array_key_exists($thisPair, $markovSequence)) && ($i<$maxNumberOfLetters));

// use connvert case and not ucfirst to get accented characters:
$firstNameOutput = mb_convert_case(mb_substr($builtFirstName,0,1), MB_CASE_UPPER, "UTF-8").mb_substr($builtFirstName, 1);
$lastNamePrefixOutput = mb_convert_case(mb_substr($lastNamePrefix,0,1), MB_CASE_UPPER, "UTF-8").mb_substr($lastNamePrefix, 1);
	$name = $firstNameOutput." ".($lastNamePrefixOutput.$lastNameSuffix);


if ($debug) {
echo '<p style="font-size:0.6em;"><br>('.$storedSeed.')</p>';
}
	return $name;
}

?>