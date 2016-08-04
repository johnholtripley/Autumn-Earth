<!doctype html>
<html lang="en-gb">
<head>
  <?php include($_SERVER['DOCUMENT_ROOT']."/includes/title-tag.php"); ?>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Accept-CH" content="DPR,Width,Viewport-Width"> 
  <?php $cacheVersion = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/includes/siteVersion.txt'); ?>
  <link href="/css/game-world.<?php echo $cacheVersion; ?>.css" rel="stylesheet">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="language" content="english">
  <link rel="preconnect" href="//www.google-analytics.com">
  <meta name="robots" content="noodp,noydir">
  <?php include($_SERVER['DOCUMENT_ROOT']."/includes/meta-content.php"); ?>
</head>

<body>

  <div id="gameWrapper">
<canvas id="gameWorld" width="800" height="600">
  <img src="/images/game-world/no-canvas.jpg" alt="Sorry">
</canvas>
<div id="displayZoneName"></div>
</div>

<script src="/js/game-world.<?php echo $cacheVersion; ?>.js"></script>

<?php include($_SERVER['DOCUMENT_ROOT']."/includes/google-analytics.php"); ?>
</body>
</html>
