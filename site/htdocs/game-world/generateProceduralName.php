<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/generateProceduralNameFunction.php");

$debug = false;
if(isset($_GET["debug"])) {
    $debug = true;
}
if (isset($_GET["seed"])) {
  $seed = $_GET["seed"];
} else {
  $seed = null;
}

if($debug) {
 echo '<style>* { font-family: arial, helvetica, sans-serif; }</style>';
}

$sex = $_GET["sex"];
$race = $_GET["race"];

$generatedName = generateProceduralName($sex, $race, $debug, $seed);
echo $generatedName;

if($debug) {
echo '<p style="font-size:0.8em;"><br>('.$sex.' '.$race.')</p>';
echo '<hr><p style="font-size:0.6em;"><br>';
echo '<a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?sex=female&race=huldra&debug=true">female Huldra</a> | ';
echo '<a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?sex=male&race=huldra&debug=true">male Huldra</a> | ';
echo '<a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?sex=female&race=dwarrow&debug=true">female Dwarrow</a> | ';
echo '<a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?sex=male&race=dwarrow&debug=true">male Dwarrow</a> | ';
echo '<a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?sex=female&race=human&debug=true">female Human</a> | ';
echo '<a href="' . explode("?", $_SERVER["REQUEST_URI"])[0] . '?sex=male&race=human&debug=true">male Human</a>';
echo '</p>';
}
?>