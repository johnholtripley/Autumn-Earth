
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
<li><a href="/forum/">Forum</a></li>
<li><a href="/auction/">Auction</a></li>
<li><a href="/mail/">Mail</a></li>
<li><a href="/chronicle/">News</a></li>
<li><a href="#">Guide</a></li>
<li><a href="#">The World</a></li>
<li><a href="/contracts/CreateContract.php">Contract</a></li>
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
	
	<li><a href="https://twitter.com/autumnearth">Twitter</a></li>

	<li><a href="https://www.youtube.com/channel/UCUReqJjDvPDQRI0NRwS8L2A">YouTube</a></li>
	<li>Facebook</li>
</ul>


	</div>
	</div>
	</div>


</div>
</div>



<script src="/js/core.min.js"></script>
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