<?php

$thisurl = $_SERVER['PHP_SELF'];
if ($getdata != "") {
	$thisurl .= "?".$getdata;
}

$stylecookie = "";
if (isset($_GET["style"])) {

$chosenstyle = $_GET["style"];
if (($chosenstyle == "default") || ($chosenstyle == "accessible")) {
 //  write cookie:
 // expires in 30 days (60*60*24*30)
		setcookie("stylechosen", $chosenstyle, time()+2592000, "/");
		$stylecookie = $chosenstyle;
}

		
	} else {
		// try and read style cookie:
		if (isset($_COOKIE['stylechosen'])) {
		
		$stylecookie = $_COOKIE['stylechosen'];
		}
	}

?>



<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>Autumn Earth</title>
<meta content="Autumn Earth Community Forums" name="description" />

<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />
<meta content="no" http-equiv="imagetoolbar" />
<link rel="stylesheet" href="/assets/base.css" type="text/css" media="all" />
<link rel="stylesheet" href="/assets/print.css" type="text/css" media="print" />


<?php



if ($stylecookie != "") {
	if ($stylecookie == "default") {
		echo '<link rel="stylesheet" title="default style" href="/assets/default.css" type="text/css" />'."\n";
		echo '<link rel="alternate stylesheet" title="accessible style" href="/assets/accessible.css" type="text/css" />'."\n";
	} else {
		echo '<link rel="alternate stylesheet" title="default style" href="/assets/default.css" type="text/css" />'."\n";
		echo '<link rel="stylesheet" title="accessible style" href="/assets/accessible.css" type="text/css" />'."\n";
	}
} else {
echo '<link rel="stylesheet" title="default style" href="/assets/default.css" type="text/css" />'."\n";
echo '<link rel="alternate stylesheet" title="accessible style" href="/assets/accessible.css" type="text/css" />'."\n";
}
?>





<script language="javascript" src="/includes/core.js" type="text/javascript"></script>

</head>
<body onload="preloads('/assets/tooltips/ttip_topbig.gif','/assets/tooltips/ttip_bottom.gif','/assets/login_over.gif')">

<div id="Wrapper">
header<br />
<a href="/">main page</a><br /><br /><div id="LoginBlock">



<?php

echo '<a href="'.$thisurl.'?style=default">default style</a> | <a href="'.$thisurl.'?style=accessible"">accessible style</a>';
?>
<div class="Error">not logged in</div>
<br />

<form action="/index.php" method="post" name="loginform">
<label for="loginname">enter user name</label>
<input id="loginname" type="text" name="loginname" />
<br />
<label for="pword">enter password</label>
<input id="pword" type="password" name="pword" />
<br />
<label for="rememberme">Remember me</label> 
<input type="checkbox" value="yes" name="rememberme" id="rememberme" /> <a href="#">(what this does)</a><br />
<br />
<a href="/account/ResendPassword.php" title="Click to get password sent to you">forgotten your password?</a>

<br /><br />
<input type="hidden" name="logincheck" value="posted" />
<input type="image" name="subbutton" id="subbutton" value="log in" src="/assets/login.gif" alt="log in" onmouseover="this.src='/assets/login_over.gif';" onmouseout="this.src='/assets/login.gif'" />
</form>
<br />
<a href="/account/CreateAccount.php" title="Create a new account">Create a new account</a>
</div>
<h1>Autumn Earth</h1>&ldquo;Autumn Earth&rsquo;s site is still being developed&rdquo;<br /><a href="http://www.google.com">external link</a><br /><a href="http://www.autumnearth.com/mail/">internal link - full path</a><br /><a href="/mail/">internal link - relative path</a><br /><br /><a href="/forum/" title="Click to view the forums">Forum</a> | <a href="/mail/" title="Click to view your mail">Mail</a> | <a href="/auction/" title="Click to visit the Auction House">Auction</a>

<hr />
<h2>news</h2>



<h3>Spring is on its way</h3><p><strong>3rd January 2007</strong></p>
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. <br /><a href="/news/index.php?article=1" title="Click for the full article">continues...</a>
<br />----------------<p><strong>New Year spectacular</strong> - 3rd January 2007 - posted by The Mayor<br />Fireworks and plenty of festive cheer <a href="/news/index.php?article=2" title="Click for the full article">read more...</a></p>

----------------<p><strong>more seasonal joy</strong> - 2nd January 2007<br />brace yourselves! <a href="/news/index.php?article=3" title="Click for the full article">read more...</a></p>


<hr />

<hr />
<h3>events calendar</h3>



<img src="/assets/calendar/April.jpg" width="175" height="84" alt="Events being held in April" /><br />
<a href="/index.php?year=2007&amp;month=3">&lt; </a>April 2007<a href="/index.php?year=2007&amp;month=5"> &gt;</a>
<table id="Calendar" summary="Events Calendar for April">
<tr><td class="DateItem">Mon</td><td class="DateItem">Tue</td><td class="DateItem">Wed</td><td class="DateItem">Thu</td><td class="DateItem">Fri</td><td class="DateItem">Sat</td><td class="DateItem">Sun</td></tr>
<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>

<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>
<td class="DateItem">1</td>
</tr>
<tr><td class="DateItem">2</td>
<td class="DateItem">3</td>
<td class="DateItem">4</td>
<td class="DateItem">5</td>
<td class="DateItem">6</td>
<td class="DateItem">7</td>

<td class="DateItem">8</td>
</tr>
<tr><td class="DateItem">9</td>
<td class="DateItem">10</td>
<td class="DateItem">11</td>
<td class="DateItem">12</td>
<td class="DateItem">13</td>
<td class="DateItem">14</td>
<td class="DateItem">15</td>

</tr>
<tr><td class="DateItem">16</td>
<td class="DateItem">17</td>
<td class="DateItem">18</td>
<td class="DateItem">19</td>
<td class="DateItem"><div id="today">20</div>
</td>
<td class="DateItem">21</td>
<td class="DateItem">22</td>
</tr>

<tr><td class="DateItem">23</td>
<td class="DateItem">24</td>
<td class="DateItem">25</td>
<td class="DateItem">26</td>
<td class="DateItem">27</td>
<td class="DateItem">28</td>
<td class="DateItem">29</td>
</tr>
<tr><td class="DateItem">30</td>

<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>
<td class="DateItem">&nbsp;</td>
</tr>
<tr></table>
<div id="tooltipevent" class="ttip">
<div class="ttiptop">
<div id="ttipdyn" name="ttipdyn"><p>click for event details</p></div>
	</div>
	<div class="ttipbottom">&nbsp;</div>
</div>

<hr />

<hr />
<h3>current poll</h3>

<form name="pollForm" id="pollForm" method="post" action="/index.php">
<p>is this site finished yet?</p>
<input type="radio" name="pollOption" checked="checked" id="pollOption1" value="1" /> <label for="pollOption1">yes</label><br />
<input type="radio" name="pollOption" id="pollOption2" value="2" /> <label for="pollOption2">no</label><br />
<input type="radio" name="pollOption" id="pollOption3" value="3" /> <label for="pollOption3">don't know</label><br />

<input type="hidden" name="pollID" value="1" />
<input type="submit" name="mainPollButton" value="Vote" />
</form>
<p><a href="ViewPollResults.php?poll=1" title="display the results for this poll">show results</a></p>

<hr /><br /><br />footer</div>
</body>
</html>