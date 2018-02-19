<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");


 if (isset($_GET["seed"])) {
        $storedSeed = intval($_GET["seed"]);
    
    } else {
        // http://php.net/manual/en/function.mt_srand.php
        list($usec, $sec) = explode(' ', microtime());
        $storedSeed       = floor((float) $sec + ((float) $usec * 100000));
    }
  
    mt_srand($storedSeed);


$homeBaseX = 120;
$homeBaseY = 450;



?>