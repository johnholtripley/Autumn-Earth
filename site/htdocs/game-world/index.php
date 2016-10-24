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
<canvas id="gameWorld" width="800" height="600" moz-opaque>
  <img src="/images/game-world/no-canvas.jpg" alt="Sorry">
</canvas>
<div id="toolbar"></div>
<p id="dialogue"></p>
<div id="notification"></div>
<div id="displayZoneName"></div>
<div id="inventoryPanels"></div>
<div id="cartographicPanel"><div class="draggableBar"><span id="cartographicTitle">Map</span></div><canvas id="cartographyCanvas" width="246" height="246"></canvas><canvas id="offScreenCartographyCanvas" class="offScreenCanvas" width="246" height="246"></canvas></div>



<div id="cardGameWrapper">
<canvas id="cardGame" moz-opaque width="1008" height="612">
  <img src="/images/card-game/no-canvas.jpg" alt="Card game">
</canvas>
</div>


</div>


<script src="/js/card-game-shared.<?php echo $cacheVersion; ?>.js"></script>
<script src="/js/game-world.<?php echo $cacheVersion; ?>.js"></script>

<?php include($_SERVER['DOCUMENT_ROOT']."/includes/google-analytics.php"); ?>
</body>
</html>
