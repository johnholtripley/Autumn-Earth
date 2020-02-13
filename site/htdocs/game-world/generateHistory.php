<?php

// generate person, object or place

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


include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/retinue/human-anglo-saxon-female.php");


$HistorySource = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/includes/scriptorium/history-grammar.json');
$jsonHistorySource = json_decode($HistorySource, true);


class historyEntity {
    public function __construct() {
        $this->name = "";
    }
}

class historyPerson extends historyEntity {
     public function __construct() {
        parent::__construct();
        $this->sex = "";
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
echo '<h2>'.$newPerson->name.'</h2>';

// loop through a number of events, changing the entity's state as a result:
// ###### 






   ?>