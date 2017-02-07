<?php


$stringToAlter = '"welcome" to th show i\'m 3\'12"
really" "he said"';

// open quotes = &ldquo;
// close quotes = &rdquo;
// curled apostrophe = &rsquo;


// do open quotes at string start:
$amendedtext = ereg_replace('(^)"(.)',"\\1&ldquo;\\2",$stringToAlter);
$amendedtext = ereg_replace('(([[:space:]])"(.))+',"\\2&ldquo;\\3",$amendedtext);


// do close quotes not at string end:
$amendedtext = ereg_replace('((.)"([[:space:]]))+',"\\2&rdquo;\\3",$amendedtext);
// do close quotes at string end:
$amendedtext = ereg_replace('(.)"($)',"\\1&rdquo;\\2",$amendedtext);


// do apostrophes:
$amendedtext = ereg_replace('(.)\'(.)',"\\1&rsquo;\\2",$amendedtext);

echo $stringToAlter;
echo '<hr>';
echo $amendedtext;
echo '<hr>';
$spacetext = "john quotes";
$newtext = ereg_replace("[[:space:]]","-",$spacetext);;
echo $spacetext;
echo '<hr>';
echo $newtext;
?>