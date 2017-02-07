<?php
function findCode($textcontent) {

echo'<h3>'.$textcontent.'</h3>';

$validopentag = array('b]','i]','u]','s]','h]');
$validclosetag = array('/b]','/i]','/u]','/s]','/h]');

$openlist = array();

$splittext = explode("[", $textcontent);
echo'<br>';
//print_r(array_values($splittext));
echo'<br>';
if (count($splittext) > 0) {
	$i = 0;
	while ($i < count($splittext)) {
	
	$tagsearch = (array_search(substr($splittext[$i],0,2), $validopentag));
		if (is_numeric($tagsearch)) {
	// ie. isn't false;	
	 echo'open tag<br>';
	 array_push($openlist, $tagsearch);
	} else {
	// check for close tags
		$tagsearch = (array_search(substr($splittext[$i],0,3), $validclosetag));
		if (is_numeric($tagsearch)) {	
		echo'close tag<br>';
			// check if this tag corresponds to the last open tag:
			$lastelement = array_pop($openlist);
			if ($tagsearch == $lastelement) {
			 // is fine and can be removed from the list
			 echo'matches open tag<br>';
			} else {
			 // add the element back in
			 array_push($openlist, $lastelement);
			 echo'doesn\'t match open tag<br>';
			 // remove the open tag that conflicts:
			 echo'conflicting tag is '.$splittext[$i-1];
			 $splittext[$i-1] = substr($splittext[$i-1],2);
			}
		}
	}
	
	$i++;
	}
}
// rebuild string:
$output = implode("[", $splittext);
echo'<br>';
echo'<br>';
echo'<br>';
echo $output;
}

findCode("mary had a [b]litt[u]le l[/b]amb a litt");
?> 