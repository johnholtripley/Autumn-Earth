</div>
<div id="navigation" role="navigation">
<div id="navigationInner">
<div class="row">
<ul>
<li><a href="/" accesskey="1">Home</a></li>
<li><a href="/forum/" accesskey="2">Forum</a></li>
<li><a href="/auction/" accesskey="3">Auction</a></li>
<li><a href="/mail/" accesskey="4">Mail</a></li>
<li><a href="/chronicle/" accesskey="5">News</a></li>
<li><a href="#" accesskey="6">Guide</a></li>
<li><a href="#" accesskey="7">The World</a></li>
<li><a href="/contracts/CreateContract.php" accesskey="8">Contract</a></li>
<li><a href="/card-game/" accesskey="9">Card game</a></li>
</ul>
</div>
</div>
</div>
<div id="footer" role="contentinfo">
	<div class="row">
	<div class="small-12 column">
<p>&copy; 2015 Autumn Earth</p>
	</div>
	</div>
	</div>


</div>
</div>



<script src="/js/core.js"></script>
<?php

if($additionalAssets != "") {
echo $additionalAssets;
}

include($_SERVER['DOCUMENT_ROOT']."/includes/google-analytics.php");
?>

</body>
</html>
<?php
mysql_close($connection);
?>