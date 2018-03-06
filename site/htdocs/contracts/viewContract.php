<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");





include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");


$foundContract = false;

if(isset($_GET["contractId"])) {

$contractId = $_GET["contractId"];

if(is_numeric($contractId)) {

$query = "select * from tblcontracts where contractId = '".$contractId."'";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
	
	$numberofrows = mysqli_num_rows($result);
	// check that something is returned
	if (mysqli_num_rows($result) > 0) {
		$row = mysqli_fetch_array($result);
		extract($row);
		$foundContract = true;
}
}
}

?>

<div class="row">
<div class="column">
<h1>Contract details</h1>
<?php

if ($foundContract) {

	// show contract start location
	// end location
	// show start and end time (and with relative time)
	// show if epxired or not
	// items
	// show current bids on it
	// where current character is - highlight if the same as contract start location
	// show similar contracts

// $startDateOutput = date( 'j', strtotime( $contractStart ) )."<sup>".date( 'S', strtotime( $contractStart ) )."</sup> ".date( 'F Y - ga', strtotime( $contractStart ) );
$endDateOutput = date( 'j', strtotime( $contractEnd ) )."<sup>".date( 'S', strtotime( $contractEnd ) )."</sup> ".date( 'F Y - g:ia', strtotime( $contractEnd ) );
$now = strtotime( date( 'M j, Y' ) );


?>

 <dl>

  <dt>Needs to be completed by</dt>  <dd><?php echo $endDateOutput.relativeShortFutureDate( strtotime( $contractEnd )); ?></dd>

</dl> 



<?php

if (strtotime($contractEnd) < $now) {
	?>
	<h5>This contract has expired</h5>
	<?php
}


} else {
	?>
<p>Sorry, that contract couldn't be found.</p>
	<?php
}

?>

</div>
</div>

<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");

?>