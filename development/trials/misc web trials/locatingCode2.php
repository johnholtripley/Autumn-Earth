<?php
function findCode($textcontent) {

echo'<h3>'.$textcontent.'</h3>';

$validopentag = array('b]','i]','u]','s]','h]');
$validclosetag = array('/b]','/i]','/u]','/s]','/h]');

$openlist = array();

$splittext = preg_split("/\[[a-zA-Z0-9]*\]/", $textcontent);


print_r(array_values($splittext));
}

findCode("mary had a [b]litt[u]le l[/b]amb a litt");
?> 