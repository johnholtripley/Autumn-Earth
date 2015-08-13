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




			$startDateOutput = date( 'j', strtotime( $eventStart ) )."<sup>".date( 'S', strtotime( $eventStart ) )."</sup> ".date( 'F Y', strtotime( $eventStart ) );
			$endDateOutput = date( 'j', strtotime( $eventEnd ) )."<sup>".date( 'S', strtotime( $eventEnd ) )."</sup> ".date( 'F Y', strtotime( $eventEnd ) );
			echo '<span>From <span itemprop="startDate" content="'.$eventStart.'">'.$startDateOutput.'</span>
    to <span itemprop="endDate" content="'.$eventEnd.'">'.$endDateOutput.'</span></span>';
			



echo '<div itemprop="description">';
echo $eventContent;
echo '</div>';
echo '</div>';
}
}



?>
</div>
</div>

<?php






include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>