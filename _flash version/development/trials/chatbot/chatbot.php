
<html>
<head>
<title>chatbot</title>
</head>
<body>

<?php

// ######################################
// TO DO LIST:
// need to divide response score by number of responses
// have list of many possible responses if don't understand something - ideally some that refer to current events (hey - what about that robbery? etc)
// ######################################




// text to learn from:
$chatBotQuestions = array("hello","good morning","how are you?","I went to the park yesterday morning","Yes, it was lovely","i ate a sandwich","it was tuna");
$chatBotResponses = array("hi - how are you?","hi there","I'm well thank you","was it good?","that's wonderful","what flavour was it?","i don't like tuna. chicken is my favourite");
//
$wordList = array();
// $wordList[sample word][[response,score][response2,score2]]
//
//
function chatBotNormalize($stringToNormalize) {
  $stringToNormalize = strtolower($stringToNormalize);
  // expand any contractions:
  $stringToNormalize = str_replace("i'm","i am", $stringToNormalize);
  $stringToNormalize = str_replace("you're","you are", $stringToNormalize);
  $stringToNormalize = str_replace("that's","that is", $stringToNormalize);
  $stringToNormalize = str_replace("that'll","that will", $stringToNormalize);
  $stringToNormalize = str_replace("it's","it is", $stringToNormalize);
  // remove unrequired punctuation:
  $stringToNormalize = str_replace("-","", $stringToNormalize);
  $stringToNormalize = str_replace(".","", $stringToNormalize);
  $stringToNormalize = str_replace(",","", $stringToNormalize);
  
  // strip additional whitespace:
  // preg_replace('/\s\s+/', ' ', $str);
  
  return $stringToNormalize;
}

function chatBotLearn() {
	global $chatBotQuestions;
	global $chatBotResponses;
	global $wordList;
	// loop through each question:
	for ($i =0; $i<count($chatBotQuestions); $i++)  {
		// normalize the question:
		$thisQuestion = chatBotNormalize($chatBotQuestions[$i]);
		$splitQuestion = explode(" ", $thisQuestion);
		// loop through each word in the question:
		for ($j =0; $j<count($splitQuestion); $j++) {
			// score this word for the given response:
			$thisWordScore = 1/(count($splitQuestion));
			// check if this word exists in the word list:
			$wordFound = -1;
			for ($k =0; $k<count($wordList); $k++) {
				if ($wordList[$k][0] == $splitQuestion[$j]) {
					$wordFound = $k;
					break;
				}
			}
			if ($wordFound == -1) {
				// insert word into array
				array_push($wordList, array($splitQuestion[$j],array(array($chatBotResponses[$i], $thisWordScore))));
			} else {
				// add score and response to array
				$wordList[$wordFound][1][] = array($chatBotResponses[$i], $thisWordScore);
			}
		}
		
	}
}
//
//
chatBotLearn();
//
// check for post data:
if (isset($_POST["userStatement"])) {
	$processUserResponse = trim($_POST["userStatement"]);
	if ($processUserResponse != "") {
		echo"<p>You said '".$processUserResponse."'</p>";
		$processUserResponse = chatBotNormalize($processUserResponse);
		//
		$splitStatement = explode(" ", $processUserResponse);
		$possibleResponses = array();
		// loop through each word in the statement:
		
		
		
		for ($j =0; $j<count($splitStatement); $j++) {
			// see if this word has a response:
			$wordFound = -1;
			for ($k = 0; $k<count($wordList); $k++) {
			
				if ($wordList[$k][0] == $splitStatement[$j]) {
					$wordFound = $k;
					break;
				}
			}
			if ($wordFound != -1) {
				// loop through all possible responses for this word:
				//echo "found response(s) for '".$wordList[$wordFound][0]."'";
				//echo "<br />number of responses: ".count($wordList[$wordFound][1]);
				
				
				
				for ($l=0;$l<count($wordList[$wordFound][1]); $l++) {
					$thisPossibleResponse = $wordList[$wordFound][1][$l][0];
					$thisPossibleScore = $wordList[$wordFound][1][$l][1];
					//echo "<br />possible response is '".$thisPossibleResponse."'";
					//echo "<br />possible response score is '".$thisPossibleScore."'";
					
					
					
					// determine the sum of all the responses for this word:
					$sumOfAllResponsesForThisWord = 0;
					for ($p=0;$p<count($wordList[$wordFound][1]); $p++) {
						$sumOfAllResponsesForThisWord = $sumOfAllResponsesForThisWord+$wordList[$wordFound][1][$l][1];
					}
					
					
					// see if this response has already been found:
					$responseFound = -1;
					for ($m=0;$m<count($possibleResponses); $m++) {
						if ($possibleResponses[$m][0] == $thisPossibleResponse) {
							$responseFound = $m;
							break;
						}
					}
					if ($responseFound == -1) {
						// not found this response before:
						array_push($possibleResponses, array($thisPossibleResponse, ($thisPossibleScore/$sumOfAllResponsesForThisWord)));
					} else {
						// add the score for this response:
						$possibleResponses[$responseFound][1] = $possibleResponses[$responseFound][1]+($thisPossibleScore/$sumOfAllResponsesForThisWord);
					}
				}
			}
		}
		if (count($possibleResponses) == 0) {
			echo"<p>I cannot think of anything to say to that.</p>";
		} else {
			// go through possible responses and find the highest scoring one:
			$thisHighestScore = -1;
			$responseIndex = -1;
			for ($i=0;$i<count($possibleResponses); $i++) {
				if ($possibleResponses[$i][1] > $thisHighestScore) {
					$thisHighestScore = $possibleResponses[$i][1];
					$responseIndex = $i;
				}
			}
			echo"<p>".$possibleResponses[$responseIndex][0]."</p>";
		}
	} else {
		echo"<p>You said nothing...</p>";
	}
}

?>


<form action="chatbot.php" method="post">
<input type="text" name="userStatement" style="width: 300px;" id="userStatement" />
<input type="submit" value="send" />
</form>


</body>
</html>