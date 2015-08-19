<!doctype html>
<?php
$htmlClass = "";
// check if font has already been loaded, and the cookie set. If so, add the class so the font shows immediately as it's probably in cache:
if(isset($_COOKIE['fontLoaded'])) {
if($_COOKIE['fontLoaded'] == "true") {
$htmlClass = ' class="fontsLoaded"';
}
}
?>
<html lang="en-gb"<?php echo $htmlClass; ?>>
<head>

<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/title-tag.php");
?>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="author" href="http://google.com/+JohnHoltRipley">

<script>
    var cutsTheMustard = false;
    if('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {
     cutsTheMustard = true;
      document.documentElement.className += " js";
     }
  </script>

<!--[if (gt IE 8) | (IEMobile)]><!-->
    <link href="/css/base.css" rel="stylesheet" />
<!--<![endif]-->
<!--[if (lt IE 9) & (!IEMobile)]>
    <link href="/css/IE8Support.css" rel="stylesheet" />
<![endif]-->

<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="language" content="english">
<link rel="dns-prefetch" href="//www.google-analytics.com">
<meta name="robots" content="noodp,noydir">

<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/meta-content.php");
?>

<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="http://www.autumnearth.com/feed/" />
<link rel="alternate" type="application/atom+xml" title="Atom 1.0" href="http://www.autumnearth.com/feed/atom.php" />
</head>

<?php
$bodyClass = "";
echo '<body'.$bodyClass.'>'."\n";
include($_SERVER['DOCUMENT_ROOT']."/includes/build-url.php");
?>
<div id="wrapper">
	<div id="offCanvasWrapper">