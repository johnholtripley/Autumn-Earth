<?php
	echo metaphone('rime');
	echo '<br />';
	echo metaphone('rhyme');
	echo '<br />';
	if (metaphone('rime') == metaphone('rhyme')) {
		echo 'match found';
	}
?>