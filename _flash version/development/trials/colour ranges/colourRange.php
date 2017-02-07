<html>
<head>
<title>colour</title>

<style>
.block {
width: 16px;
height: 16px;
float: left;
margin: 0 2px 2px 0;
}
</style>

</head>
<body>

<?php

$redMin = 80;
$redMax = 200;
$blueMin = 80;
$blueMax = 200;
$greenMin = 80;
$greenMax = 200;


for ($r=$redMin; $r<=$redMax; $r+=8) {
for ($g=$greenMin; $g<=$greenMax; $g+=8) {
for ($b=$blueMin; $b<=$blueMax; $b+=8) {


echo '<div class="block" style="background: rgb('.$r.','.$g.','.$b.')"></div>'."\n";

}
}
}


?>

</body>
</html>