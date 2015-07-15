<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

// check if submit button has been pressed:
if (isset($_POST["savedContent"])) {
    $thispageid=$_POST["pageid"];
    $postcontents = htmlCharsToEntities($_POST["savedContent"]);


    // firefox's output for align/justify is fine, but ie uses attributes:
    // eg <p align=right> so do a search and replace on this:
    $postcontents = str_ireplace("align=center","style=\"text-align: center;\"",$postcontents);
    $postcontents = str_ireplace("align=justify","style=\"text-align: justify;\"",$postcontents);
    $postcontents = str_ireplace("align=right","style=\"text-align: right;\"",$postcontents);
    $postcontents = str_ireplace("align=left","style=\"text-align: left;\"",$postcontents);
   

    $thisTextColour = trim($_POST["wrappertextColour"]);
    // remove # at start if there is one:
    if (substr($thisTextColour, 0, 1) == "#") {
      $thisTextColour = substr($thisTextColour, 1, (strlen($thisTextColour)-1));
    }
    $thisBGColour = trim($_POST["wrapperbackgroundColour"]);
    // remove # at start if there is one:
    if (substr($thisBGColour, 0, 1) == "#") {
      $thisBGColour = substr($thisBGColour, 1, (strlen($thisBGColour)-1));
    }

    $error = "";
    if (!(validHexColour($thisTextColour))) {
      $error="Font colour wasn't saved because it wasn't valid";
    }

    if (!(validHexColour($thisBGColour))) {
       $error="Background colour wasn't saved because it wasn't valid";
    }


$thisPageTitle = trim(htmlCharsToEntities($_POST["pageTitle"]));
$thisSelectedFont = $_POST["fontSelector"];
if ($_POST["publicPage"] == "1") {
		$processedPublic = "1";
	} else {
		$processedPublic = "0";
	}

    if ($error=="") {

    

    $query = "update tblFreeformPages SET pageContent = '".$postcontents."', textColour = '".$thisTextColour."', bgColour='".$thisBGColour."', freeformPageTitle='".$thisPageTitle."', public='".$processedPublic."',fontfamily='".$thisSelectedFont."', creationTime=NOW() WHERE pageID='".$thispageid."'";

    $result = mysql_query($query) or die ("couldn't execute query");
$jsinclude = "htmlEditor";
$onloadfunc = "editorSetup";
    include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
    echo '<h2 style="color: #000;background:#fff;" id="textToFade" name="textToFade">Changes made</h2>'."\n";
    // write JS out for text fade:
    echo '<script type="text/javascript">//<![CDATA[
    colourValue=0;startFade(); //]]>
    </script>'."\n";
    
    echo '<p><a href="viewPage.php?whichpage='.$thispageid.'">View this page</a></p>'."\n";
    } else {
    // save details other than the font and bg colours:
    

    $query = "update tblFreeformPages SET pageContent = '".$postcontents."', freeformPageTitle='".$thisPageTitle."', public='".$processedPublic."',fontfamily='".$thisSelectedFont."' WHERE pageID='".$thispageid."'";

    $result = mysql_query($query) or die ("couldn't execute query");
    $jsinclude = "htmlEditor";
$onloadfunc = "editorSetup";
    include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
    echo '<p class="Error">'.$error.'</p>'."\n";
    }
} else {
$jsinclude = "htmlEditor";
$onloadfunc = "editorSetup";
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
}
// check for login:
$hasAccess = false;


// check for GET data:
			$pageID = $_GET["whichpage"];
			// check that a valid number has been passed:
			
			if (is_numeric($pageID)) {
			
			$query = "select tblFreeformPages.*, tblGuilds.guildName
			from tblFreeformPages
			inner join tblGuilds on tblFreeformPages.guildID = tblGuilds.guildID
			WHERE tblFreeformPages.status='1' AND tblFreeformPages.pageID='".$pageID."'";
			$result = mysql_query($query) or die ("couldn't execute query");
			
			
			
			if (mysql_num_rows($result) > 0) {
			$row = mysql_fetch_array($result);
				extract($row);
				
				echo '<h1>'.$guildName.' guild pages</h1>'."\n";
			
			if (@$_SESSION['username']) {
			
			// check to see if the user logged in's current character is the correct guild for this page:
			$loggedInName = $_SESSION['username'];
			$query2 = "select tblAcct.currentCharID, tblAcct.accountName, tblGuildMembers.guildID
			from tblAcct
			inner join tblGuildMembers on tblGuildMembers.charID = tblAcct.currentCharID
			where tblAcct.accountName = '".$loggedInName."' and tblGuildMembers.guildID = '".$guildID."'";
				$result2 = mysql_query($query2) or die ("couldn't execute query");
			if (mysql_num_rows($result2) > 0) {
				$hasAccess = true; 
			}
		if ($hasAccess) {
			
			
			// show list of all pages this guild has:
			include($_SERVER['DOCUMENT_ROOT']."/includes/displayGuildPages.php");
			
			echo '<iframe src ="editableContent.php?whichpage='.$pageID.'" frameborder="0" id="customWrapper" name="customWrapper">'."\n";
			?>
			<p>If you can see this, your browser doesn't understand iframes, so you won't get the full functionality - sorry about that. #### it would be nice to have a textarea here though...</p>
			
			</iframe>
			<div id="SourceMode" name="SourceMode">You are in HTML source mode</div>
			<noscript><p>sorry, but javascript must be enabled to use the full editor.</p>
			<form><textarea>add your content here though</textarea></form></noscript>
			<br />
			
			<button onclick="doEditCommand('undo')">Undo</button>
			<button onclick="doEditCommand('redo')">Redo</button>
			<button onclick="checkAttributes();toggleSourceCode();">toggle source</button><br />
			<button onclick="doEditCommand('subscript');">subscript</button>
			<button onclick="doEditCommand('superscript');">superscript</button>
			<label for="blockFormatting">block format: </label>
			<select id="blockFormatting" name="blockFormatting" onchange="doBlockFormatting(this.value);"><br />
			<option value="null">please select...</option>
			<option value="p">Paragraph</option>
			<option value="h1">Heading 1</option>
			<option value="h2">Heading 2</option>
			<option value="h3">Heading 3</option>
			<option value="h4">Heading 4</option>
			<option value="h5">Heading 5</option>
			<option value="h6">Heading 6</option>
			<option value="pre">preformatted</option>
			</select><br />
			<button onclick="doEditCommand('insertOrderedList');">insert numbered list</button>
			<button onclick="doEditCommand('insertUnorderedList');">insert bulleted list</button>
			<button onclick="doEditCommand('insertHorizontalRule');">insert line</button>
			<button onclick="doEditCommand('selectAll');">select all</button>
			
			<button onclick="doEditCommand('unlink');">remove link</button>
			<button onclick="doEditCommand('removeFormat');">remove formatting</button><br />
			<button onclick="wrapHTMLTags('strong','');">bold</button>
			<button onclick="wrapHTMLTags('em','');">italic</button>
			<button onclick="wrapHTMLTags('span','text-decoration: underline');">underline</button>
			<button onclick="wrapHTMLTags('span','text-decoration: line-through');">strikethrough</button>
			<button onclick="return openPopup('palette.php?picker=forecolour','palette','200','280');">fore colour</button>
			<button onclick="return openPopup('palette.php?picker=bgcolour','palette','200','280');">background colour</button>
			
			<br />
			<br />
			
			<button onclick="return openPopup('insertTable.php','insertTable','400','480');">insert table</button>
			<br />

			
			<button onclick="checkAttributes();doEditCommand('justifyleft');">align left</button>
			<button onclick="checkAttributes();doEditCommand('justifyright');">align right</button>
			<button onclick="checkAttributes();doEditCommand('justifycenter');">align center</button>
			<button onclick="checkAttributes();doEditCommand('justifyfull');">align justify</button>
			<br />
			<hr />
			
			<button onclick="return openPopup('manageImages.php','imageManagement','460','520');">Insert/Manage Image</button>
			<button onclick="return openPopup('specialCharacters.php','specialCharacters','400','480');">special characters</button><br />
			
		
			<button>insert link</button>
			<button>insert smiley</button>
			
			<button>insert flash</button>


			
			<br />
			<br />
			
			
			<button>insert row</button>
			<button>delete row</button>
			<button>insert column</button>
			<button>delete column</button>
				<button>insert cell</button>
			<button>delete cell</button>
			<button>merge cells</button>
			<button>split cells</button>
			<button>row properties?</button>
			<button>cell properties?</button>
			<br />
			<br />
			
			<button>downloadable files?</button>
			<button>spell checker?</button>
			<button>find?</button>
			<button>find and replace?</button>
			<button>forms and inputs?</button>
			
		
			<br />
			<br />
			needs signed javascript:<br />
			<button>copy?</button>
			<button>cut?</button>
			<button>paste?</button>
			<button>paste from word?</button>
			
			<hr />
			
			<?php
			
			$fontOptions = array('Arial' => 'Arial, Helvetica, sans-serif','Times New Roman' => '\'Times New Roman\', Times, serif','Courier' => '\'Courier New\', Courier, monospace','Georgia' => 'Georgia, \'Times New Roman\', Times, serif','Verdana' => 'Verdana, Arial, Helvetica, sans-serif','Geneva' => 'Geneva, Arial, Helvetica, sans-serif','Trebuchet' => '\'Trebuchet MS\', Verdana, Arial, Helvetica, sans-serif');
			
				echo '<form action="' . $thisurl . '" method="post" name="saveContentForm" id="saveContentForm" />'."\n";
				echo '<input type="hidden" name="savedContent" id="savedContent" value="" />'."\n";
        echo '<br />'."\n";
        
                
                
        echo '<label for="inlinefontselector">font: </label>'."\n";
				echo '<select id="inlinefontselector" name="inlinefontselector" onchange="wrapHTMLTags(\'span\',\'font-family: \'+document.saveContentForm.inlinefontselector.value);">'."\n";
        foreach ($fontOptions as $key => $value) {
					echo '<option value="'.$value.'"';
					if ($value == $fontfamily) {
						echo ' selected="selected"';
					}
					echo ' style="font-family: '.$value.';">'.$key.'</option>'."\n";
				}
				echo '</select>'."\n";
        echo '<br />'."\n";
        
        
        
       echo '<label for="inlinesizeselector">font size: </label>'."\n";
       echo '<select id="inlinesizeselector" name="inlinesizeselector" onchange="wrapHTMLTags(\'span\',\'font-size: \'+document.saveContentForm.inlinesizeselector.value);">'."\n";
       echo '<option value="xx-small">xx small</option>'."\n";
       echo '<option value="x-small">x small</option>'."\n";
       echo '<option value="small">small</option>'."\n";
       echo '<option value="medium" selected="selected">standard</option>'."\n";
       echo '<option value="large">large</option>'."\n";
       echo '<option value="x-large">x large</option>'."\n";
       echo '<option value="xx-large">xx large</option>'."\n";
       echo '</select>'."\n";
        echo '<br />'."\n";
				
					echo '<label for="pageTitle">page title: </label> '."\n";
				echo '<input type="text" name="pageTitle" id="pageTitle" value="'.$freeformPageTitle.'" />'."\n";
				echo '<br />'."\n";
					
			if ($public == "1") {
			echo'<input type="radio" name="publicPage" id="publicPage1" value="1" checked="checked" /> <label for="publicPage1">anyone can view this page</label> <input type="radio" name="publicPage" id="publicPage2" value="0" /> <label for="publicPage2">only guild members can view this page</label>';
			} else {
			echo'<input type="radio" name="publicPage" id="publicPage1" value="1" /> <label for="publicPage1">anyone can view this page</label> <input type="radio" name="publicPage" id="publicPage2" value="0" checked="checked" /> <label for="publicPage2">only guild members can view this page</label>';
			}
			echo '<br />'."\n";
			
				echo '<label for="wrappertextColour">page text colour: </label> (eg. ffffff)'."\n";
				echo '#<input type="text" name="wrappertextColour" id="wrappertextColour" onchange="updateColours()" value="'.$textColour.'" />'."\n";
				echo '<span class="JsHidden" id="textColourValid">NOT VALID</span>'."\n";
				echo '<a href="palette.php?picker=text" onclick="return openPopup(this.href,\'palette\',\'200\',\'280\');">open palette</a>'."\n";
				echo '<br />'."\n";
				echo '<label for="wrapperbackgroundColour">page background colour: </label> (eg. ffffff)'."\n";
				echo '#<input type="text" name="wrapperbackgroundColour" id="wrapperbackgroundColour" onchange="updateColours()" value="'.$bgColour.'" />'."\n";
				echo '<span class="JsHidden" id="backgroundColourValid">NOT VALID</span>'."\n";
				echo '<a href="palette.php?picker=background" onclick="return openPopup(this.href,\'palette\',\'200\',\'280\');">open palette</a>'."\n";
				echo '<br />'."\n";
				
				echo '<label for="fontSelector">standard font: </label>'."\n";
				echo '<select id="fontSelector" name="fontSelector" onchange="setNewFont()">'."\n";
				
				
				
				foreach ($fontOptions as $key => $value) {
					echo '<option value="'.$value.'"';
					if ($value == $fontfamily) {
						echo ' selected="selected"';
					}
					echo ' style="font-family: '.$value.';">'.$key.'</option>'."\n";
				}
				echo '</select>'."\n";
				echo '<br />'."\n";
				
				echo '<input type="hidden" name="pageid" id="pageid" value="'.$pageID.'" />'."\n";
				echo '<input type="submit" name="subbutton" onclick="saveSource(); return false;" value="save changes" />'."\n";
				echo '</form>';
			
			} else {
		echo'<p class="Error">you can only edit this page in you belong to this guild</p>';
		}
			
			
} else {
echo'<p class="Error">you must be logged in to edit a page</p>';
}
				
				
				} else {
				echo'<p class="Error">page doesn\'t exist</p>';
				}
				

			
			} else {
			echo'<p class="Error">Unknown page id</p>';
			}
		







include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>