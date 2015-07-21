<?php

$guildPagesQuery = "select * from tblFreeFormPages where guildID='".$guildID."'";
$guildPagesResult = mysql_query($guildPagesQuery) or die ("couldn't execute query");
	
		
	$guildNumberofrows = mysql_num_rows($guildPagesResult);
	// check that something is returned
	if ($guildNumberofrows > 0) {
	echo '<ul>'."\n";
	while ($guildRow = mysql_fetch_array($guildPagesResult)) {
		extract($guildRow);
		echo '<li>';
		echo $freeformPageTitle;
		if ($status != '1') {
		echo ' (hidden)';
		}
		echo ' <a href="editpage.php?whichpage='.$pageID.'">edit page</a>';
		echo ' <a href="viewpage.php?whichpage='.$pageID.'">view page</a>';
		echo '</li>'."\n";
		}
	echo '</ul>'."\n";
	} else {
		echo 'No pages created for this Guild yet'."\n";
	}
?>