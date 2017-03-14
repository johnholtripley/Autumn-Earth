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




	




<ul id="retinueQuests">
<?php

function timeRemainingCompare($a, $b) {
    http://stackoverflow.com/questions/2910611/php-sort-a-multidimensional-array-by-element-containing-date
    $t1 = $a['timeRemaining'];
    $t2 = $b['timeRemaining'];
    return $t1 - $t2;
}  


$charId = 999;
$query = "SELECT * FROM tblretinuequests where questassociatedcharacterid = ".$charId." and questcompleted = 0";
$result = mysql_query($query) or die ();
$retinueQuestData = [];
while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	// determine time remaining:
$row['timeRemaining'] = INF;

$thisTimeStamp = strtotime($row['questStartedTime']);

if($thisTimeStamp != 0) {
	// quest has started
$timeElapsed = time() - $thisTimeStamp;
$row['timeRemaining'] = $row['questTimeRequired'] - $timeElapsed;

}

	array_push($retinueQuestData, $row);

}
mysql_free_result($result);

// sort by time remaining:
usort($retinueQuestData, 'timeRemainingCompare');

for ($j=0;$j<count($retinueQuestData);$j++) {
echo '<li><h4>'.$retinueQuestData[$j]['questName'].'</h4>';
if($retinueQuestData[$j]['timeRemaining']<0) {
echo " (complete)";
} else if($retinueQuestData[$j]['timeRemaining'] == INF) {
echo "(not started yet)";
} else {
	echo "time remaining: ".relativeTime($retinueQuestData[$j]['timeRemaining']);
}
echo '</li>';
}

?>
</ul>









</div>
<div class="row">
	<div class="column">
<p><a href="/retinue/eleaddai/ ">All Followers</a>, <a href="/retinue/quest/first-expedition/">Individual quest</a> and <a href="/retinue/eleaddai/bob-the-drag-queen/">Individual Followers</a></p>
</div>
</div>

<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
