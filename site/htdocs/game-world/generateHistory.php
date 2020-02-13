<?php

// generate person, object or place
// http://www.freeholdgames.com/papers/Generation_of_mythic_biographies_in_Cavesofqud.pdf

// person:
// name
// sex - pronouns
// associated locations
// associated items
// associated factions

// item:
// name
// type
// associated locations
// associated people

// location:
// name
// events
// associated items
// associated people


// TO DO
// 

$debug = false;
if(isset($_GET["debug"])) {
    $debug = true;
}

include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-anglo-saxon-female.php");


$HistorySource = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/scriptorium/history-grammar.json');
$jsonHistorySource = json_decode($HistorySource, true);


if (isset($_GET["seed"])) {
    $storedSeed = intval($_GET["seed"]);
} else {
    // http://php.net/manual/en/function.mt_srand.php
    list($usec, $sec) = explode(' ', microtime());
    $storedSeed = floor((float) $sec + ((float) $usec * 100000));
}
mt_srand($storedSeed);




class historyEntity {
    public function __construct() {
        $this->creationYear = mt_rand(50,100);
    }
}

class historyPerson extends historyEntity {
     public function __construct() {
        parent::__construct();
        $this->sex = "female";
        $this->race = "Uldra";
        $this->name = generatePersonName($this->race,$this->sex);
     }
}

function generatePersonName($race,$sex) {
    global $anglosaxonFemaleSyllables;
    $possibleAngloSaxonFemaleFirstNames = sortSequentialSyllables($anglosaxonFemaleSyllables);
    $femaleName = selectSyllables($possibleAngloSaxonFemaleFirstNames,2,4);
    $femaleName = ucfirst($femaleName);
    return $femaleName;
}

function generateBaseEntity($type) {
    global $jsonHistorySource;
    
    switch ($type) {
        case "person":
        $entity = new historyPerson();
        break;
        case "item":
        break;
        case "location":
        break;
    }
    return $entity;
}

// generate entity:
$newPerson = generateBaseEntity("person");


// loop through a number of events, changing the entity's state as a result:
// ###### 

// get random event:
$thisEvent = $jsonHistorySource['events'][mt_rand(0,count($jsonHistorySource['events'])-1)];

$thisEventYear = mt_rand($newPerson->creationYear+10,$newPerson->creationYear+90);
$thisEventObject = 'the One Ring';

$thisEvent = str_replace("##person##", $newPerson->name, $thisEvent);
$thisEvent = str_replace("##year##", $thisEventYear, $thisEvent);
$thisEvent = str_replace("##object##", $thisEventObject, $thisEvent);
$thisEvent = str_replace("##age##", ($thisEventYear - ($newPerson->creationYear)), $thisEvent);
if($newPerson->sex == "female") {
$thisEvent = str_replace("##pronounUC##", "She", $thisEvent);
$thisEvent = str_replace("##pronoun##", "she", $thisEvent);
$thisEvent = str_replace("##possessiveUC#", "Her", $thisEvent);
$thisEvent = str_replace("##possessive##", "her", $thisEvent);
} else {
$thisEvent = str_replace("##pronounUC##", "He", $thisEvent);
$thisEvent = str_replace("##pronoun##", "he", $thisEvent);
$thisEvent = str_replace("##possessiveUC#", "His", $thisEvent);
$thisEvent = str_replace("##possessive##", "his", $thisEvent);
}
// run grammar replacement:
$thisEvent = findAndReplaceHashes($thisEvent, $jsonHistorySource);

if($debug) {
echo '<style>*{font-family:arial,helvetica,sans-serif;}</style>';
echo '<ol style="margin: 5%;">';
echo '<li>'.$newPerson->name.' was born in '.$newPerson->creationYear.'</li>';
echo '<li>'.$thisEvent.'</li>';
echo '</ol>';
echo '<p style="font-size:0.7em;">'.$storedSeed.'</p>';
}


   ?>