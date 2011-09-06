<?php

// to do:
//  error handling - unknown index and memory allocation
// more secure file upload
// error reporting to user


function processSongKey($stringToProcess) {
  // ensure key is consistent:
  $stringToProcess = str_replace(' ', '', $stringToProcess);
  $stringToProcess = strtolower(substr($stringToProcess,2,5));
  // remove 'maj' - is default:
  $stringToProcess = str_ireplace("maj", "", $stringToProcess);
  // make 'min' just 'm':
  $stringToProcess = str_ireplace("min", "m", $stringToProcess);
  return $stringToProcess;
}

function determineNoteLength($thisTempo, $thisDefaultNoteLength) {
  $slashPos = strpos($thisTempo, "=");
  if ($slashPos === false) {
    $thisNoteLengthMS = 60/$thisTempo*1000;
  } else {
    $defaultNoteLengthFraction = substr($thisDefaultNoteLength, strpos($thisDefaultNoteLength, "/")+1);
    $splitTemp = split("[/=]",$thisTempo);
    $thisNoteLengthMS = (60/$splitTemp[2]*1000)*($splitTemp[1]/$defaultNoteLengthFraction);
  }
  return $thisNoteLengthMS;
}

function generateFileName($note,$notesOctave) {
	// convert flats to equivilent sharps to save on number of file names needed:
	
	switch ($note) {
        case "db":
          $note = "cs";
          break;
		case "eb":
          $note = "ds";
          break;
        case "fb":
          $note = "e";
          break;
        case "gb":
          $note = "fs";
          break;
        case "ab":
          $note = "gs";
          break;
        case "bb":
          $note = "as";
          break;
        case "cb":
          // this is the b in the lower octave:
          if ($notesOctave>2) {
			$note = "b";
			$notesOctave --;
          } else {
			// this makes this note out of range:
			$note = "invalid";
          }
          break;
          default:
          // is ok as it is
    }
    
    if ($note == "bs") {
		// this is c in the next octave
		if ($notesOctave<5) {
			$note = "c";
			$notesOctave ++;
		} else {
			// this makes this note out of range:
			$note = "invalid";
		}
    }

	 // create note name:
	 if ($note != "invalid") {
		return $note.$notesOctave;
	} else {
		return "invalid";
	}
}

// check for upload:
if ($_POST) {
if ($_POST["submitbutton"] == "Upload abc notation") {

if (trim($_POST["abcTextUpload"]) != "") { 
   $abcNotation = trim($_POST["abcTextUpload"]);
   } else {
    // read uploaded file contents:
    
    
    
    
$uploadError = "";
$thisErrorMessage = $_FILES['abcTextFile']['error'];
$uploadedfilesize = $_FILES['abcTextFile']['size'];
    
    
// check file size didn't exceed limit (100k here):
if ($uploadedfilesize > 102400) {
	$uploadError = "file size too large";
} else if (($uploadedfilesize == 0) || ($thisErrorMessage !=0)) {
	// no file uploaded
	$uploadError = "no file selected - or files[error] error code:".$thisErrorMessage;
	// http://uk2.php.net/manual/en/features.file-upload.errors.php

} else {
	
	// get temporary file name:
	$temporaryName = $_FILES['abcTextFile']['tmp_name'];
	
	// check the file has actually been sent by POST
  if (!(is_uploaded_file($_FILES['abcTextFile']['tmp_name']))) {
    $uploadError = "this file wasn't uploaded";
  }

	// check file extension from client's machine:
	$filename = $_FILES['abcTextFile']['name'];
	$dotposition = strrpos($filename, ".");
	if ($dotposition !== false) {
		$fileextension = strtolower(substr($filename, ($dotposition+1), (strlen($filename))));
	} else {
		$fileextension = "";
	} 
	
	if (!(($fileextension == "txt") || ($fileextension == "abc"))) {
	
	$uploadError = "invalid file type";
	}
	
	if ($uploadError == "") {
	$abcNotation= file_get_contents($temporaryName);
	}
	
	}
    
   }

  // parse ABC notation from either file upload or textarea content:

  $individualSongs = explode("X:",$abcNotation);
  // $individualSongs[0] can be ignored as it will either be null or whitespace before the first X:
  $numberOfSongs = count($individualSongs);
  if ($numberOfSongs == 1) {
    // no X header found (if X header found, will create an array with 2 elements) - add X header of 1:
    $numberOfSongs = 2;
    $individualSongs[1] = "1\n".$individualSongs[0];
  }
  for ($eachSong = 1; $eachSong<$numberOfSongs; $eachSong++) {
    // restore the X header and split on line breaks:
    $abcFileContents = split("[\n\r]+", "X:".$individualSongs[$eachSong]);
    // set up defaults
    $tuneIndex = "1";
    $tempo = "120";
    $songTitle = "";
    $timeSignature = "4/4";
    $defaultNoteLength = "1/4";
    $songKey = "F";
    $transcriber = "primary character name";
    $melody = "";
    $kHeaderFound = false;
    $errors = "";

    for ($i = 0; $i<count($abcFileContents); $i++) {
    
      // look for any comments and remove everything after the % if there is one:
      $percentPos = stripos($abcFileContents[$i], "%");
      if ($percentPos !== false) {
        $abcFileContents[$i] = substr($abcFileContents[$i], 0, $percentPos);
      }
    
      $thisLinesContents = trim($abcFileContents[$i]);
      if (substr($thisLinesContents, 1, 1) == ":" ) {
        // is a header:
        switch (substr($thisLinesContents, 0, 1)) {
        case "X":
          $tuneIndex = substr($thisLinesContents,2);
          break;
        case "Q":
          if ($kHeaderFound) {
            // mid-melody change:
            $melody .= $thisLinesContents."%";
          } else {
            $tempo = substr($thisLinesContents,2);
          }
          break;
        case "T":
          // abc can have more than song title, so append them if so:
          if ($songTitle == "") {
            $songTitle = substr($thisLinesContents,2);
          } else {
            $songTitle .= " - ".substr($thisLinesContents,2);
          }
          break;
        case "M":
          if ($kHeaderFound) {
            // mid-melody change:
            $melody .= $thisLinesContents."%";
          } else {
            $timeSignature = substr($thisLinesContents,2);
          }
          break;
        case "L":
          if ($kHeaderFound) {
            // mid-melody change:
            $melody .= $thisLinesContents."%";
          } else {
            $defaultNoteLength = substr($thisLinesContents,2);
          }
          break;
        case "K":
          if ($kHeaderFound) {
            // is a mid-melody key change:
            $melody .= $thisLinesContents."%";
          } else {
            $songKey = processSongKey($thisLinesContents);
            $kHeaderFound = true;
          }
          break;
        case "Z":
          $transcriber = substr($thisLinesContents,2);
          break;
        default:
          // ignore this unsupported header
        }
      } else if ($kHeaderFound) {
        // must be melody now the K header has been passed
        $melody .= $thisLinesContents;
      }
    }
      
    if (!$kHeaderFound) {
      $errors .= "<li>no Key signature header found</li>";
    }
    if ($songTitle == "") {
      $errors .= "<li>no song title found</li>";
    }

    if ($errors == "") {

      // tidy up melody:
      $melody = str_replace(' ', '', $melody);

      $defaultNoteLengthMS = determineNoteLength($tempo, $defaultNoteLength);
      
      $validNotes = "abcdefgz";
      
      // convert all flats to sharps to save on the number of filenames required:
      // keep ab though otherwise this will translate to gs in the wrong octave
    
      $notesInKey = array("c" => array("a" => "a","b" => "b","c" => "c","d" => "d","e" => "e","f" => "f","g" => "g"),
      "g" => array("a" => "a","b" => "b","c" => "c","d" => "d","e" => "e","f" => "fs","g" => "g"),
      "d" => array("a" => "a","b" => "b","c" => "cs","d" => "d","e" => "e","f" => "fs","g" => "g"),
      "a" => array("a" => "a","b" => "b","c" => "cs","d" => "d","e" => "e","f" => "fs","g" => "gs"),
      "e" => array("a" => "a","b" => "b","c" => "cs","d" => "ds","e" => "e","f" => "fs","g" => "gs"),
      "b" => array("a" => "as","b" => "b","c" => "cs","d" => "ds","e" => "e","f" => "fs","g" => "gs"),
      "f#" => array("a" => "as","b" => "b","c" => "cs","d" => "ds","e" => "es","f" => "fs","g" => "gs"),
      "c#" => array("a" => "as","b" => "bs","c" => "cs","d" => "ds","e" => "es","f" => "fs","g" => "gs"),
      "f" => array("a" => "a","b" => "bb","c" => "c","d" => "d","e" => "e","f" => "f","g" => "g"),
      "bb" => array("a" => "a","b" => "bb","c" => "c","d" => "d","e" => "eb","f" => "f","g" => "g"),
      "eb" => array("a" => "ab","b" => "bb","c" => "c","d" => "d","e" => "eb","f" => "f","g" => "g"),
      "ab" => array("a" => "ab","b" => "bb","c" => "c","d" => "db","e" => "eb","f" => "f","g" => "g"),
      "db" => array("a" => "ab","b" => "bb","c" => "c","d" => "db","e" => "eb","f" => "f","g" => "gb"),
      "gb" => array("a" => "ab","b" => "bb","c" => "cb","d" => "db","e" => "eb","f" => "f","g" => "gb"),
      "cb" => array("a" => "ab","b" => "bb","c" => "cb","d" => "db","e" => "eb","f" => "fb","g" => "gb"),
      "am" => array("a" => "a","b" => "b","c" => "c","d" => "d","e" => "e","f" => "f","g" => "g"),
      "dm" => array("a" => "a","b" => "bb","c" => "c","d" => "d","e" => "e","f" => "f","g" => "g"),
      "gm" => array("a" => "a","b" => "bb","c" => "c","d" => "d","e" => "eb","f" => "f","g" => "g"),
      "cm" => array("a" => "ab","b" => "bb","c" => "c","d" => "d","e" => "eb","f" => "f","g" => "g"),
      "fm" => array("a" => "ab","b" => "bb","c" => "c","d" => "db","e" => "eb","f" => "f","g" => "g"),
      "bbm" => array("a" => "ab","b" => "bb","c" => "c","d" => "db","e" => "eb","f" => "f","g" => "gb"),
      "ebm" => array("a" => "ab","b" => "bb","c" => "cb","d" => "db","e" => "eb","f" => "f","g" => "gb"),
      "abm" => array("a" => "ab","b" => "bb","c" => "cb","d" => "db","e" => "eb","f" => "fb","g" => "gb"),
      "em" => array("a" => "a","b" => "b","c" => "c","d" => "d","e" => "e","f" => "fs","g" => "g"),
      "bm" => array("a" => "a","b" => "b","c" => "cs","d" => "d","e" => "e","f" => "fs","g" => "g"),
      "f#m" => array("a" => "a","b" => "b","c" => "cs","d" => "d","e" => "e","f" => "fs","g" => "g#"),
      "c#m" => array("a" => "a","b" => "b","c" => "cs","d" => "ds","e" => "e","f" => "fs","g" => "g#"),
      "g#m" => array("a" => "as","b" => "b","c" => "cs","d" => "ds","e" => "e","f" => "fs","g" => "g#"),
      "d#m" => array("a" => "as","b" => "b","c" => "cs","d" => "ds","e" => "es","f" => "fs","g" => "g#"),
      "a#m" => array("a" => "as","b" => "bs","c" => "cs","d" => "ds","e" => "es","f" => "fs","g" => "g#")
      );
      $songListing = array();

      // process melody:
      $charIndex = 0;
      $modifyNextNote = "";
      while ($charIndex <= strlen($melody)) {
        $baseNote = substr($melody, $charIndex, 1);
        
        // match octaves to Cubase:
        // C, = octave 2
        // C = middle C = octave 3
        // c = octave 4
        // c' = octave 5
        
        // C,D,E,F,G,A,B,   = octave 2
		// CDEFGAB   		= octave 3
		// Cdefgab   		= octave 4
		// c'd'e'f'g'a'b'  	= octave 5

        
        $notesOctave = 4;
        $thisNotesLength = $defaultNoteLengthMS;
        if (strtolower($baseNote) != $baseNote) {
          // note is uppercase
          $notesOctave = 3;
        }
        
        if ($baseNote != "z") {
          // modify base note based on the song's key:
          $modifiedNote = $notesInKey[$songKey][strtolower($baseNote)];
        } else {
          $modifiedNote = $baseNote;
        }
         
        // modify this by any preceding characters:
        if ($modifyNextNote == "^") {
          $modifiedNote = $baseNote."S";
        } else if ($modifyNextNote == "_") {
          $modifiedNote = $baseNote."F";
        } else if ($modifyNextNote == "=") {
          $modifiedNote = $baseNote;
        }

        if (stristr($validNotes, $baseNote) !== false) {
          // is a note - get subsequent characters that will affect this:
          $subseqCharIndex = $charIndex+1;
          $thisSubChar = substr($melody, $subseqCharIndex, 1);
          $modifyNextNote = "";
          while ((stristr($validNotes, $thisSubChar) === false) && ($subseqCharIndex <= strlen($melody))) {
            if (is_numeric($thisSubChar)) {
              $thisNotesLength *= $thisSubChar/;
              // any fractions will be detected next character with the '/' and then the note length will be divided giving the correct fraction
       
            } else {
              switch ($thisSubChar) {
              
                case "K":
                  // find the % character that terminates this key parameter and then process this as the new song key:
                  $percentPos = stripos($melody, "%", $subseqCharIndex);
                  $songKey = processSongKey(substr($melody, $subseqCharIndex, $percentPos-$subseqCharIndex));
                  $subseqCharIndex += $percentPos-$subseqCharIndex;
                  break;
                  
                case "L":
                  // find the % character that terminates this parameter and then process this
                  $percentPos = stripos($melody, "%", $subseqCharIndex);
                  $defaultNoteLength = substr($melody,$subseqCharIndex+2, ($percentPos-$subseqCharIndex-2));
                  $defaultNoteLengthMS = determineNoteLength($tempo, $defaultNoteLength);
                  $subseqCharIndex += $percentPos-$subseqCharIndex;
                  break;
                  
                case "M":
                  // mid-melody time signature change:
                  $percentPos = stripos($melody, "%", $subseqCharIndex);
                  $timeSignature = substr($melody,$subseqCharIndex+2, ($percentPos-$subseqCharIndex-2));
                  $subseqCharIndex += $percentPos-$subseqCharIndex;
                  break;
                  
                case "Q":
                  // mid-melody tempo change:
                  $percentPos = stripos($melody, "%", $subseqCharIndex);
                  $tempo = substr($melody,$subseqCharIndex+2, ($percentPos-$subseqCharIndex-2));
                  $defaultNoteLengthMS = determineNoteLength($tempo, $defaultNoteLength);
                  $subseqCharIndex += $percentPos-$subseqCharIndex;
                  break;
                case "'":
                  $notesOctave ++;
                  break;
                case ",":
                  $notesOctave --;
                  break;
                case "/":
                    // shorter note length - check next character for length:
                    $nextChar = substr($melody, $subseqCharIndex+1, 1);
                    if (is_numeric($nextChar)) {
                      $thisNotesLength /= $nextChar;
                      $subseqCharIndex ++;
                    } else {
                      //default is half:
                      $thisNotesLength /= 2;
                    }             
                    break;
                case "^":
                case "_":
                case "=":
                  $modifyNextNote = $thisSubChar;
                  break;
                default:
                // unsupported character
              }
            }
            $subseqCharIndex ++;
            $thisSubChar = substr($melody, $subseqCharIndex, 1);
          }
          $charIndex = $subseqCharIndex;
        } else {
          $charIndex ++;
        }
        
        
        $thisNotesName = generateFileName($modifiedNote,$notesOctave);
        if ($thisNotesName != "invalid") {
			array_push($songListing, array($thisNotesName, $thisNotesLength));
        }
      }
      echo $melody."<hr />";
      print_r(array_values($songListing));
    } else {
      echo "<p>Sorry, but errors were found with in song #".$eachSong.". Please fix this and re-try:</p><ul>".$errors."</ul>\n";
    }
  }
}
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Autumn Earth</title>
<meta content="salmacis" name="keywords" />
<meta content="john@salmacis.co.uk" name="author" />
<meta content="isometric world" name="description" />
<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />
<meta content="no" http-equiv="imagetoolbar" />
<script language="javascript" src="/includes/core.js" type="text/javascript"></script>

<script type="text/javascript">
function showUploadAnimation() {
// check it's an upload, not text entry:
if (document.abcForm.abcTextFile.value != "") {
// ######## do this properly with get element not using invalid form name
  if (getElement('workingIcon')) {
    if(thiselement) {
      thiselement.style.display='block';
    }
  }
}

}
</script>

<style type="text/css">

#workingIcon {
width: 45px;
height: 45px;
background: url(/development/architect/working_progress.gif) no-repeat left top;
display: none;
}

</style>

</head>
<body>
<h2>Requirements</h2>
<ul>
<li>Any mid-song tempo, time signature, default note length or key changes need to be on a new line</li>
<li>All headers must start on a new line</li>
<li>The song notes must have the key header immediately before them</li>
<li>The song must have a title</li>
<li>Multiple songs can be added if separated by X headers</li>
<li>If not specified, a tempo of 120, time signature of 4/4, default note length of 1/4 and song key of F is assumed</li>
<li>Currently only major and minor scales are supported (althogh individual notes can be modified with ^ _ and =)</li>
<li>maximum note length = 12 seconds</li>
</ul>

<h2>unsupported:</h2>
<ul>
<li>volume dynamics</li>
<li>repeats</li>
<li>duplets/broken rhythms/irish rolls</li>
<li>chords</li>
<li>slurs</li>
<li>double sharps or double flats</li>
</ul>

<pre><code>X:1
T:Brandywine Bridge
C:Composer:
N:Remarks:
Q:1/4=120
V:1
M:4/4
L:1/8
K:F
e3 f ed 
c2 |B2 d2 c3 z |GB c2 BG F2 |D2 EF G2 G2
z2 cd cd e2 |c2 f2 ed c2 |z2 fe c2 fe |f g3 g4 |]
%End of file</code></pre>

<form action="upload.php" name="abcForm" id="abcForm" enctype="multipart/form-data" method="post">
<fieldset>
<label for="abcTextUpload">paste notation:</label>
<textarea cols="6" rows="4" style="width:300px; height: 120px;" id="abcTextUpload" name="abcTextUpload"></textarea>

<input type="hidden" name="MAX_FILE_SIZE" value="102400" />
<label for="abcTextFile">or by upload:</label>
<input type="file" name="abcTextFile" id="abcTextFile" /> 

<input type="submit" name="submitbutton" id="submitbutton" value="Upload abc notation" onclick="showUploadAnimation();" />
</fieldset>
</form>
<div id="workingIcon">&nbsp;</div>
</body>
</html>