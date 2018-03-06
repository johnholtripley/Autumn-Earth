<?php


include($_SERVER['DOCUMENT_ROOT']."/includes/session.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/header.php");





?>
<div class="row">

	<div class="column"><h1>Retinue Follower</h1>


<?php

$showAll = false;
if(isset($_GET["show"])) {
	if($_GET["show"] == "all") {
$showAll = true;
	}
}













if($showAll) {
echo '<h2>All followers</h2>';

$query = "SELECT * from tblretinuefollowers inner join tblcharacters on tblcharacters.charId = tblretinuefollowers.characterIdFollowing where tblcharacters.charName='".$_GET["character"]."'";
$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
	echo '<ol>';
	while ($row = mysqli_fetch_array($result)) {
   
  		extract($row);
  		echo '<li><h3>'.$followerName.'</h3>';

echo '<img src="/images/retinue/'.$followerID.'.png" style="width:33px;height:auto;" alt="">';
if($activeQuestId != -1) {
  			$query2 = "SELECT * from tblretinuequests where questID='".$activeQuestId."'";
  			$result2 = mysqli_query($connection, $query2);
  			if(mysqli_num_rows($result2)>0) {
  				$row = mysqli_fetch_array($result2);
  				extract($row);
  				echo '<p>Currently on "<a href="/retinue/quest/'.$questCleanURL.'/">'.$questName.'</a>"<p>';
  			}
  			mysqli_free_result($result2);

  		} else {
  			echo '<p>Currently inactive</p>';
  		}
  		echo'</li>';
  	}
  	echo '</ol>';
  } else {
  			echo '<p>Sorry - no followers found</p>';
  }

} else {

// follower names should be unique per character, but not globally, so need to check for followers of that name assigned to that character:
$query = "SELECT * from tblretinuefollowers inner join tblcharacters on tblcharacters.charId = tblretinuefollowers.characterIdFollowing where followerCleanURL = '".$_GET["follower"]."' and tblcharacters.charName='".$_GET["character"]."'";
$result = mysqli_query($connection, $query);
if(mysqli_num_rows($result)>0) {
	while ($row = mysqli_fetch_array($result)) {
   
  		extract($row);
  		echo '<h2>'.$followerName.'</h2>';
  		echo '<img src="/images/retinue/'.$followerID.'.png" style="width:33px;height:auto;" alt="">';
  		if($activeQuestId != -1) {
  			$query2 = "SELECT * from tblretinuequests where questID='".$activeQuestId."'";
  			$result2 = mysqli_query($connection, $query2);
  			if(mysqli_num_rows($result2)>0) {
  				$row = mysqli_fetch_array($result2);
  				extract($row);
  				echo '<p>Currently on "<a href="/retinue/quest/'.$questCleanURL.'/">'.$questName.'</a>"<p>';
  			}
  			mysqli_free_result($result2);

  		} else {
  			echo '<p>Currently inactive</p>';
  		}
  	}
} else {
		echo '<p>Sorry - couldn\'t find that follower</p>';
 header("HTTP/1.0 404 Not Found");
}
mysqli_free_result($result);
}
?>


</div>



</div>









<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/footer.php");
?>
