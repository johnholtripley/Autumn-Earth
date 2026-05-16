<?php
	include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
	include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
	include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
	include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
	include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");
?>

<style>
	#ecologyDemo {
		width: 612px;
		height: 612px;
		border: 1px solid #cecece;
		margin: 54px auto;
		display: block;
	}

	#ecologyDemoWrapper {
		width: 100%;
	}

	#mastHead, #footer, #navigation {
		position: static;
	}
</style>

<div class="row">
	<div class="column" id="ecologyDemoWrapper">
		<canvas id="ecologyDemo" moz-opaque width="612" height="612">
		</canvas>
	</div>
</div>

<?php
	$additionalAssets .= '<script src="/js/src/game-world/config.'.$cacheVersion.'.js"></script>'."\n";
	$additionalAssets .= '<script src="/js/src/game-world/helper-functions.'.$cacheVersion.'.js"></script>'."\n";
	//$additionalAssets .= '<script src="/js/src/game-world/pathfinding.'.$cacheVersion.'.js"></script>'."\n";
	// don't use it as a worker while testing:
	$additionalAssets .= '<script src="/js/worker-pathfinding.'.$cacheVersion.'.js"></script>'."\n";
	$additionalAssets .= '<script src="/js/shared-worker-functions.min.'.$cacheVersion.'.js"></script>'."\n";
	$additionalAssets .= '<script src="/js/src/game-world/ecology.'.$cacheVersion.'.js"></script>'."\n";
?>
<script>

	/* remove after testing so this is local to the function ################ */
	let frontier = [];
	let reached = [];

	function update() {
		ecology.update();
	}

	function drawCircle(fillStyle, x, y, radius, whichContext) {
	    whichContext.fillStyle = fillStyle;
	    whichContext.beginPath();
	    whichContext.arc(x, y, radius, 0, 2 * Math.PI);
	    whichContext.fill();
	}

	function draw() {

		let map, tileWidth, tileHeight;
		gameContext.clearRect(0, 0, canvasWidth, canvasHeight);

		for (var m = 0; m < visibleMaps.length; m++) {


			map = thisMapData[visibleMaps[m]].collisions;
            tempMapTilesX = thisMapData[visibleMaps[m]].terrain[0].length;
            tempMapTilesY = thisMapData[visibleMaps[m]].terrain.length;
			tileWidth = canvasWidth / tempMapTilesX;
            tileHeight = canvasHeight / tempMapTilesY;

 			/* draw breadth search */
            let keySplit;
            for (var i in reached) {
            	keySplit = reached[i].split("-");
            	drawCircle('#333333', (parseInt(keySplit[0])+0.5)*tileWidth, (parseInt(keySplit[1])+0.5)*tileHeight, tileWidth*0.8, gameContext);
            }
            for (var i in frontier) {
            	keySplit = frontier[i].split("-");
            	drawCircle('#666666', (parseInt(keySplit[0])+0.5)*tileWidth, (parseInt(keySplit[1])+0.5)*tileHeight, tileWidth*0.8, gameContext);
            }


			/* use collisions not terrain for this to represent the map more clearly: */
			
          
            for (var i = 0; i < tempMapTilesX; i++) {
                for (var j = 0; j < tempMapTilesY; j++) {
                	if (map[j][i] > 0) {
                		gameContext.fillStyle = '#00ff00';
                		gameContext.fillRect(i*tileWidth,j*tileHeight,tileWidth,tileHeight);
                	}
                }
            }
           


            /* draw items: */
            for (var i = 0; i < thisMapData[visibleMaps[m]].items.length; i++) {
            	drawCircle('#ffff00', (thisMapData[visibleMaps[m]].items[i].tileX+0.5)*tileWidth, (thisMapData[visibleMaps[m]].items[i].tileY+0.5)*tileHeight, tileWidth/2, gameContext);
            }
            /* draw NPCs: */
            for (var i = 0; i < thisMapData[visibleMaps[m]].npcs.length; i++) {
            	drawCircle('#ff00ff', (thisMapData[visibleMaps[m]].npcs[i].tileX+0.5)*tileWidth, (thisMapData[visibleMaps[m]].npcs[i].tileY+0.5)*tileHeight, tileWidth/2, gameContext);
            }
         
        }
	}

	function gameLoop() {
		update();
        draw();
		window.requestAnimationFrame(gameLoop);
	}

	function setupDemo() {
		/* imitate game world state: */
		visibleMaps.push(23);


	

		<?php
			$map_data = file_get_contents($_SERVER['DOCUMENT_ROOT']."/data/chr999/map23.json");
  		?>
  		const loadedMapData = <?php echo $map_data; ?>;
		thisMapData[23] = loadedMapData.map;


		gameCanvas = document.getElementById("ecologyDemo");
    	if (gameCanvas.getContext) {
    		canvasWidth = 612;
    		canvasHeight = 612;
        	gameContext = gameCanvas.getContext('2d');
        	gameLoop();
        }
		

		
	}

	document.addEventListener("DOMContentLoaded", function() {
		setupDemo();
	    ecology.init();
	});
</script>

<?php
	include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
