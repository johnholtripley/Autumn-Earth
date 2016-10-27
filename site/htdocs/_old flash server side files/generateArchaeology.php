 <?php

// maybe use Blender on the server to create the image, passing in a pattern material and base colour?
// http://blender.stackexchange.com/questions/14755/generate-an-image-from-3d-model-server-side

// check that the seed produces unique results
// having 2 digits for each of the 4 values would only give 12 duplicates. If the second value (pattern colour) is 3 digits, then there's only the duplication at 0000

// Check for any magenta in the image?
// Random magenta cracks drawn over image
// Iterate through pixels, if not on checked list, flood fill to find all in that piece. Create single image with that fragment, don't trim. Keep full size to be able to align them all again in Flash

$thisPlayersId = $_GET["playerId"];
$outputMode = "";
if (isset($_GET["outputMode"])) {
    $outputMode = $_GET["outputMode"];
}
$startSeed = "0102";
if ($outputMode != "test") {
    do {
        // pick a random seed
        $thisSeed = $startSeed;
        $seedDirectory = "data/chr" . $thisPlayersId . "/archaeology/" . $thisSeed;
        $startSeed++;
    } while (is_dir($seedDirectory));
    mkdir($seedDirectory);
} else {

if (isset($_GET["seed"])) {
$startSeed = $_GET["seed"];
} 

    $thisSeed = $startSeed;
    $seedDirectory = "data/chr" . $thisPlayersId . "/archaeology/" . $startSeed;
    if (!(is_dir($seedDirectory))) {
        mkdir($seedDirectory);
    }
}

// all possible values that the seed can pick from:
$baseColourPool = array(array(0, 71, 23),array(25, 71, 23),array(50, 71, 23),array(75, 71, 23),array(100, 71, 23),array(125, 71, 23),array(150, 71, 23),array(175, 71, 23),array(200, 71, 23),array(225, 71, 23));
$patternColourPool = array(array(0, 163, 72),array(25, 163, 72),array(50, 163, 72),array(75, 163, 72),array(100, 163, 72),array(125, 163, 72),array(150, 163, 72),array(175, 163, 72),array(205, 163, 72),array(215, 163, 72));
$objectPool = array("vase","vase","vase","jug","jug","jug","pitcher","pitcher","pitcher","pitcher");
$patternPool = array("swirls","swirls","geometric","swirls","geometric","paisley","paisley","geometric","paisley","paisley");

// split seed into 2 lots of 2 digit numbers:
// https://www.youtube.com/watch?v=iTBvpd3_Vqk
$seedSequence = array(intval(substr($thisSeed,0,2)), intval(substr($thisSeed,2,2)));

// for this pool, need a sequence of 4 single digit numbers from the seed (using a fibonacci sequence)
for ($i = 2; $i < 6; $i++) {
array_push($seedSequence, $seedSequence[$i-2] + $seedSequence[$i-1]);
}

// generate values from the seed:
$baseColour        = $baseColourPool[intval(substr($seedSequence[2],-1))];
$patternColour     = $patternColourPool[intval(substr($seedSequence[3],-1))];
$objectName        = $objectPool[intval(substr($seedSequence[4],-1))];
$patternName       = $patternPool[intval(substr($seedSequence[5],-1))];

$sourceSilhouette  = imagecreatefrompng("templates/objects/silhouettes/" . $objectName . ".png");
$imageWidth        = imagesx($sourceSilhouette);
$imageHeight       = imagesy($sourceSilhouette);
$sourcePattern     = imagecreatefrompng("templates/patterns/" . $patternName . ".png");
$generatedMaterial = imagecreatetruecolor($imageWidth, $imageHeight);
imagealphablending($generatedMaterial, true);
imagesavealpha($generatedMaterial, true);
$baseColourFlat = imagecolorallocate($generatedMaterial, $baseColour[0], $baseColour[1], $baseColour[2]);
imagefilledrectangle($generatedMaterial, 0, 0, $imageWidth, $imageHeight, $baseColourFlat);


$colouredPattern = imagecreatetruecolor($imageWidth, $imageHeight);
imagealphablending($colouredPattern, true);
imagesavealpha($colouredPattern, true);
$basePatternFlat = imagecolorallocate($colouredPattern, $patternColour[0], $patternColour[1], $patternColour[2]);
imagefilledrectangle($colouredPattern, 0, 0, $imageWidth, $imageHeight, $basePatternFlat);


$patternImageWidth  = imagesx($sourcePattern);
$patternImageHeight = imagesy($sourcePattern);

// colour the pattern:
$finalPattern = imagecreatetruecolor($patternImageWidth, $patternImageHeight);
imagesavealpha($finalPattern, true);
imagefill($finalPattern, 0, 0, imagecolorallocatealpha($finalPattern, 0, 0, 0, 127));
$transparent = imagecolorallocatealpha($finalPattern, 0, 0, 0, 127);
for ($x = 0; $x < $patternImageWidth; $x++) {
    for ($y = 0; $y < $patternImageHeight; $y++) {
        $alpha = imagecolorsforindex($sourcePattern, imagecolorat($sourcePattern, $x, $y));
        if (($alpha['red'] == 0) && ($alpha['green'] == 0) && ($alpha['blue'] == 0) && ($alpha['alpha'] == 0)) {
            // It's a black part of the mask
            imagesetpixel($finalPattern, $x, $y, $transparent);
        } else {
            // Check the alpha state of the corresponding pixel of the image we're dealing with.    
            $alphaSource = imagecolorsforindex($colouredPattern, imagecolorat($colouredPattern, $x, $y));
            if (($alphaSource['alpha'] == 127)) {
                imagesetpixel($finalPattern, $x, $y, $transparent);
            } else {
                $color = imagecolorsforindex($colouredPattern, imagecolorat($colouredPattern, $x, $y));
                imagesetpixel($finalPattern, $x, $y, imagecolorallocatealpha($finalPattern, $color['red'], $color['green'], $color['blue'], $color['alpha'])); // Stick the pixel from the source image in
            }
        }
    }
}



// check to see if pattern is smaller than the silhouette
if (($patternImageWidth < $imageWidth) || ($patternImageHeight < $imageHeight)) {
    // repeat pattern:
    $xDifference = ceil($imageWidth / $patternImageWidth);
    $yDifference = ceil($imageHeight / $patternImageHeight);
    for ($x = 0; $x < $xDifference; $x++) {
        for ($y = 0; $y < $yDifference; $y++) {
            imagecopy($generatedMaterial, $finalPattern, ($x * $patternImageWidth), ($y * $patternImageHeight), 0, 0, $patternImageWidth, $patternImageHeight);
        }
    }
} else {
    imagecopy($generatedMaterial, $finalPattern, 0, 0, 0, 0, $imageWidth, $imageHeight);
}
// ---------------------
// apply the silhouette:
// http://stackoverflow.com/questions/10926712/masking-one-image-against-another-using-php-gd
$finalOutput = imagecreatetruecolor($imageWidth, $imageHeight);
imagesavealpha($finalOutput, true);
imagefill($finalOutput, 0, 0, imagecolorallocatealpha($finalOutput, 0, 0, 0, 127));
$transparent = imagecolorallocatealpha($finalOutput, 0, 0, 0, 127);
for ($x = 0; $x < $imageWidth; $x++) {
    for ($y = 0; $y < $imageHeight; $y++) {
        $alpha = imagecolorsforindex($sourceSilhouette, imagecolorat($sourceSilhouette, $x, $y));
        if (($alpha['red'] == 0) && ($alpha['green'] == 0) && ($alpha['blue'] == 0) && ($alpha['alpha'] == 0)) {
            // It's a black part of the mask
            imagesetpixel($finalOutput, $x, $y, $transparent);
        } else {
            // Check the alpha state of the corresponding pixel of the image we're dealing with.    
            $alphaSource = imagecolorsforindex($generatedMaterial, imagecolorat($generatedMaterial, $x, $y));
            if (($alphaSource['alpha'] == 127)) {
                imagesetpixel($finalOutput, $x, $y, $transparent);
            } else {
                $color = imagecolorsforindex($generatedMaterial, imagecolorat($generatedMaterial, $x, $y));
                imagesetpixel($finalOutput, $x, $y, imagecolorallocatealpha($finalOutput, $color['red'], $color['green'], $color['blue'], $color['alpha'])); // Stick the pixel from the source image in
            }
        }
    }
}
// ---------------------
// shrink to half size to anti-alias:
$resampled = imagecreatetruecolor($imageWidth / 2, $imageHeight / 2);
imagealphablending($resampled, false);
imagesavealpha($resampled, true);
imagecopyresampled($resampled, $finalOutput, 0, 0, 0, 0, $imageWidth / 2, $imageHeight / 2, $imageWidth, $imageHeight);
imagepng($resampled, $seedDirectory . "/" . $objectName . ".png", 0);
if ($outputMode == "test") {
?>
   
<html>
<head>
<title>Archaeology</title>
<style>
body{
background:#cecece;
}
</style>
</head>
<body>
<?php
echo '<img src="' . $seedDirectory . "/" . $objectName . '.png' . '">';
?>
</body>
</html>
    
    <?php
}
imagedestroy($sourceSilhouette);
imagedestroy($sourcePattern);
imagedestroy($colouredPattern);
imagedestroy($finalPattern);
imagedestroy($generatedMaterial);
imagedestroy($finalOutput);
imagedestroy($resampled);
?> 