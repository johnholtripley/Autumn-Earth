<?php
/*
include("includes/session.inc");
include("includes/signalnoise.php");
include("includes/connect.php");
include("includes/functions.inc");
include("includes/header.inc");
include("includes/pagehead.inc");

echo'<h1>Autumn Earth</h1>';

echo smartPunctuation('"Autumn Earth\'s site is still being developed"');
echo '<br />';
echo '<a href="http://www.autumnearth.com/feed/" title="Subscribe to the RSS 2.0 feed"><img src="/assets/feeds/rss2.gif" width="46" height="15" alt="RSS 2.0 icon" /></a>'."\n";
echo '<a href="http://www.autumnearth.com/feed/atom.php" title="Subscribe to the Atom 1.0 feed"><img src="/assets/feeds/atom1.gif" width="52" height="15" alt="Atom 1.0 icon" /></a>'."\n";
echo '<br />';

echo'<a href="/forum/" title="Click to view the forums">Forum</a> | <a href="/mail/" title="Click to view your mail">Mail</a> | <a href="/auction/" title="Click to visit the Auction House">Auction</a>'."\n";

include("includes/news.php");
include("includes/calendar.php");
include("includes/mainPoll.php");

include("includes/login.inc");

include("includes/close.php");
include("includes/footer.inc");
*/
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
<meta content="Autumn Earth" name="description" />
<meta http-equiv="content-type" content="text/html;charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta http-equiv="imagetoolbar" content="no"  />
<meta name="MSSmartTagsPreventParsing" content="true"  />
<meta name="robots" content="noodp" />

<title>Autumn Earth</title>

<link rel="meta" type="application/rdf+xml" title="dublin" href="meta.rdf" />
<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="http://feeds.feedburner.com/autumnearth" />
<link rel="shortcut icon" href="favicon.ico" />
<link rel="apple-touch-icon" href="apple-touch-icon-precomposed.png" />


<style type="text/css">

html {
height: 100%;
}

* {
padding: 0;
margin: 0;
}

body {
background: #000 url(images/autumn-earth.gif) no-repeat center center;
height: 100%;
}

h1 {
position: absolute;
text-indent: -9999px;
}
</style>

<?php
// http://mathiasbynens.be/notes/async-analytics-snippet
include("includes/google-analytics.php");
?>


<?php 
// http://developer.yahoo.com/performance/rules.html
flush(); 
?>


</head>
<body>

<h1>Autumn Earth</h1>




<?php
/*
echo '<!-- <script type="text/javascript" src="http://static.ak.connect.facebook.com/js/api_lib/v0.4/FeatureLoader.js.php/en_US"></script><script type="text/javascript">FB.init("f36928a0f3b8ccc280a3097b8894147a");</script><fb:fan profile_id="141824743233" stream="1" connections="10" width="300"></fb:fan><div style="font-size:8px; padding-left:10px"><a href="http://www.facebook.com/pages/Autumn-Earth/141824743233">Autumn Earth on Facebook</a> </div> /--> ';
*/



?>
</body>
</html>