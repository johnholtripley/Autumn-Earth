
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
<li><a href="/community/">Community</a>
	<ul>
<li><a href="/forum/">Forum</a></li>
</ul></li>
<li><a href="/auction/">Auction</a></li>
<li><a href="/mail/">Mail</a></li>
<li><a href="/chronicle/">News</a></li>
<li><a href="#">Guide</a></li>
<li><a href="#">The World</a>
<ul>
	<li><a href="#">The Bestiary</a></li>
</ul>
</li>
<li><a href="/contracts/CreateContract.php">Contracts</a></li>
<li><a href="/card-game/">Card game</a></li>
</ul>
</div>
</div>
</div>
<div id="footer" role="contentinfo">
	<div class="row">
	<div class="small-12 column">
<p>&copy; 2015 Autumn Earth</p>

<ul>
	
	<li><a href="https://twitter.com/autumnearth/">Twitter</a></li>

	<li><a href="https://www.youtube.com/c/autumnearth/">YouTube</a></li>
	<li><a href="https:autumnearth.tumblr.com/">Tumblr</a></li>
	<li>Facebook</li>
</ul>


	</div>
	</div>
	</div>


</div>
</div>



<script src="/js/core.min.<?php echo $cacheVersion; ?>.js"></script>
<?php

if($additionalAssets != "") {
echo $additionalAssets;
}

include($_SERVER['DOCUMENT_ROOT']."/includes/google-analytics.php");
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


</body>
</html>
<?php
mysql_close($connection);
ob_end_flush();
?>