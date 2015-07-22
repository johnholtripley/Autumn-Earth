<?php

$thisloginisvalid = false;
echo'<div id="LoginBlock">'."\n";

if (isset($loginerror)) {
echo '<div class="Error">'.$loginerror.'</div>'."\n";
}



// check if username exists in session:
if (@$_SESSION['username']) {
	echo "logged in as " . stripslashes($_SESSION['username'])."\n";
	

	
	if (@ $_SESSION['isadmin']) {
		echo '- <em>administrator</em>';
	} else if (@ $_SESSION['ismod']) {
		echo '- <em>moderator</em>';
	} 
	
	
	
	// check for mail:
			$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as useracctid
FROM tblMail
INNER JOIN tblacct on tblMail.accountID = tblacct.accountID
WHERE tblacct.accountName='".$_SESSION['username']."' and tblmail.mailread = '0'";
	$result2 = mysql_query($query) or die ("couldn't execute query2");
	
		$returned2 = mysql_num_rows($result2);
	
	if ($returned2 > 0) {
		// user has new mail
		$hasmail = "true";
		// show new mail icon
	 echo '<br /><a href="/mail/" class="ttipanchor" onmouseover="tooltip(\'tooltipone\');" onmouseout="exit(\'tooltipone\');"><img src="/assets/mail/new_mail.gif" width="31" height="31" alt="you have new mail" /></a>'."\n";
	} else {
		$hasmail = "false";
	}
	
	?>
	<div id="tooltipone" class="ttip">
<div class="ttiptop">
<!-- preload any images used in the tooltip? /-->
	<p>you have unread mail</p></div>
	<div class="ttipbottom">&nbsp;</div>
</div>
	<?php 
		
		$_SESSION['hasmail'] = $hasmail;
	
	

	
	// display log out form:
	echo '<br />'."\n";
	echo '<a href="/account/ManageAccount.php" title="Click to change your Account details">Manage your Account</a>'."\n";

	echo '<form action="' . $thisurl . '" method="post" name="logoutform" id="logoutform">'."\n";
	echo '<input type="submit" name="subbutton" value="log out" />'."\n";
	echo '</form>';
} else if (isset($_COOKIE['remembername']) && isset($_COOKIE['rememberp']) && $loggedout==false) {


	// details exist in cookies - and the user hasn't just logged out
	// don't trust the information - validate it:
      $processedlogin = htmlCharsToEntities($_COOKIE['remembername']);
      $processedpassword = htmlCharsToEntities($_COOKIE['rememberp']);
      
    
      
      $pwordkey = $dbpk . strtolower(substr($processedlogin, 0, 2));

		$query = "select AES_DECRYPT(password,'".$pwordkey."') AS encpword, accountid from tblacct where accountName='" . $processedlogin . "'";
		
		



		
		
		
	$result = mysql_query($query) or die ("couldn't execute query");
	
	$returned = mysql_num_rows($result);
	


	if ($returned > 0) {
		// name exists, 



		$row = mysql_fetch_array($result);
		extract($row);
		
	
		// check password matches 
if(!isset($accountType)) {
	$accountType = 0;
}


		if (crypt($encpword, $cryptSalt) == $processedpassword) {
			// check account type:
		switch ($accountType) {
		case "1":
			$ismod = true;
			$isadmin = false;
		break;
		case "2":
			$ismod = false;
			$isadmin = true;
		break;
		default:
			$ismod = false;
			$isadmin = false;
		}
		
		// check for mail:
			$query = "SELECT tblMail.*, tblacct.accountID, tblacct.accountName as useracctid
FROM tblMail
INNER JOIN tblacct on tblMail.accountID = tblacct.accountID
WHERE tblacct.accountName='".$processedlogin."' and tblmail.mailread = '0'";
	$result = mysql_query($query) or die ("couldn't execute query2");
	
		$returned = mysql_num_rows($result);
	
	if ($returned > 0) {
		// user has new mail
		$hasmail = "true";
	} else {
		$hasmail = "false";
	}
	

		
		// set session values
		$_SESSION['username'] = $processedlogin;
		$_SESSION['ismod'] = $ismod;
		$_SESSION['isadmin'] = $isadmin;
		$_SESSION['hasmail'] = $hasmail;

		
		
			
		echo "logged in as " . stripslashes($processedlogin);

	if ($_SESSION['isadmin']) {
		echo '- <em>administrator</em>';
	} else if ($_SESSION['ismod']) {
		echo '- <em>moderator</em>';
	} 
	
	if ($_SESSION['hasmail'] == "true" ) {
	// show new mail icon
	 echo '<br /><a href="/mail/" class="ttipanchor" onmouseover="tooltip(\'tooltipone\');" onmouseout="exit(\'tooltipone\');"><img src="/assets/mail/new_mail.gif" width="31" height="31" alt="you have new mail" /></a>'."\n";
	}
		
		
	
	// display log out form:
	echo '<br />'."\n";
	echo '<a href="/account/ManageAccount.php" title="Click to change your Account details">Manage your Account</a>'."\n";
	echo '<br /><br />'."\n";
	echo '<form action="' . $thisurl . '" method="post" name="logoutform">'."\n";
	echo '<input type="submit" name="subbutton" value="log out">'."\n";
	echo '</form>'."\n";
		} else {
		
		
		echo '<div class="Error">not logged in</div>'."\n";
	echo '<br />';
	// display log in form:
	echo '<form action="' . $thisurl . '" method="post" name="loginform">'."\n";
	echo '<label for="loginname">enter user name</label>'."\n";
	echo '<input id="loginname" type="text" name="loginname" />'."\n";
	echo '<br />'."\n";
	echo '<label for="pword">enter password</label>'."\n";
	echo '<input id="pword" type="password" name="pword" />'."\n";
	echo '<br />'."\n";
	echo '<label for="rememberme">Remember me</label> '."\n";
	echo '<input type="checkbox" value="yes" name="rememberme" id="rememberme" /> <a href="#">(what this does)</a><br />'."\n";
	echo '<br />'."\n";
	echo '<a href="/account/ResendPassword.php" title="Click to get password sent to you">forgotten your password?</a>'."\n";
	echo '<br /><br />'."\n";
	
	if (@$placebid) {
	// if this is on the log in page, then pass on the POST data
	echo '<input type="hidden" name="item" value="'.$_POST["item"].'" />'."\n";
	echo '<input type="hidden" name="sellerid" value="'.$_POST["sellerid"].'" />'."\n";
	echo '<input type="hidden" name="itemgraphic" value="'.$_POST["itemgraphic"].'" />'."\n";
			echo '<input type="hidden" name="itemquantity" value="'.$_POST["itemquantity"].'" />'."\n";
	}
	
	echo '<input type="hidden" name="logincheck" value="posted" />'."\n";
	echo '<input type="image" name="subbutton" value="log in" src="/assets/login.gif" alt="Log in" onmouseover="this.src=\'/assets/login_over.gif\';" onmouseout="this.src=\'/assets/login.gif\'" />'."\n";

	
	
	echo '</form>'."\n";
	echo '<br />'."\n";
	echo '<a href="/account/CreateAccount.php" title="Create a new account">Create a new account</a>'."\n";
		
		
		}
		

}
	
	
} else {
	echo '<div class="Error">not logged in</div>'."\n";
	echo '<br />'."\n";
	// display log in form:
	echo '<form action="' . $thisurl . '" method="post" name="loginform">'."\n";
	echo '<label for="loginname">enter user name</label>'."\n";
	echo '<input id="loginname" type="text" name="loginname" />'."\n";
	echo '<br />'."\n";
	echo '<label for="pword">enter password</label>'."\n";
	echo '<input id="pword" type="password" name="pword" />'."\n";
	echo '<br />'."\n";
	echo '<label for="rememberme">Remember me</label> '."\n";
	echo '<input type="checkbox" value="yes" name="rememberme" id="rememberme" /> <a href="#">(what this does)</a><br />'."\n";
	echo '<br />'."\n";
	echo '<a href="/account/ResendPassword.php" title="Click to get password sent to you">forgotten your password?</a>'."\n";
	echo '<br /><br />'."\n";
		if (@$placebid) {
	// if this is on the log in page, then pass on the POST data
	echo '<input type="hidden" name="item" value="'.$_POST["item"].'" />'."\n";
	echo '<input type="hidden" name="sellerid" value="'.$_POST["sellerid"].'" />'."\n";
		echo '<input type="hidden" name="itemgraphic" value="'.$_POST["itemgraphic"].'" />'."\n";
			echo '<input type="hidden" name="itemquantity" value="'.$_POST["itemquantity"].'" />'."\n";
	}
	echo '<input type="hidden" name="logincheck" value="posted" />'."\n";
	echo '<input type="image" name="subbutton" id="subbutton" value="log in" src="/assets/login.gif" alt="log in" onmouseover="this.src=\'/assets/login_over.gif\';" onmouseout="this.src=\'/assets/login.gif\'" />'."\n";
	echo '</form>'."\n";
	echo '<br />'."\n";
	echo '<a href="/account/CreateAccount.php" title="Create a new account">Create a new account</a>'."\n";
}

echo'</div>'."\n";

/*
	echo '<form action="'.$thisurl.'" method="post">'."\n";
	echo '<fieldset>'."\n";
	// echo '<a href="'.$thisurl.'?style=default" class="IsAccessKey" accesskey="D">default style</a> | <a href="'.$thisurl.'?style=accessible" class="IsAccessKey" accesskey="A">accessible style</a>';
	// use POST so google doesn't index the accessible style as additional content
	echo '<input type="submit" name="styleDefault" value="default style">'."\n";
	echo '<input type="submit" name="styleAccess" value="accessible style">'."\n";
	echo '</fieldset>'."\n";
	echo '</form>'."\n";
*/



?>