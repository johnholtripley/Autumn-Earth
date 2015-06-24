<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.inc");

$query = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 5";
$result = mysql_query($query) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {

header("Content-type: text/xml; charset=iso-8859-1");

echo '<?xml version="1.0" encoding="iso-8859-1"?>'."\n";
echo '<?xml-stylesheet type="text/css" href="http://www.autumnearth.com/assets/feeds/atom.css" ?>'."\n";
echo '<feed xmlns="http://www.w3.org/2005/Atom">'."\n";
	
	echo '<title>Autumn Earth News</title>'."\n";
	echo '<link href="http://www.autumnearth.com/feed/"/>'."\n";
	
	echo '<author>'."\n";
		echo '<name>Autumn Earth</name>'."\n";
		echo '<email>feeds@autumnearth.com</email>'."\n";
	echo '</author>'."\n";
	echo '<id>http://www.autumnearth.com/news/index.php?article=1</id>'."\n";
	echo '<link rel="self" type="application/atom+xml" href="http://www.autumnearth.com/feed/atom.php"/>'."\n";
	
	
	// get each item:
$isFirstTime = true;
while ($row = mysql_fetch_array($result)) {

	extract($row);
	$timeAdded = strtotime($timeAdded);
	if ($isFirstTime) {
		// use date of most recent article - RFC 3339 date format:
		echo '<updated>'.date("Y-m-d\TH:i:s\Z",$timeAdded).'</updated>'."\n";
		$isFirstTime = false;
	}
		
	echo '<entry>'."\n";
	echo '<title>'.$newsTitle.'</title>'."\n";
	echo '<link href="http://www.autumnearth.com/feed/atom.php"/>'."\n";
	echo '<id>http://www.autumnearth.com/news/index.php?article='.$newsID.'</id>'."\n";
	
	echo '<published>'.date("Y-m-d\TH:i:s\Z",$timeAdded).'</published>'."\n";
	echo '<updated>'.date("Y-m-d\TH:i:s\Z",$timeAdded).'</updated>'."\n";
	echo '<summary>'.$newsSynopsis.'</summary>'."\n";
	// replace any relative paths in the news content:
		$newsContent = str_ireplace("href=\"/","href=\"http://www.autumnearth.com/",$newsContent);
		$newsContent = str_ireplace("src=\"/","src=\"http://www.autumnearth.com/",$newsContent);
		// remove any continue tags:
		$newsContent = str_ireplace('[CONTINUE]','',$newsContent);
		
	echo '<content type="html"><![CDATA[<p>'.$newsContent.'</p>';
		if ($postedBy != "") {
			echo '<p> - posted by '.$postedBy.'</p>';
		}
		echo ']]>'."\n";
		echo '</content>'."\n";
	
	
	
	echo '</entry>'."\n";
	
	}
	

echo '</feed>'."\n";
} 
include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
?>