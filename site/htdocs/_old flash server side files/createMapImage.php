<?php
$imageWidth = $_POST["iwidth"];
$imageHeight = $_POST["iheight"];
$pixelData = $_POST["pixelData"];
$filename = "data/chr".$_POST["playerId"]."/".$_POST["filename"].".jpg";
$rebuiltImage = imagecreatetruecolor($imageWidth, $imageHeight);
// flash doesn't pass any white pixels, so pre-fill the new image with these:
imagefill($rebuiltImage, 0, 0, 0xFFFFFF);
$rows = explode("|",$pixelData);
for ($i=0; $i<count($rows); $i++) {
  $pixels = explode(",",$rows[$i]);
  for ($j=0; $j<count($pixels); $j++) {
    $thisPixel = $pixels[$j];
    if ($thisPixel != "") {
      $hex = $thisPixel;
      while(strlen($hex) < 6){
        $hex = "0" . $hex;
      }
      // convert value from HEX to RGB
      $colR = hexdec(substr($hex, 0, 2));
      $colG = hexdec(substr($hex, 2, 2));
      $colB = hexdec(substr($hex, 4, 2));

      // sepia tone:
      $r = ( $colR * 0.393 + $colG * 0.769 + $colB * 0.189 );
      $g = ( $colR * 0.349 + $colG * 0.686 + $colB * 0.168 );
      $b = ( $colR * 0.272 + $colG * 0.534 + $colB * 0.131 );
      
      if ($r>255) {
        $r = 255;
      }
      if ($g>255) {
        $g = 255;
      }
      if ($b>255) {
        $b = 255;
      }

      $thisPixelCol = imagecolorallocate($rebuiltImage, $r, $g, $b);
      imagesetpixel($rebuiltImage, $j, $i, $thisPixelCol);
    }
  }
}
// add map overlay:
$overlayfile_id = imagecreatefrompng("images/treasure-map-overlay.png");
imageAlphaBlending($overlayfile_id, false);
imagecopy($rebuiltImage, $overlayfile_id, 0, 0, 0, 0, 100, 100);

$wasSuccessful = imagejpeg($rebuiltImage,$filename,90);
echo "processResult=".$wasSuccessful;
echo "&imageFilePath=".$filename;
imagedestroy($overlayfile_id);
imagedestroy($rebuiltImage);

?>