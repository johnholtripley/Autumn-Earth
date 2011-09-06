<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Autumn Earth</title>

<meta content="Autumn Earth Community Forums" name="description" />
<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />
<meta content="no" http-equiv="imagetoolbar" />
<script language="javascript" src="/includes/core.js" type="text/javascript"></script>
</head>
<body>


<?php

// if no question, and post back, need to re-display the correct number of non-null inputs



echo'<form name="AddPoll" id="AddPoll" method="post" action="' . $thisurl . '">';


	echo '<label for="pollquestion">Enter the poll\'s question</label>';
	echo '<input id="pollquestion" type="text" name="pollquestion" /><br />';
	
	for ($i=0; $i<10; $i++) {
	// create ten inputs:
	echo '<div id="pollInput'.$i.'" name="pollInput'.$i.'">';
	echo '<label for="pollresponse'.$i.'">Enter response #'.($i+1).'</label>';
	echo '<input id="pollresponse'.$i.'" type="text" name="pollresponse'.$i.'" /></div>';
	
	}


echo'</form>';

// use javascript to hide inputs 2-9 (0 and 1 will need to be shown for the minimum 2 choices)
?>

<script>

function showNext() {
if (firsthidden<10) {
	if (getElement("pollInput"+firsthidden)) {
		thiselement.style.display = "block";
	}
	
	firsthidden ++;
 if (firsthidden == 10) {
 	if (getElement("choicebutton")) {
		thiselement.style.display = "none";
	}
 }
} 
}


for (i=2; i<10; i++) {
	if (getElement("pollInput"+i)) {
		thiselement.style.display = "none";
	}
}
firsthidden = 2;

</script>

<div id="choicebutton" name="choicebutton"><a href="#" onclick="showNext()" title="add another choice">add another choice</a></div>



</body>
</html>