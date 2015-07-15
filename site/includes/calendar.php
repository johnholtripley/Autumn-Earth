
<hr />
<h3>events calendar</h3>



<?php
// get today's date:
$date = mktime(0,0,0,date('m'), date('d'), date('Y'));
$day = date('j', $date);
$monthnumeric = date('m', $date);
$year = date('Y', $date);
// check for GET data:
if (isset($_GET["year"])) {
	$thismonth = $_GET["month"];
	$thisyear = $_GET["year"];
	if ($thismonth == 13) {
		$thismonth = 1;
		$thisyear += 1;
	} else if ($thismonth == 0) {
		$thismonth = 12;
		$thisyear -= 1;
	}
} else {
	// use the current month:
	$thismonth = $monthnumeric;
	$thisyear = $year;
}

// get the first day of this month:
$thisdate = mktime(0,0,0,$thismonth,1,$thisyear);
// get number of days in this month:
$monthdays = date('t', $thisdate);
$firstdaynumeric = date('N', $thisdate);
$monthname = date('F', $thisdate);
//
$thislastday = mktime(0,0,0,$thismonth,$monthdays,$thisyear);



$query = "select * from tblEvents WHERE UNIX_TIMESTAMP(eventStart)<='".$thislastday."' AND UNIX_TIMESTAMP(eventEnd)>='".$thisdate."'";
$result = mysql_query($query) or die ("couldn't execute query");

// set up events
$events = array();
//
while ($row = mysql_fetch_array($result)) {
	extract($row);
	array_push($events, array('startdate' => $eventStart, 'enddate' => $eventEnd, 'cssclass' => $css, 'tooltip' => $tooltip, 'link' => $link));
}

$dayevents = array();
// set up which days have an event:


for ($i=1; $i<=($monthdays); $i++) {
	$dayevents[$i] = "-100";
	// -100 because -1 can be a cell within the loop if the month doesn't start on monday
	$thisday = mktime(0,0,0,$thismonth,$i,$thisyear);
	for ($j = 0; $j<=count($events); $j++) {
		if(isset($events[$j]['startdate'])) {
		$thiseventstart = strtotime($events[$j]['startdate']);
		$thiseventend = strtotime($events[$j]['enddate']);
		if ($thisday >= $thiseventstart) {
			if ($thisday <= $thiseventend) {
				$dayevents[$i] = $j;
			}
		}
	}
	}
}

echo'<img src="/assets/calendar/'.$monthname.'.jpg" width="175" height="84" alt="Events being held in '.$monthname.'" /><br />'."\n";
echo'<a href="'.$_SERVER['PHP_SELF'].'?year='.$thisyear.'&amp;month='.($thismonth-1).'">&lt; </a>'.$monthname.' '.$thisyear.'<a href="'.$_SERVER['PHP_SELF'].'?year='.$thisyear.'&amp;month='.($thismonth+1).'"> &gt;</a>'."\n";
echo'<table id="Calendar" summary="Events Calendar for '.$monthname.'">'."\n";
echo'<tr><td class="DateItem">Mon</td><td class="DateItem">Tue</td><td class="DateItem">Wed</td><td class="DateItem">Thu</td><td class="DateItem">Fri</td><td class="DateItem">Sat</td><td class="DateItem">Sun</td></tr>'."\n";
// calculate number of table cells required:
$blankstart = ($firstdaynumeric-1);

$blankend = (7-(($monthdays+$blankstart)%7));
if ($blankend ==7) {
$blankend =0;
}

for ($i=1; $i<=($monthdays+$blankend+$blankstart); $i++) {
if ($i%7 == 1) {
echo'<tr>';

}

$loopday = $i-$blankstart;



if (($i>$blankstart) && ($i<=$monthdays+$blankstart)) {


if ($dayevents[$loopday] != "-100") {
echo'<td class="DateItem" id="'.$events[$dayevents[$loopday]]['cssclass'].'">';
} else {
echo'<td class="DateItem">';
}


if (($thismonth == $monthnumeric) && ($thisyear == $year) && ($loopday == $day)) {
	echo'<div id="today">';
} 

if ($dayevents[$loopday] != "-100") {
echo'<a href="'.$events[$dayevents[$loopday]]['link'].'" onmouseover="dyntooltip(\'tooltipevent\',\''.$events[$dayevents[$loopday]]['tooltip'].'\');" onmouseout="exit(\'tooltipevent\');">'.$loopday.'</a>';
} else {
echo $loopday;
}

if (($thismonth == $monthnumeric) && ($thisyear == $year) && ($loopday == $day)) {
	echo'</div>'."\n";
	
	} 

echo'</td>'."\n";

} else {
echo '<td class="DateItem">&nbsp;</td>'."\n";
}

// check for row ends:

if ($i%7 == 0) {
echo'</tr>'."\n";

}

}


echo'</table>'."\n";
?>
<div id="tooltipevent" class="ttip">
<div class="ttiptop">
<div id="ttipdyn" name="ttipdyn"><p>click for event details</p></div>
	</div>
	<div class="ttipbottom">&nbsp;</div>
</div>

<hr />
