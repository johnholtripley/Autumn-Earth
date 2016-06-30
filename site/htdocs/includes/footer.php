
<div class="row">
	<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/login.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/search.php");
?>

</div>
</div>
<div id="navigation" role="navigation">
<div id="navigationInner">
<div class="row">
<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/community/">Community</a><button aria-controls="subNavCommunity"><span class="visibleHide">Toggle community menu</span></button>
		<ul id="subNavCommunity" aria-label="submenu">
		<?php include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/community.php"); ?>
		</ul>
	</li>
	<li><a href="/auction/">Auction</a></li>
	<li><a href="/mail/">Mail</a></li>
	<li><a href="/almanack/">The Almanack</a></li>
	<li><a href="/chronicle/">The Chronicle</a></li>
	<li><a href="/retinue/">Retinue</a></li>
	<li><a href="#">Guide</a></li>
	<li><a href="/the-world/">The World</a><button aria-controls="subNavTheWorld"><span class="visibleHide">Toggle world menu</span></button>
		<ul id="subNavTheWorld" aria-label="submenu">
		<?php include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/the-world.php"); ?>
		</ul>
	</li>
	<li><a href="/contracts/CreateContract.php">Contracts</a></li>
	<li><a href="/card-game/">Card game</a><button aria-controls="subNavCardGame"><span class="visibleHide">Toggle card game menu</span></button>
		<ul id="subNavCardGame" aria-label="submenu">
		<?php include($_SERVER['DOCUMENT_ROOT']."/includes/navigation/card-game.php"); ?>
		</ul>
	</li>
</ul>
</div>
</div>
</div>
<div id="footer" role="contentinfo">
	<div class="row">
	<div class="small-12 column">
<p>&copy; 2004&ndash;<?php echo date("Y"); ?> Autumn Earth</p>
<ul>
	<li><a href="/colophon/">Colophon</a></li>
	</ul>
<ul>
	<li><a href="https://twitter.com/autumnearth/">Twitter</a></li>
	<li><a href="https://www.youtube.com/c/autumnearth/">YouTube</a></li>
	<li><a href="https://autumnearth.tumblr.com/">Tumblr</a></li>
	
</ul>


	</div>
	</div>
	</div>


</div>


<?php
// load in any modals that need to sit outside of the offcanvas nav:
if($needsAModal != "") {
// this is set in title-tag.php include
	include($_SERVER['DOCUMENT_ROOT']."/includes/modals/".$needsAModal.".php");
}
?>


</div>



<script src="/js/core.<?php echo $cacheVersion; ?>.js"></script>
<?php

if($additionalAssets != "") {
echo $additionalAssets;
}


?>

<?php if ($useCriticalCssInling): ?>


<!--[if (gt IE 8) | (IEMobile)]><!-->
    <script>
(function(d,u){for (var i in u) {var l=d.createElement('link');l.type='text/css';l.rel='stylesheet';l.href=u[i]; d.getElementsByTagName('head')[0].appendChild(l);}}(document,['/css/base.<?php echo $cacheVersion; ?>.css']));
</script>
<!--<![endif]-->
<!--[if (lt IE 9) & (!IEMobile)]>
    <script>
(function(d,u){for (var i in u) {var l=d.createElement('link');l.type='text/css';l.rel='stylesheet';l.href=u[i]; d.getElementsByTagName('head')[0].appendChild(l);}}(document,['/css/IE8Support.<?php echo $cacheVersion; ?>.css']));
</script>
<![endif]-->

  <?php  endif;  ?>

<?php include($_SERVER['DOCUMENT_ROOT']."/includes/google-analytics.php"); ?>

</body>
</html>
<?php
mysql_close($connection);
ob_end_flush();
?>