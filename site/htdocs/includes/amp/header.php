<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    
    <?php
$thisBuiltURL = "https://www.autumnearth.com/";
$pagetitle = 'Autumn Earth latest news';
if(isset($_GET["articleName"])) {
$cleanURL = $_GET["articleName"];
$thisBuiltURL = $thisBuiltURL."chronicle/".$cleanURL."/";
$query ="select * from tblnews where cleanurl='".$cleanURL."'";
$result = mysql_query($query) or die ("couldn't execute query1");
    $numberofrows = mysql_num_rows($result);
    if ($numberofrows > 0) {
      $row = mysql_fetch_array($result);
      extract ($row);
      $pagetitle = stripCode($newsTitle).' - Autumn Earth news';
    }
}
    ?>
    <title><?php echo $pagetitle; ?></title>
    <link rel="canonical" href="<?php echo $thisBuiltURL; ?>" />
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "headline": "Open-source framework for publishing content",
        "datePublished": "2015-10-07T12:02:41Z",
        "image": [
          "https://www.autumnearth.com/images/icons/120.png"
        ]
      }
    </script>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  </head>
  <body>