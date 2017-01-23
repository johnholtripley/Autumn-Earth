<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column"><h1>Retinue</h1>
	</div>
	</div>


	<div class="row">
		<div class="column small-12 wide-4"><p>All active quests:</p></div>
		<div class="column small-12 wide-4"><p>All available quests:</p></div>
<div class="column small-12 wide-4"><p>All unassigned followers:</p></div>
</div>


<div class="row">

	<div class="column">
<p><a href="/retinue/eleaddai/ ">All Followers</a>, <a href="/retinue/quest/first-expedition/">Individual quest</a> and <a href="/retinue/eleaddai/bob-the-drag-queen/">Individual Followers</a></p>
</div>
</div>















<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
