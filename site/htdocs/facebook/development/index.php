



 
      <?php
      error_reporting(0);
require_once('../platform/facebook.php');
$facebook = new Facebook("a92d009d74b00b061895a6ca71b16070","1dacb9038032e7c0eba57bd4959211ef");
$user_id = $facebook->require_login();
$friends = $facebook->api_client->users_getinfo($facebook->api_client->friends_get(), 'birthday');



?>

       

<div style = "padding:5px">
<?php
$todaysDate = strtotime(date("jS") . date("F"));
echo "<p>".$todaysDate."</p><p>Hello <fb:name uid=\"$user_id\" useyou=\"false\" linked=\"false\" firstnameonly=\"true\"></fb:name>, you have ".count($friends)." friends";

?>

</div>



<div style = "padding:0;background-color:#ffffff">
<fb:swf swfsrc="http://www.autumnearth.com/development/bejewelled/bejewelled.swf" swfbgcolor="#ffffff" wmode = "transparent" width="550" height="400" />
</div>

<div style = "padding:5px">
instructions...
</div>

<?php
$message = "AE Bejewelled played";
 
$has_permission = $facebook->api_client->users_hasAppPermission("publish_stream");
 
if(!$has_permission){
     echo "<br /><fb:prompt-permission perms=\"publish_stream\">Publish results on your wall!!</fb:prompt-permission>";
}
else{
     $facebook->api_client->stream_publish($message);
}
?>