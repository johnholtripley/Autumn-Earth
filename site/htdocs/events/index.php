<?php
$title="Autumn Earth News";
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");

?>

<div class="row">
<div class="small-12 columns">
<?php

echo'<h1>Events</h1>';


$query = "select * from tblEvents where cleanURL='".$_GET["eventName"]."'";

$result = mysql_query($query) or die ("couldn't execute query");



if (mysql_num_rows($result) > 0) {


while ($row = mysql_fetch_array($result)) {

	extract($row);
echo '<div itemscope itemtype="http://schema.org/Event">';
echo '<h2 itemprop="name">'.$title.'</h2>';



// get the correct years for repeating events:
if($repeatsAnnually > 0) {
$startDateDayAndMonth = date('j-n',strtotime($eventStart));
$startDateYear = date('Y');
$eventStart = $startDateDayAndMonth."-".$startDateYear;
$eventEnd = strtotime($eventStart) + ($eventDurationDays*3600*24);
// is this event end still current if it was a year previously?
// (is previous year end of time after now)
$yearPreviousEndTime = strtotime("-1 year", $eventEnd);

if($yearPreviousEndTime >= date(time())) {
// use the earlier date instead:
	$eventStart = $eventStart = $startDateDayAndMonth."-".($startDateYear-1);
	$eventEnd = $yearPreviousEndTime;
}
} else {
    // just work out the end time:
    $eventEnd = strtotime($eventStart) + ($eventDurationDays*3600*24);
}



			$startDateOutput = date( 'j', strtotime( $eventStart ) )."<sup>".date( 'S', strtotime( $eventStart ) )."</sup> ".date( 'F Y', strtotime( $eventStart ) );
			$endDateOutput = date( 'j', ( $eventEnd ) )."<sup>".date( 'S', ( $eventEnd ) )."</sup> ".date( 'F Y', ( $eventEnd ) );
			echo '<span>From <span itemprop="startDate" content="'.$eventStart.'">'.$startDateOutput.'</span>
    to <span itemprop="endDate" content="'.$eventEnd.'">'.$endDateOutput.'</span></span>';
			



echo '<div itemprop="description">';
echo $eventContent;
echo '</div>';
echo '</div>';
}
}



?>

<?php $urlToShare = urlencode($thisBuiltURL); ?>
<p><a class="shareLink" target="_blank" href="https://twitter.com/intent/tweet/?url=<?php echo $urlToShare; ?>">Share</a></p>

</div>
</div>




<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>