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
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-anglo-saxon-male.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/elven-surname-prefix.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/elven-surname-suffix.php");


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
        if(mt_rand(1,2) == 1) {
            $this->sex = "male";  
        } else {
            $this->sex = "female";
        }
        $this->race = "Uldra";
        $this->firstname = generatePersonFirstName($this->race,$this->sex);
        $this->lastname = generatePersonLastName($this->race);
        $this->name = $this->firstname." ".$this->lastname;
     }
}

class historyItem extends historyEntity {
     public function __construct() {
        parent::__construct();
        $this->name = "the One Ring";
     }
}

class historyLocation extends historyEntity {
     public function __construct() {
        parent::__construct();
        $this->name = "Ashenvale";
     }
}

function generatePersonFirstName($race,$sex) {
    if($sex == "female") {
        global $anglosaxonFemaleSyllables;
        $possibleAngloSaxonFemaleFirstNames = sortSequentialSyllables($anglosaxonFemaleSyllables);
        $femaleName = selectSyllables($possibleAngloSaxonFemaleFirstNames,2,4);
        $femaleName = ucfirst($femaleName);
        return $femaleName;
    } else {
        global $anglosaxonMaleSyllables;
        $possibleAngloSaxonMaleFirstNames = sortSequentialSyllables($anglosaxonMaleSyllables);
        $maleName = selectSyllables($possibleAngloSaxonMaleFirstNames,2,4);
        $maleName = ucfirst($maleName);
        return $maleName;
    }
}

function generatePersonLastName($race) {
    global $elvenSurnamePrefixes, $elvenSurnameSuffixes;
    $thisFirstSurname = $elvenSurnamePrefixes[mt_rand(0, count($elvenSurnamePrefixes) - 1)];
    $thisSecondSurname = $elvenSurnameSuffixes[mt_rand(0, count($elvenSurnameSuffixes) - 1)];
    if (substr($thisFirstSurname, -1, 1) == substr($thisSecondSurname, 0, 1)) {
      // make sure the last character of the first word isn't the same as the first of the last word - so don't get dragonsstar - get dragonstar instead
    $thisFirstSurname = substr($thisFirstSurname, 0, -1);
    }
    $elvenSurname = $thisFirstSurname.$thisSecondSurname;
    $elvenSurname = ucfirst($elvenSurname);
    return $elvenSurname;
}

function generateBaseEntity($type) {
    global $jsonHistorySource;
    
    switch ($type) {
        case "person":
        $entity = new historyPerson();
        break;
        case "item":
        $entity = new historyItem();
        break;
        case "location":
        $entity = new historyLocation();
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
$thisEventItem = generateBaseEntity("item");
$thisEventLocation = generateBaseEntity("location");

$thisEvent = str_replace("##fullname##", $newPerson->name, $thisEvent);
$thisEvent = str_replace("##firstname##", $newPerson->firstname, $thisEvent);
$thisEvent = str_replace("##lastname##", $newPerson->lastname, $thisEvent);
$thisEvent = str_replace("##year##", $thisEventYear, $thisEvent);
$thisEvent = str_replace("##item##", $thisEventItem->name, $thisEvent);
$thisEvent = str_replace("##location##", $thisEventLocation->name, $thisEvent);
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
echo '<p style="font-size:0.7em;"><a href="'.explode("?", $_SERVER["REQUEST_URI"])[0].'?seed='.$storedSeed.'&debug=true">Seed: '.$storedSeed.'</a></p>';
echo '<p style="font-size:0.7em;"><a href="'.explode("?", $_SERVER["REQUEST_URI"])[0].'?debug=true">New seed</a></p>';
}


   ?>