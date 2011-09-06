<?php

function createNewNumbers() {
  // randomly determine new numbers
  $possibleLotteryNumbers = array(1,2,3,4,5,6,7,8,9,0);
  shuffle($possibleLotteryNumbers);
  // take only first 7 elements:
  $newLotteryNumbers = $possibleLotteryNumbers[0];
  for ($i = 1; $i < 7; $i++) {
    $newLotteryNumbers .= "-".$possibleLotteryNumbers[$i];
  }
  //  save these to the database #########
}

$lotteryNumbers = "1-2-3-4-5-6-7";
$prizeFund = "120000";

$playersNumbers = $_POST['lotteryNumbers'];

$lotteryNumbersArray = explode("-",$lotteryNumbers);
$playersNumbersArray = explode("-",$playersNumbers);

// check how many numbers match:
$matchingNumbers = 0;
for ($i = 0; $i < count($lotteryNumbersArray); $i++) {
  for ($j = 0; $j < count($lotteryNumbersArray); $j++) {
    if ($lotteryNumbersArray[$i] == $playersNumbersArray[$j]) {
      $matchingNumbers ++;
      break;
    }
  }
}

switch ($matchingNumbers) {
  case 7:
  $moneyWon = $prizeFund;
  createNewNumbers();
  // store playerID, date/time and amount won to show on the website
  // #######
  
  // create new prize fund now:
  $prizeFund = rand(100000, 150000);
  break;
  case 6:
  $moneyWon = $prizeFund/100;
  createNewNumbers();
  $prizeFund -= $moneyWon;
  break;
  case 5:
  $moneyWon = $prizeFund/1000;
  createNewNumbers();
  $prizeFund -= $moneyWon;
  break;
  default:
  $moneyWon = 0;
}

// add player's ticket price:
$prizeFund += 5;

// save new prize fund to the database
// ##############

echo "matched=".$matchingNumbers."&won=".$moneyWon;
?>