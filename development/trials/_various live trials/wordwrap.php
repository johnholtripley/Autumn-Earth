<html>
<head>
<title>test word wrap</title>
</head>

<body>

<?php
$mylongstring="Loremipsumdolor sit amet, consecte tueradi, piscinge litsed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quisnos trudexe rcitati nullam corper suscipit lobortis nisl utal iqu ipexe acommodo consequat. Duis autem vel eumiri ured olorinhe ndrerit in vulputate velit esse molestie consequat, vel illum dolore eu <a href=\"#\">feugianullafacilisisatveroerosetaccumsanetiustoodio</a> dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.";

?>

<div style="width: 140px; border: 1px solid red;">
<?php
echo wordwrap($mylongstring,23," ",1);
?>
</div>

</body>
</html>