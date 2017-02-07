<?php
function highlight($textcontent,$highlight) {

	$tempstring = "";
	$hilightlen = strlen($highlight);
	$i = 0;
	while ($i<strlen($textcontent)) {
		$check = substr($textcontent, $i, $hilightlen);
		if (strcasecmp($check, $highlight) == 0) {
			// have a case in-sensitive match:
			$tempstring .= '<span class="HighLight">'.$check.'</span>';
			$i += $hilightlen;
		} else {
			$tempstring .= substr($textcontent, $i, 1);
			$i++;
		}
	}
	return $tempstring;
}

echo highlight("mary had a little lamb","a litt");
?> 