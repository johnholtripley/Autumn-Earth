<?php

function generateProceduralName($sex, $race, $debug = false, $seed = null) {
if($seed != null) {
	$storedSeed = intval($seed);
} else {
	list($usec, $sec) = explode(' ', microtime());
	$storedSeed = floor((float) $sec + ((float) $usec * 100000));
}
mt_srand($storedSeed);


$possibleNames = array("huldra"=>array("female"=>array("Eila Goldéirin", "Ithania Dewstem", "Narianna Auriesin", "Starsong Elmlldan"), "male"=>array("Eranril Leafglade", "Corithras Feymote", "Galar'thus Aurborn")), "dwarrow"=>array("female"=>array("Liri Rustbraid", "Linai Stonebear", "Ingrys Irontale"), "male"=>array("Duri Steelforge", "Frimil Farmantle", "Furi Bronzeward")), "human"=>array("female"=>array("Seyna Teague", "Amberta Farthing", "Annora Alverold"), "male"=>array("George Cadon", "Garrett Mortmaine", "Argyle Croft")));


	$name = $possibleNames[$race][$sex][mt_rand(0, count($possibleNames[$race][$sex]) - 1)];
	return $name;
}

?>