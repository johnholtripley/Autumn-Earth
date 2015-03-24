<?php
/* need to be careful of whitespace before and after php tags as these will be sent to flash */

// check php.ini - if script is longer than 30 seconds it will end


$BaseSavedOk = "true";

if(!($filename=fopen("elements/" . $_POST["username"] ."/base.txt","w"))) {
/* error - file could not be created */
$SavedOk = "false";
}

$toSave = "codeversion=" . $_POST["codeversion"] . "&playsounds=" . $_POST["playsounds"] . "&herox=" . $_POST["herox"] . "&heroy=" . $_POST["heroy"] . "&money=" .$_POST["money"] . "&dowseskill=" . $_POST["dowseskill"]  . "&famskill=" . $_POST["famskill"]  . "&currentmapnumber=" . $_POST["currentmapnumber"] . "&currentbag=" . $_POST["currentbag"] . "&heightgained=" . $_POST["heightgained"] . "&inventorysave=" . $_POST["inventorysave"] . "&journalsave=" . $_POST["journalsave"] . "&questsstatus=" . $_POST["questsstatus"] . "&petsave=" . $_POST["petsave"] . "&charname=" . $_POST["charname"]; 

fwrite($filename, $toSave); 
fclose($filename);

/* send variable to flash: */
print ("basewassuccess=".$BaseSavedOk);

?>