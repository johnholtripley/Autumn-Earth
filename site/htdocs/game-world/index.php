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

  <div id="worldWrapper">
<canvas id="gameWorld" width="800" height="600" moz-opaque>
  <img src="/images/game-world/no-canvas.jpg" alt="Sorry">
</canvas>
<div id="toolbar"></div>
<p id="dialogue"></p>
<div id="notification"></div>
<div id="displayZoneName"></div>
</div>
<div id="inventoryPanels"></div>
<div id="draggableInventorySlot"></div>
<form id="splitStackPanel">
  <fieldset>
<label for="splitStackInput" class="visibleHide">Enter quantity:</label>
<input type="number" placeholder="Enter quantity" min="0" max="20" pattern="[0-9]*" id="splitStackInput">
<button id="splitStackCancel" type="button">Cancel</button>
<input type="submit" value="Ok">
</fieldset>
</form>
<div id="cardAlbum"><div class="draggableBar">Card album</div><ul id="cardAlbumList"></ul></div>
<div id="cartographicPanel"><div class="draggableBar"><span id="cartographicTitle">Map</span></div><canvas id="cartographyCanvas" width="246" height="246"></canvas><canvas id="offScreenCartographyCanvas" class="offScreenCanvas" width="246" height="246"></canvas></div>
<div id="craftingPanel"><div class="draggableBar"><span id="recipeTitleBar">Recipes</span></div>
<div id="recipeSearchWrapper"><label for="recipeSearch" class="visibleHide">Search for recipes</label><input id="recipeSearch" type="text" placeholder="Search"><button id="clearRecipeSearch"><span>Clear search</span></button></div><label for="recipeFilter" class="visibleHide">Filter by:</label><div class="selectWrapper"><select id="recipeFilter"><option>All</option></select></div>

<div class="customScrollBar" id="recipeCustomScrollBar">
<div class="customScrollContent">
<ul id="createRecipeList">
</ul>
 <div class="trackBar">
    <div class="dragger"></div>
  </div>
</div>
</div>
<button id="craftingRecipeCreateButton" disabled="disabled">Add components</button>
</div>
<div id="craftingSelectComponentsPanel">

<div id="componentsAvailableForThisRecipe"></div>
<div id="selectComponentsItemBeingCreated"></div>
</div>

<div id="booksAndParchments"></div>

<div id="boosterPack">
<ol>

<?php
for ($i=0;$i<5;$i++) {
  echo '<li class="cardFlip"><div class="flipper"><div class="front card players" id="boosterCard'.$i.'"></div><div class="back"><img src="/images/card-game/cards/back.png" alt="card back"></div></div></li>';
}
?>
</ol>
</div>


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
