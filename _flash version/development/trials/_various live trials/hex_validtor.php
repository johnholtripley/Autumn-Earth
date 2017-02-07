<?php
$hexvalue = "red";
echo $hexvalue."\n";
// regex to check valid hex values for the text and BG colours (could be 3 values eg. fff)


// do open quotes at string start:
$match = ereg('^([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$',$hexvalue);
if ($match == false) {
echo 'no match!!!';
}
echo ">".$match;

// ^#?([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$

?>