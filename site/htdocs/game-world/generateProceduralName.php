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

$sex = $_GET["sex"];
$race = $_GET["race"];

$generatedName = generateProceduralName($sex, $race, $debug, $seed);
echo $generatedName;
?>