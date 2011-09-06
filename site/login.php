<?php
/* need to be careful of whitespace before and after php tags as these will be sent to flash */

$serverVersion = "1.0.0";
// check client version is the latest version:
$clientVersion = $_POST["clientversion"];
if ($clientVersion < $serverVersion) {
print ("reply=clientoutdated");
} else {


// username etc is now in database
// ######################

/*
$filename = "data/" . $_POST["username"] ."/base.txt";
	if (!($fp = fopen($filename, "r"))) {
		//return error
		// send variable to flash:
		print ("reply=error");
	} else {
		$data = fread($fp, filesize($filename));

		// separate the whole string into variables
		parse_str($data);

		fclose($fp);
		//
		$encryptedinput = crypt($_POST["enteredpassword"], $codeversion);
		// let the salt be automatically generated
		// You should pass the entire results of crypt() as the salt for comparing a
		// password, to avoid problems when different hashing algorithms are used.
		if ($encryptedinput == $codeversion) {
		
			print ("reply=passwordtrue");
		} else {
		
			print ("reply=passwordfalse");
		}


	}
	
	*/
	print ("reply=passwordtrue");
	
}

?>