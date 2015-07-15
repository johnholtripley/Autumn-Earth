<?php
/*
include($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

$query = "select * from tblNews WHERE status='1' order by timeAdded DESC limit 5";
$result = mysql_query($query) or die ("couldn't execute query");

if (mysql_num_rows($result) > 0) {

header("Content-type: text/xml; charset=iso-8859-1");
echo '<?xml version="1.0" encoding="iso-8859-1"?>'."\n";
echo '<?xml-stylesheet type="text/css" href="http://www.autumnearth.com/assets/feeds/rss.css" ?>'."\n";
echo '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">'."\n";
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
		echo '<author>feeds@autumnearth.com</author>'."\n";
		if ($postedBy != "") {
			// in game news
			echo '<category>Events</category>'."\n";
		} else {
			echo '<category>News</category>'."\n";
		}
		echo '<comments>http://www.autumnearth.com/forum/ViewThread.php?thread=34</comments>'."\n";
		// encode date correctly:
		echo '<pubDate>'.strftime("%a, %d %b %Y %H:%M:%S",$timeAdded).' GMT</pubDate>'."\n";
		echo '<guid isPermaLink="true">http://www.autumnearth.com/news/index.php?article='.$newsID.'</guid>'."\n";
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
include($_SERVER['DOCUMENT_ROOT']."/includes/close.php");
*/


















echo '<?xml version="1.0" encoding="iso-8859-1"?><rss version="2.0"><channel><title>Autumn Earth</title><link>http://www.autumnearth.com/feed</link><description>Autumn Earth Feed</description><language>en</language><pubDate>Tue, 13 Oct 2009 00:00:00 +0000</pubDate><lastBuildDate>Mon, 09 Nov 2009 18:23:10 +0000</lastBuildDate><item><title>Autumn Earth Feed place holder</title><link>http://www.autumnearth.com/news/</link><description>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquam metus sed arcu dictum non vehicula turpis adipiscing. Curabitur vel diam tortor. Fusce at ligula sit amet metus accumsan ullamcorper vitae at arcu. Nulla tincidunt orci accumsan quam fringilla ultrices.</description><pubDate>Mon, 09 Nov 2009 00:00:00 +0000</pubDate><guid>http://www.autumnearth.com/news/</guid></item></channel></rss>';

?>