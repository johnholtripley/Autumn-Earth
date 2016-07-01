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





displayUpcomingEvents(10);



?>

<h2>Archive</h2>
<p>Past events</p>

</div>
</div>

<?php






include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>