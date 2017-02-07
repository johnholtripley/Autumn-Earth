<?php
$returnednames = array();


		array_push($returnednames, array('id' => 'id1', 'charid' => '0'));
	
		array_push($returnednames, array('id' => 'id2', 'charid' => 'fgrt'));
	
		
		
		print_r(array_values($returnednames[0]));
		echo'<hr>';
		print_r(array_values($returnednames[1]));
		echo'<hr>';
		echo count($returnednames);
		?>