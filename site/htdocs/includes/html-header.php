<!doctype html>
<?php

$useCriticalCssInling = false;

if($_SERVER['PHP_SELF'] == "/index.php") {
 $useCriticalCssInling = true; 
}
 if (isset($_GET["useInline"])) {
  // use this parameter so that the Gulp task sees the html without the post-critical modifications
  if($_GET["useInline"]=="false") {
    $useCriticalCssInling = false;
  }
}

$cacheVersion = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/includes/siteVersion.txt');

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

<script>
    var cutsTheMustard = false;
    if('querySelector' in document && 'addEventListener' in window) {
     cutsTheMustard = true;
      document.documentElement.className += " js";
     }
     cacheVersion = <?php echo $cacheVersion; ?>;
  </script>

<?php if ($useCriticalCssInling): ?>
 <style><?php include '/css/critical.css'; ?></style>
<noscript>
  <?php  endif;  ?>
<!--[if (gt IE 8) | (IEMobile)]><!-->
    <link href="/css/base.<?php echo $cacheVersion; ?>.css" rel="stylesheet" />
<!--<![endif]-->
<!--[if (lt IE 9) & (!IEMobile)]>
    <link href="/css/IE8Support.<?php echo $cacheVersion; ?>.css" rel="stylesheet" />
<![endif]-->
<?php if ($useCriticalCssInling) {
echo '</noscript>'."\n";
}?>

<meta name="mobile-web-app-capable" content="yes">
<meta name="language" content="english">
<link rel="dns-prefetch" href="//www.google-analytics.com">
<meta name="robots" content="noodp,noydir">

<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/meta-content.php");
?>

<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="https://www.autumnearth.com/feed/" />
<link rel="alternate" type="application/atom+xml" title="Atom 1.0" href="https://www.autumnearth.com/feed/atom.php" />
</head>

<?php
$bodyClass = "";
echo '<body'.$bodyClass.'>'."\n";
include($_SERVER['DOCUMENT_ROOT']."/includes/build-url.php");
?>
<div id="wrapper">
	<div id="offCanvasWrapper">