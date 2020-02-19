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
        $this->name = "the Curmsun Disc";
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
// each event should be a new object, with a year and a location
// ###### 

// get random events:
$usedEventKeys = array();
$allEvents = "";

for ($i=0; $i<mt_rand(2,3);$i++) {
do {
$eventKey = mt_rand(0,count($jsonHistorySource['events'])-1);
} while ((in_array($eventKey, $usedEventKeys)));
$thisEvent = $jsonHistorySource['events'][$eventKey];
if($allEvents != '') {
$allEvents .= '|||';
}
$allEvents .= $thisEvent;
array_push($usedEventKeys, $eventKey);
}


$allEventsYear = mt_rand($newPerson->creationYear+10,$newPerson->creationYear+90);
$allEventsItem = generateBaseEntity("item");
$allEventsLocation = generateBaseEntity("location");

// run grammar replacement:
$allEvents = findAndReplaceHashes($allEvents, $jsonHistorySource);

$allEvents = str_replace("**fullname**", $newPerson->name, $allEvents);
$allEvents = str_replace("**firstname**", $newPerson->firstname, $allEvents);
$allEvents = str_replace("**lastname**", $newPerson->lastname, $allEvents);
$allEvents = str_replace("**year**", $allEventsYear, $allEvents);
$allEvents = str_replace("**item**", $allEventsItem->name, $allEvents);
$allEvents = str_replace("**location**", $allEventsLocation->name, $allEvents);
$allEvents = str_replace("**age**", ($allEventsYear - ($newPerson->creationYear)), $allEvents);
if($newPerson->sex == "female") {
    $allEvents = str_replace("**pronounUC**", "She", $allEvents);
    $allEvents = str_replace("**pronoun**", "she", $allEvents);
    $allEvents = str_replace("**possessiveUC*", "Her", $allEvents);
    $allEvents = str_replace("**possessive**", "her", $allEvents);
} else {
    $allEvents = str_replace("**pronounUC**", "He", $allEvents);
    $allEvents = str_replace("**pronoun**", "he", $allEvents);
    $allEvents = str_replace("**possessiveUC*", "His", $allEvents);
    $allEvents = str_replace("**possessive**", "his", $allEvents);
}


$allEventsList = explode("|||", $allEvents);

if($debug) {
echo '<link href="https://fonts.googleapis.com/css?family=IM+Fell+English&display=swap" rel="stylesheet">';
echo '<style>*{font-family:arial,helvetica,sans-serif;color:#666;}li{font-family:"IM Fell English",arial,helvetica,sans-serif;font-size:1.4em;font-weight:normal;letter=spacing:0.08em;color:#111;}body { padding: 0;margin:0; background: #dbd7be url(/images/herbarium/catalogue-background-NOT_MINE.jpg) repeat-y 50% 0; -webkit-background-size: 100% auto; -moz-background-size: 100% auto; -o-background-size: 100% auto; background-size: 100% auto;}

</style>';
echo '<ol style="margin: 5%;">';
echo '<li>'.$newPerson->name.' was born in '.$newPerson->creationYear.'</li>';
for ($i=0;$i<count($allEventsList);$i++) {
echo '<li>'.$allEventsList[$i].'</li>';
}
echo '</ol>';
echo '<p style="font-size:0.7em;"><a href="'.explode("?", $_SERVER["REQUEST_URI"])[0].'?seed='.$storedSeed.'&debug=true">Seed: '.$storedSeed.'</a></p>';
echo '<p style="font-size:0.7em;"><a href="'.explode("?", $_SERVER["REQUEST_URI"])[0].'?debug=true">New seed</a></p>';
}


   ?>