<?php 
$image = 'images/red.png'; 
?> 
<img src="<?php echo ( file_exists( $image ) ? $image : "image.php?a=red&b=big&c=png"; ?>" />
