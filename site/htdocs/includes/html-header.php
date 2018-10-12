<!doctype html>
<?php


// test for data-saving:
// https://developers.google.com/web/updates/2016/02/save-data
$dataSaving = false;
foreach (getallheaders() as $name => $value) {
    if(strtolower($name) == "save-data") {
      if(strtolower($value) == "on") {
        $dataSaving = true;
      }
    }
}




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
<?php
$thisURL = $_SERVER['PHP_SELF'];
$thisURLSection = explode("/",$thisURL);
$thisSection = trim($thisURLSection[1]);
$isHomePage = false;
if($thisSection == "index.php") {
  // is the home page:
  // https://developers.google.com/structured-data/site-name#site_name_requirements
  $isHomePage = true;
  echo '<head itemscope itemtype="http://schema.org/WebSite">';
  //echo '<link rel="canonical" href="https://www.autumnearth.com" itemprop="url">';
} else {
  echo '<head>';
}
?>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/title-tag.php");
?>


<meta http-equiv="Accept-CH" content="DPR,Width,Viewport-Width"> 
<meta name="disabled-adaptations" content="watch">

<?php // stop Edge auto-detecting phone numbers and making them links: ?>
<meta name="format-detection" content="telephone=no">
<?php
// help Google index paginated pages behind the 'load more' links:
// https://webmasters.googleblog.com/2014/02/infinite-scroll-search-friendly.html
// herbarium home and chronicle home will need this
if($needsSeoPagination) {
  // get current page



$pagenumber = 1;
if(isset($_GET['page'])) {
  $pagenumber = $_GET['page'];
$pos = strrpos($pagenumber, "-");
if ($pos !== false) {
  // is a range
  $startpagenumber = substr($pagenumber,0,$pos);
  $endpagenumber = substr($pagenumber,$pos+1);
} else {
  $startpagenumber = $pagenumber;
  $endpagenumber = $pagenumber;
}
} else {
  $startpagenumber = 1;
  $endpagenumber = 1;
}




if($pagenumber>1) {
  echo '<link rel="prev" href="/'.$thisSection.'/page/'.($pagenumber-1).'">';
}
echo '<link rel="next" href="/'.$thisSection.'/page/'.($pagenumber+1).'">';
}
?>




<?php if ($useCriticalCssInling): ?>
 <style><?php include($_SERVER['DOCUMENT_ROOT']."/css/critical.css"); ?></style>
<noscript>
  <?php  endif;  ?>
<!--[if (gt IE 8) | (IEMobile)]><!-->
    <link href="/css/base.<?php echo $cacheVersion; ?>.css" rel="stylesheet">
<!--<![endif]-->
<!--[if (lt IE 9) & (!IEMobile)]>
    <link href="/css/IE8Support.<?php echo $cacheVersion; ?>.css" rel="stylesheet">
<![endif]-->
<?php if ($useCriticalCssInling) {
echo '</noscript>'."\n";
}?>

<script>
  var cutsTheMustard = false;
  function removeClass() {
    document.documentElement.className = document.documentElement.className.replace("js", " " );
  }
  if('querySelectorAll' in document && 'addEventListener' in window) {
    cutsTheMustard = true;
    document.documentElement.className += " js";

    
    var fallbackTimeout = setTimeout(removeClass, 8000);
  }
  cacheVersion = <?php echo $cacheVersion; ?>;
</script>

<meta name="mobile-web-app-capable" content="yes">
<meta name="language" content="english">
<link rel="preconnect" href="//www.google-analytics.com">

<link rel="preload" href="/fonts/merriweather_light-webfont.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/merriweather_light-webfont.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="/fonts/merriweather_light-webfont.ttf" as="font" type="font/ttf" crossorigin>
<link rel="preload" href="/fonts/merriweather_light-webfont.svg" as="font" type="font/svg" crossorigin>

<meta name="robots" content="noodp,noydir">

<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/meta-content.php");
echo $thisAMPURL;
?>

<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="https://www.autumnearth.com/feed/" />
<link rel="alternate" type="application/atom+xml" title="Atom 1.0" href="https://www.autumnearth.com/feed/atom.php" />
</head>

<?php

echo '<body'.$sectionClass.'>'."\n";
include($_SERVER['DOCUMENT_ROOT']."/includes/build-url.php");
?>
<div id="wrapper">
	<div id="offCanvasWrapper">