<?php
// http://www.flash-db.com/Tutorials/snapshot/snapshot.php?page=3
//If GD library is not installed, say sorry
    if(!function_exists("imagecreate")) {
    die("Sorry, you need GD library to run this example");
    }
    //Capture Post data
    $data = explode(",", $_POST['img']);
    $width = $_POST['width'];
    $height = $_POST['height'];
    //Allocate image
    $image=(function_exists("imagecreatetruecolor"))?imagecreatetruecolor( $width ,$height ):imagecreate( $width ,$height);
    imagefill($image, 0, 0, 0xFFFFFF);
    //Copy pixels
    $i = 0;
    for($x=0; $x<=$width; $x++){
        for($y=0; $y<=$height; $y++){
            while(strlen($data[$i]) < 6) $data[$i] = "0" . $data[$i];
            $r = 255-hexdec("0X".substr( $data[$i] , 0 , 2 ));
            $g = 255-hexdec("0x".substr( $data[$i] , 2 , 2 ));
            $b = 255-hexdec("0x".substr( $data[$i++] , 4 , 2 ));
            $color =  ($r << 16) | ($g << 8) | $b;
            $color = imagecolorallocate($image, $r, $g, $b);
            imagesetpixel ( $image , $x , $y , $color );
        }
    }
    //Output image and clean
    header( "Content-type: image/jpeg" );
    ImageJPEG( $image );
    imagedestroy( $image );        

?>