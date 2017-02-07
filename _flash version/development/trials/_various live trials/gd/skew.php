<?php

// http://uk2.php.net/gd
// image skew 
$angle = 15;
$pDirection = 0; 

header("Content-Type: image/png"); 
imagepng(ImageSkew("bodycrop.png", $angle, $pDirection)); 
exit(); 

function ImageSkew($pImage, $pAngle, $pDirection = 0) { 
  // Source image 
  $iSource = ImageCreateFromPng($pImage); 

  // Destination image 
  list($width, $height, $type, $attr) = getimagesize($pImage); 
  $iCanvas = @imagecreate($width, $height); 
  $cCyan = imagecolorallocate($iCanvas, 255, 0, 255); 
  imagefill($iCanvas, 0, 0, $cCyan); 

  // Pixel differences 
  $diff = ($pAngle / 90); 

  // Loop trough each width pixel 
  $currentHeight = $height; 
  $currentY = 0;
  if ($pDirection == 1) {
   $currentHeight = 0; 
   $currentY = $height;
  }
  for ($i = 0; $i < $width; $i++) { 
   // Take 1*height sample and copy to iCanvas 
   if ($pDirection == 0) {
     imagecopyresampled($iCanvas, $iSource, $i, $currentY, $i, 0, 1, $height, 1, $height); 
   } else {
     imagecopyresampled($iCanvas, $iSource, ($width - $i), $currentY, ($width - $i), 0, 1, $height, 1, $height); 
   }

   // Change heights 
   if ($pDirection == 0) {
     $currentHeight = $currentHeight - ($diff * 2); 
     $currentY = ($height - $currentHeight) / 2; 
   } else {
     $currentHeight = $height - ( $i * ($diff * 2) );
     $currentY = ($height - $currentHeight) / 2; 
   }
  } 

  // Return 
  return $iCanvas; 
} 
?>