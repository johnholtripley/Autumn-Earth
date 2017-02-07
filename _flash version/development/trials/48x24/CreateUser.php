<?php

// check if directory exists
if(is_dir("elements/" . $_POST["username"])) {
	// exists, so return that the player needs to use another name
} else {
	// can go ahead:
	//
	// create directory:

	/* use
	mkdir
	*/

	//
	// open directory to copy from, read files and copy across:
	
	
	// open directory to read:
	$copydirectory = opendir("elements/player1");
	// get each file:
	while($entryname = readdir($copydirectory)) {
		if (is_file("elements/player1/" . $entryname)) {
			print($entryname);
			print("<br />");
		}
	}
	// close read directory:
	closedir($copydirectory);

}

?>