<?php

include_once($_SERVER['DOCUMENT_ROOT']."/includes/signalnoise.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/connect.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

if(!isset($fullSitePath)) {
	// done global in title tag for main pages
	$protocol = stripos($_SERVER['SERVER_PROTOCOL'],'https') === true ? 'https://' : 'http://';
$fullSitePath = $protocol.$_SERVER['SERVER_NAME'];
}

$pagenumber = 1;
if(isset($_GET['page'])) {
	$pagenumber = $_GET['page'];
	
$pos = strrpos($pagenumber, "-");
if ($pos !== false) {
	// is a range
	$startpagenumber = substr($pagenumber,0,$pos);
	$endpagenumber = substr($pagenumber,$pos+1);

} else {
	$startpagenumber = $pagenumber;
	$endpagenumber = $pagenumber;
}



} else {
	$startpagenumber = 1;
	$endpagenumber = 1;
}

$query = "select * from tblplants ORDER BY timecreated DESC";
$result = mysqli_query($connection, $query) or die ("couldn't execute query");
$numberOfEntries = mysqli_num_rows($result);


$resultsperpage = 12;
$totalpages = ceil($numberOfEntries/$resultsperpage);
if($endpagenumber > $totalpages) {
$endpagenumber = $totalpages;
// // google recommends a 404 if the page goes out of bounds: https://webmasters.googleblog.com/2014/02/infinite-scroll-search-friendly.html
header("HTTP/1.0 404 Not Found");
}
if($startpagenumber < 1) {
$startpagenumber = 1;
}
if (($startpagenumber>0) && ($endpagenumber <= $totalpages)) {
	$startpoint = ($startpagenumber - 1) * $resultsperpage;
	$endpoint = $endpagenumber * $resultsperpage;
	if ($endpoint > $numberOfEntries) {
		$endpoint = $numberOfEntries;
	}
	if ($numberOfEntries > 0) {
		$rowcount = 0;
		$animationOffset = 0;
		$htmlOutput = "";
		$i = 1;
		$offsetClasses = array(1,2,3,4);
		if(($numberOfEntries>0) && (isset($isInitialPageRequest))) {
	echo '<ul id="herbariumCatalogue" class="row medium-2up wide-3up widest-3up equalHeights paginatedBlock">';
}
		while ($row = mysqli_fetch_array($result)) {
			if (($rowcount>= $startpoint) && ($rowcount<$endpoint)) {
				extract($row);

$additionalClass="";
$innerClass="";
$pictureArray = array(150,277);
if(($i%$resultsperpage == 1) || ($i%$resultsperpage == 8)) {
$additionalClass=" spotlight";
$pictureArray = array(300,604);
}
if(($i%$resultsperpage == 7) || ($i%$resultsperpage == 8) || ($i%$resultsperpage == 9) || ($i%$resultsperpage == 10)) {
$additionalClass=" inbetweenRow";
$pictureArray = array(150,310);
}

				if(isset($isInitialPageRequest)) {
					
				} else {
					$innerClass = 'class="animateIn animateOffset'.$animationOffset.'"';
					$animationOffset ++;
				}


if(rand(1,8) == 1) {
	shuffle($offsetClasses);
	$additionalClass .= " offset".array_pop($offsetClasses);
}
if(rand(1,4) == 1) {
$additionalClass .= " imageOffset";
}

				$htmlOutput .= '<li class="column'.$additionalClass.'" data-aquatic="'.$isAquatic.'" data-night="'.$isNight.'"><div '.$innerClass.' itemscope itemtype="http://schema.org/Thing/Species">';
				$htmlOutput .= '<span itemprop="mainEntityOfPage">';






	$htmlOutput .= '<h4 itemprop="name"><a href="'.$fullSitePath.'/herbarium/'.$plantUrl.'/" class="triggersModal" data-url="'.$plantUrl.'">'.$latinName.'</a></h4><h5><a href="'.$fullSitePath.'/herbarium/'.$plantUrl.'/" class="triggersModal" data-url="'.$plantUrl.'">';

$allCommonNames = explode("/",$commonNamesJoined);
for ($i=0; $i<count($allCommonNames);$i++) {
    $richSnippetText = '<span itemprop="alternateName">'.$allCommonNames[$i].'</span>';
    $commonNames = str_replace($allCommonNames[$i], $richSnippetText, $commonNames);
}
$htmlOutput .= $commonNames;

	$htmlOutput .= '</a></h5>';
	// picture('/images/herbarium/plants/'.$plantUrl.'.jpg', $latinName, $pictureArray, true, ' itemprop="image"', $htmlOutput);
$htmlOutput .= '<a href="'.$fullSitePath.'/herbarium/'.$plantUrl.'/" class="triggersModal" data-url="'.$plantUrl.'"><img src="/images/herbarium/plants/'.$plantUrl.'.png" style="-webkit-shape-outside: url(/images/herbarium/plants/'.$plantUrl.'.png);shape-outside: url(/images/herbarium/plants/'.$plantUrl.'.png);"></a>';
	$htmlOutput .= $plantDesc.'<p>Catalogued '.lcfirst(relativePastDate(strtotime($timeCreated))).'</p></span></div></li>';




			}
			$i++;
			$rowcount++;
		}
		if(isset($isInitialPageRequest)) {
		echo $htmlOutput;
		echo '</ul>';
	} else {
		// construct JSON response:


// only need to escape double quotes, not single:
echo '{"markup": ["'.addcslashes($htmlOutput, '"\\/').'"],"resultsRemaining": ["'.($numberOfEntries-$endpoint).'"]}';



	}
	}
}


?>