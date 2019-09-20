<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
?>
<!doctype html>
<html lang="en-gb">
<head>
  <?php include($_SERVER['DOCUMENT_ROOT']."/includes/title-tag.php"); ?>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no">
  <meta http-equiv="Accept-CH" content="DPR,Width,Viewport-Width"> 
  <?php $cacheVersion = file_get_contents($_SERVER["DOCUMENT_ROOT"].'/includes/siteVersion.txt'); ?>
  <link href="/css/game-world.<?php echo $cacheVersion; ?>.css" rel="stylesheet">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="language" content="english">
  <link rel="preconnect" href="//www.google-analytics.com">
  <link rel="preconnect" href="//fonts.googleapis.com">
  <?php
  // link rel="preload" fonts
  ?>
  <link rel="canonical" href="https://www.autumnearth.com/" itemprop="url">
  <link href="https://plus.google.com/+Autumnearth" rel="publisher">
  <meta name="robots" content="noodp,noydir">
  <link href="https://fonts.googleapis.com/css?family=Lato%7CBree+Serif%7CIM+Fell+English%7CPrincess+Sofia&display=swap" rel="stylesheet">
  <?php
    $thisBuiltURL = "https://www.autumnearth.com/game-world/";
    $longDescription = "The game world of Autumn Earth";
    $metaPageType = "game";
  ?>
  <?php include($_SERVER['DOCUMENT_ROOT']."/includes/meta-content.php"); ?>
  <?php include($_SERVER['DOCUMENT_ROOT']."/game-world/getPost.php"); ?>
  <?php include($_SERVER['DOCUMENT_ROOT']."/game-world/getRetinueFollowers.php"); ?>
  <style id="playersCardBack">
    .card.players {
    /* the hero's active card back - replaced after getCardDetails returns: */
    background-image: url(/images/card-game/card-backs/1.jpg);
  }
  </style>

 
</head>
<body>
 
<div id="gameWrapper">
  <div id="worldWrapper">
    <canvas id="gameWorld" width="800" height="600" moz-opaque>
      <img src="/images/game-world/no-canvas.jpg" alt="Sorry">
    </canvas>
    <canvas id="lightMapOverlay" width="800" height="600"></canvas>  
  </div>

  <div id="weather">
    <div id="rain"></div>
    <div id="snow"></div>
    <div id="clouds"></div>
  </div>

  <div id="interface" class="active">
    <div id="toolbar">
      <a href="#gameSettings" id="openSettings">Settings</a>
      <div id="actionBar"></div>
      <div id="newPost"<?php if($hasUnReadPost) { echo ' class="active"';} ?>><p>You have new post</p></div>
      <div id="currencies"></div>
    </div>

    <p id="dialogue"></p>
    <div id="notification"><div id="notificationContent"></div><div id="notificationSpeechArrow"></div></div>
    <div id="displayZoneName"></div>
    <div id="inventoryPanels"></div>
    <div id="draggableInventorySlot"></div>
    <form id="splitStackPanel" class="quantityInputPanel">
      <fieldset>
        <label for="splitStackInput" class="visibleHide">Enter quantity:</label>
        <input type="number" placeholder="Enter quantity" min="0" max="20" id="splitStackInput">
        <button id="splitStackCancel" type="button">Cancel</button>
        <input type="submit" value="Ok">
      </fieldset>
    </form>
    <div id="treasureMapPanels"></div>
    <div id="characterPanel">
      <div class="draggableBar"><div id="characterName"></div></div><button class="closePanel">close</button>
      <div id="holdingIcon"></div>
      <div id="holdingGauge"><span></span></div>
    </div>
    <div id="gatheringPanel">
      <div class="draggableBar">Gathering</div><button class="closePanel">close</button>
      <ul>
        <li><p>Quality</p><div id="gatheringQualityBar" class="progressBarWrapper"><div class="progressBar"></div></div></li>
        <li><p>Purity</p><div id="gatheringPurityBar" class="progressBarWrapper"><div class="progressBar"></div></div></li>
        <li><p>Remaining</p><div id="gatheringQuantityBar" class="progressBarWrapper"><div class="progressBar"></div></div></li>
        <li><p>Stability</p><div id="gatheringBarStability" class="progressBarWrapper"><div class="progressBar"></div></div></li>
      </ul>
      <div id="gatheringOutputSlot"></div>
    </div>
    <div id="surveyingPanel">
      <div class="draggableBar">Surveying&hellip;</div><button class="closePanel">close</button>
      <ul>
        <li><p>Surveying&hellip;</p><div id="surveyingTimeBar" class="hourGlass"></div></li>
      </ul>
    </div>
    <div id="cardAlbum" class="active">
      <div class="draggableBar">Totem Card album</div>
      <div class="tabHeader">
        <button class="tabs active" id="tabShowAlbum">Album</button>
        <button class="tabs" id="tabShowBacks">Backs</button>
        <button class="tabs" id="tabShowCrafting">Crafting</button>
      </div>
      <div id="cardAlbumList" class="showAlbum"></div>
    </div>
    <div id="cartographicPanel" class="active">
      <div class="draggableBar">
        <span id="cartographicTitle">Map</span>
      </div>
      <canvas id="cartographyCanvas" width="246" height="246"></canvas>
      <canvas id="offScreenCartographyCanvas" class="offScreenCanvas" width="246" height="246"></canvas>
    </div>
    <div id="horticulturePanel">
      <div class="draggableBar">
        Horticulture
      </div>
      <button class="closePanel">close</button>
    </div>
    <div id="craftingPanel">
      <div class="draggableBar">
        <span id="recipeTitleBar">Recipes</span>
      </div>
      <button class="closePanel">close</button>
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
      <div class="draggableBar">
        Add components
      </div>
      <button class="closePanel">close</button>
      <div class="craftingColumn"><div id="componentsAvailableForThisRecipe"></div></div>
      <div class="craftingColumn"><div id="selectComponentsItemBeingCreated"></div></div>
      <div class="craftingColumn"><div id="displayItemBeingCreated"></div><div id="craftingTimeBar" class="hourGlass"></div><button class="primaryButton" id="startCrafting" disabled="disabled">Create</button></div>   
    </div>

    <div id="booksAndParchments"></div>

    <div id="collectionQuestPanels">
      <div class="draggableBar">Collection Album</div>
      <button class="closePanel">close</button>
      <?php
      $query = "SELECT * FROM tblcollectionquests";
      $result = mysqli_query($connection, $query) or die ();
      while ($row = mysqli_fetch_array($result)) {
      extract($row);
      echo '<section id="collection-'.$cleanurl.'" data-collection="'.$cleanurl.'">';
      echo '<h2>'.$collectionQuestName.'</h2>';
      echo '<p>'.base64_encode($collectionQuestLore).'</p>';
      echo '<ol></ol>';
      echo '</section>';
      }
      mysqli_free_result($result);
      ?>
    </div>

    <div id="catalogueQuestPanels">
      <?php
      $query = "SELECT * from tblcharacters where charID='".$chr."'";
      $result = mysqli_query($connection, $query);
      if(mysqli_num_rows($result)>0) {
        while ($row = mysqli_fetch_array($result)) {
          extract($row);
          if($catalogues != '[]') { 
            $theseCatalogues = json_decode($catalogues, true);
            for ($i=0;$i<count($theseCatalogues);$i++) {
              echo createCatalogueMarkup($theseCatalogues[$i]['ids'], $theseCatalogues[$i]['name'],'false');
            }
          }
        }
      }
      mysqli_free_result($result);
      ?>
    </div>

    <div id="questJournal">
      <div class="draggableBar">Quest Journal</div>
      <button class="closePanel">close</button>
      <select id="questJournalRegionFilter">
      </select>
      <div id="questJournalEntries">
      </div>
    </div>

    <div id="inscriptionPanel">
      <div class="draggableBar">Inscription</div>
      <button class="closePanel">close</button>
      <div class="tabHeader">
        <button class="tabs" id="scribeCopyText">Copy text</button>
        <button class="tabs active" id="scribeOriginalText">Original text</button>
      </div>
      <div id="sourceSelection"></div>
      <div id="materialsSelection"></div>
      <div id="inkSelection"></div>
      <div id="originalText" class="book active">
        <input id="inscriptionTitle" placeholder="Title">
        <div id="inscriptionTextArea" contentEditable="true" role="textbox" aria-multiline="true"></div>
      </div>
      <button class="closePanel">Cancel</button>
      <button id="scribeStartInscription" disabled>Inscribe</button>
    </div>

    <div id="shopPanel"></div>
    <div id="draggableShopSlot"></div>
    <form id="shopSplitStackPanel" class="quantityInputPanel">
      <fieldset>
        <label for="shopSplitStackInput" class="visibleHide">Enter quantity:</label>
        <input type="number" placeholder="Enter quantity" min="0" max="20" id="shopSplitStackInput">
        <button id="shopSplitStackCancel" type="button">Cancel</button>
        <input type="submit" value="Ok">
      </fieldset>
    </form>

    <?php // defined in getPost.php: ?>
    <?php echo $postPanelMarkup; ?>
    <?php echo $allMessagePanels; ?>

    <?php // defined in getRetinueFollowers.php ?>
    <?php echo $retinuePanelOutput; ?>
 
    <div id="hireRetinueFollowerPanel">
      <div class="draggableBar">Hire A Retinue Follower</div>
      <div id="hireRetinueFollowerPanelContent"></div>
      <p>Costs <?php echo parseMoney($amountToHireRetinueFollower); ?></p>
      <button id="hireRetinueFollowerNo">No</button><button id="hireRetinueFollowerYes">Yes</button>
    </div>
    <div id="chestPanel">
      <div class="draggableBar"><span id="chestTitle">Chest</span></div>
      <button class="closePanel">close</button>
      <ol id="chest">
      </ol>
    </div>
    <div id="draggableChestSlot"></div>

    <div id="boosterPack">
      <ol>
      <?php
      for ($i=0;$i<5;$i++) {
      echo '<li class="cardFlip"><div class="flipper"><div class="front card players" id="boosterCard'.$i.'"></div><div class="back"><img src="/images/card-game/card-backs/back.jpg" alt="card back"></div></div></li>';
      }
      ?>
      </ol>
    </div>

    <div id="housingPanel">
      <div class="draggableBar">Housing</div>
      <button class="closePanel">close</button>
      <ul>
        <li><button id="openHousingConstructButton">Construct</button></li>
        <li><button>Door Permissions</button></li>
        <li><img src="/images/game-world/inventory-items/53.png" alt="Home stone"></li>
      </ul>
    </div>
    <div id="housingConstructionPanel">
      <div class="draggableBar">Housing</div>
      <button class="closePanel">close</button>
      <label for="showHousingFootprintCheckbox">Show plot footprint?</label><input type="checkbox" checked="checked" id="showHousingFootprintCheckbox" class="switch">
      <ul id="housingConstructionTools">
        <li class="active" data-action="paint" id="housingConstructToolPaint"><button  style="background-image:url(/images/game-world/interface/housing/ui-tool-paint.png">Paint</button></li>
        <li data-action="remove" id="housingConstructToolRemove"><button style="background-image:url(/images/game-world/interface/housing/ui-tool-remove.png">Remove</button></li>
        <li data-action="fill" id="housingConstructToolFill"><button style="background-image:url(/images/game-world/interface/housing/ui-tool-fill.png">Fill</button></li>
        <li data-action="eyedropper" id="housingConstructToolEyedropper"><button style="background-image:url(/images/game-world/interface/housing/ui-tool-eyedropper.png">Eyedropper</button></li>
        <li data-action="move" id="housingConstructToolMove"><button style="background-image:url(/images/game-world/interface/housing/ui-tool-move.png">Move</button></li>
      </ul>
      <p>Cost for this work: <span id="housingRunningTotal">0<span class="copper"></span></span>
      <button id="housingConstructionSaveButton">Commit this design</button>
      <?php include($_SERVER['DOCUMENT_ROOT']."/game-world/getHousingTiles.php"); ?>
    </div>
    <div id="housingHasEnoughMoney">
      <h3></h3>
      <button id="hasEnoughConfirm">Commit design</button>
      <button id="hasEnoughCancel">Save for later</button>
    </div>
    <div id="housingNotEnoughMoney">
      <h3>Not enough money&hellip;</h3>
      <p>Would you like to save this for later?</p>
      <button id="notEnoughSave">Save design</button>
      <button id="notEnoughCancel">Cancel design</button>
    </div>

    <div id="gameSettings"><button class="closePanel">close</button>
      <h2>Volume</h2>
      <label for="soundVolume">Sound effects</label><input id="soundVolume" type="range" min="0" max="1" step="0.05">
      <label for="musicVolume">Music</label><input id="musicVolume" type="range" min="0" max="1" step="0.05">
      <h2>Full screen</h2>
      <input type="checkbox" value="1" id="toggleFullScreen" class="switch"> <label for="toggleFullScreen"><span></span>Enable Fullscreen</label>
    </div>

    <div id="acceptQuestChoice">
      <button id="questDecline">Decline</button>
      <button id="questAccept">Accept</button>
    </div>

    <div id="quickHold"></div>

    <div id="touchTapAction"></div>

  </div>
  <div id="cardGameWrapper">
      <canvas id="cardGame" moz-opaque width="1008" height="612">
        <img src="/images/card-game/no-canvas.jpg" alt="Card game">
      </canvas>
      <button id="cardGameConcede">Concede</button>
  </div>
  <div id="hnefataflGameWrapper">
    <canvas id="hnefataflGame" moz-opaque width="612" height="612">
      <img src="/images/card-game/no-canvas.jpg" alt="Hnefatafl game">
    </canvas>
    <button id="hnefataflConcede">Concede</button>
  </div>
</div>

<a id="printScreenAnchor" download="screenshot.jpg">Download a screenshot</a>

<script src="/js/card-game-shared.<?php echo $cacheVersion; ?>.js"></script>
<script src="/js/hnefatafl-shared.<?php echo $cacheVersion; ?>.js"></script>
<script src="/js/game-world.<?php echo $cacheVersion; ?>.js"></script>
 
<?php include($_SERVER['DOCUMENT_ROOT']."/includes/google-analytics.php"); ?>
</body>
</html>