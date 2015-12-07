<?php



echo '<meta content="'.$longDescription.'" name="description">'."\n";

include($_SERVER['DOCUMENT_ROOT']."/includes/favicons.html");
?>


<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@autumnearth">
<meta name="twitter:url" content="<?php echo $thisBuiltURL; ?>">
<meta name="twitter:title" content="<?php echo $pagetitle; ?>">
<meta name="twitter:description" content="<?php echo $longDescription; ?>">
<meta name="twitter:image" content="<?php echo $shareImagePath; ?>">


<meta property="og:title" content="<?php echo $pagetitle; ?>">
<meta property="og:image" content="<?php echo $shareImagePath; ?>">
<meta property="og:description" content="<?php echo $longDescription; ?>">
<meta property="og:type" content="website">
<meta property="og:url" content="<?php echo $thisBuiltURL; ?>">
<meta itemprop="name" content="<?php echo $pagetitle; ?>">
<meta itemprop="description" content="<?php echo $longDescription; ?>">
<meta itemprop="image" content="<?php echo $shareImagePath; ?>">



<link rel="canonical" href="<?php echo $thisBuiltURL; ?>" />