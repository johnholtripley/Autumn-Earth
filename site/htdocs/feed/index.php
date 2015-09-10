<?php

include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$query = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 5";
$result = mysql_query($query) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {

header("Content-type: text/xml; charset=iso-8859-1");
echo '<?xml version="1.0" encoding="iso-8859-1"?>'."\n";
echo '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">'."\n";
	echo '<channel>'."\n";
		echo '<title>Autumn Earth News</title>'."\n";
		echo '<link>http://www.autumnearth.com/feed/</link>'."\n";
		echo '<description>Latest News from the world of Autumn Earth</description>'."\n";
		echo '<language>en</language>'."\n";
		echo '<docs>http://validator.w3.org/feed/docs/rss2.html</docs>'."\n";
		echo '<image>'."\n";
			echo '<url>http://www.autumnearth.com/assets/feeds/icon.gif</url>'."\n";
			echo '<title>Autumn Earth News</title>'."\n";
			echo '<link>http://www.autumnearth.com/feed/</link>'."\n";
			echo '<width>20</width>'."\n";
			echo '<height>20</height>'."\n";
		echo '</image>'."\n";
		echo '<atom:link href="http://www.autumnearth.com/feed/" rel="self" type="application/rss+xml" />'."\n";
// get each item:
$isFirstTime = true;
while ($row = mysql_fetch_array($result)) {

	extract($row);
	$timeAdded = strtotime($timeAdded);
	if ($isFirstTime) {
		// use date of most recent article:
		echo '<pubDate>'.strftime("%a, %d %b %Y %H:%M:%S",$timeAdded).' GMT</pubDate>'."\n";
		$isFirstTime = false;
	}
	echo '<item>'."\n";
		echo '<title>'.$newsTitle.'</title>'."\n";
		echo '<link>http://www.autumnearth.com/feed/</link>'."\n";
		echo '<description>'.$newsSynopsis.'</description>'."\n";
		echo '<author>feeds@autumnearth.com (Autumn Earth)</author>'."\n";
		if ($postedBy != "") {
			// in game news
			echo '<category>Events</category>'."\n";
		} else {
			echo '<category>News</category>'."\n";
		}
		echo '<comments>http://www.autumnearth.com/forum/ViewThread.php?thread=34</comments>'."\n";
		// encode date correctly:
		echo '<pubDate>'.strftime("%a, %d %b %Y %H:%M:%S",$timeAdded).' GMT</pubDate>'."\n";
		echo '<guid isPermaLink="true">http://www.autumnearth.com/chronicle/'.$cleanURL.'</guid>'."\n";
		// replace any relative paths in the news content:
		$newsContent = str_ireplace("href=\"/","href=\"http://www.autumnearth.com/",$newsContent);
		$newsContent = str_ireplace("src=\"/","src=\"http://www.autumnearth.com/",$newsContent);
		// remove any continue tags:
		$newsContent = str_ireplace('[CONTINUE]','',$newsContent);
		echo '<content:encoded><![CDATA[<p>'.$newsContent.'</p>';
		if ($postedBy != "") {
			echo '<p> - posted by '.$postedBy.'</p>';
		}
		echo ']]>'."\n";
		echo '</content:encoded>'."\n";
	echo '</item>'."\n";
}

echo '</channel>'."\n";
echo '</rss>'."\n";
} 



?>