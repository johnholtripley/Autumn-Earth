
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
$chatBotQuestions = array("hello", "morning","morning ramon, have you got some time free today?","We need to change the image size on Redband please","it's on 60a and they've uploaded a load of images, so can you change the size and then re-create the product thumbs?","the one that's used in dynamic item frag","thanks mate","that looks good thanks - i'll let the client know","did the client ask you to create eplay.co.uk?","is it done?","i don't suppose the client mentioned the enormous amount of development that's needed for this did he?","oh it is. but if they're having what we talked about in the meeting, there's *a lot* of new work","he's just doing you an email now","i'll check it through as well and see if it's got everything","...but i'll start styling what i can now","thanks","is eplay uploaded to a server anywhere?","i was giong to upload styles, but no rush","cool - grab the latest SVN then and we'll get a rough styled version then","eplay.co.uk/trunk/sitemap shows an XML sitemap, and not the html page - is this right?","while you're on eplay, they need breadcrumbs on every page = can you sort that out please (I've added the fragment in, but i guess the class needs altering slightly?)","whenever you've got time","they're coming in tomorrow at 9:00. so could you upload everything that is complete and let the client know what is done and not done please?","is there a test account on linux1 for eplay? ramon and 123456 doesn't seem to be working","my stuff's in svn now, and let me know when i can carry on then","we will need products on homepage but in a specific way - have you seen the concept?","i tink i set Genre = brand and Format = Categories - but whichever is easiest for you","so the products are the 6 panels at the top under the Assassin#s creed advert","actually, could they choose the top 5 using the 'feature on home page' checkbox in the backoffice?","which might be because it's a big content managed area - let me check with the client","right - just spoken to the client, and the Eplay homepage is just going to be 1 big content managed area","We'll have a header and footer, but then just big WYSIWYG area","so what i've started working on in SVN as 'index' is actually a Store homepage","right, i'm off - speak tomorrow!","morning - what's the ftp password for eplay please?","just quickly - how long would it take to change the Category image size for REdband? and to re-create all of the category images at the new size? is it more than 10 minutes?","would you be able to do that now for me? they're wanting to get this done - UNLESS it stops anything being ready for eplay that they could see in the next half an hour","the category images are at the moment 305 x 138, can they be 305 x 184","thanks mate","after every 3 divs, add a div with a class to clear","thanks","how much have you done?","yeah - that's fine","were you asked to add in a field for each product?","oh, no, that was something else. can you add a new TinyCME area for each product called 'supported products'? and then display it on the product details page","oh, and add a pdf upload for each product","...that's much simpler isn't it?","didn't you do something like this for NYA?","the new pages that i list should be Editable pages, but they need to be able to add their own new pages and these should be Dynamic pages","is this front end or backoffice? the dynamic pages should work exactly like the editable (if that's what you mean?) ","could you upload your changes please?","shall i check if they've added products?","oh, it didn't work when i just tried","right - just one more thing","can you remove that just from these 3 pages please?","ok - thanks","is that easy?","if it's hard, leave them off, and we'll wait for their feedback","they should be allowed to create new root dynamic pages shouldn't they?","are we doing countdowns or charts?","countdown until a game is released","jeez - you ok?","oh, while you're working, can you add the 'show on eplay homepage' radio button back into each product","if you can add it in to show heroshot like wearepets and i'll style it into the new carousel thing","can the hero shot be cropped to 835 x 285 px please?","if we can do the obvious stuff like that then it looks like we've done lots!","no - we need to make sure they know!","just pick one at random if they have selected more than 1","awesome mate - thanks","yeah - looks good",);
$chatBotResponses = array("hi", "hi","yeah of course. I don't have anything at the moment","no probs","only recreate thumbs?","ok I will start right now","could you check if it's ok?","by the way let me know if you have something else.","yes!","yes, but, database is not yet in SVN","I didn't add because I will have to do some updates but the client hasn't reply yet my email","mmm... the client send me a list but there wasn't anything new I don't know if it's the same list","cool!","ok thanks!","ok, let me create database for you","ok john it's done","morning - not yet - why?","anyway I will upload this afteroon","ok","no idea!:S I just clone from wearepets - let me check","do you need this now?","ok I will add later","hopefully this store category feature will be finished today","no, you will have to create a new one","ok thanks and sorry!","well you sent me an image","yeah that's fine","yeah","ok I will do that the user chose in the backoffice","I will try to do this homepage for the stores first","ok","then it's done you just need to style and that's it","that's why I said that it will need some change","see you tomorrow mate","FTP host: 94.236.126.16 user: eplay pass: ????????","yeah it will be 10 minuts more or less","I can do now","it's done","you are welcome","ok","you are welcome","well... I have to do 3-4 things that the client told me","cool!thanks","sorry but I think that finallly you told someone else to do it","ok. I will do it now but nobody told me anything about that","ok. I will have to retrieve database and files as I hven't worked with this project yet"," and show the link in the frontend if there's a file?","well....yeah it's simple","yes a no!:P","and where should I show the information? at the top where the products are listed?","but for example about us should be in dynamic or static?","ok I will have to upload full website as I can't remember all the files","I checked backoffice and they haven't added products","I will check","ok, tell me","ok. and you will add the link ../catalogue/service into each page?","let me know if you need anything else","don't know....","ok then better wait","ok I can give access again","sorry what are countdowns?","sorry no idea what's that","yeah, I'm fine thanks","I take the radio button off from the backoffice","ok no probs I will do it","ok","yes.... but then they think that everything is done but no!","so it's good but not reallyt good!:P","what about if one store doesn't have any product selected?","is that ok then?","ok!good!",);
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