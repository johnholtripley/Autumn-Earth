<?php

include($_SERVER[DOCUMENT_ROOT]."/includes/signalnoise.php");
$password="";
?>
 <!-- Program Name:  mysql_send.php
     Description: PHP program that sends an SQL query to the 
                  MySQL server and displays the results.
-->
<html>
<head>
<title>SQL Query Sender</title>
</head>
<body>
<?php
 $thispage = $_SERVER['PHP_SELF'];
$database = "autumnearth";
 /* Section that executes query */
 if ($_GET["form"] == "yes")  
 {
 

 
  
   $query = $_POST["query"];
 
   $myconnection = mysql_connect($host,$user,$_POST["password"]);
   mysql_select_db($database);
   $query = stripSlashes($_POST["query"]) ;
   $result = mysql_query($query);
   echo "Database Selected: <b>$database</b><br>
          Query: <b>$query</b>
          <h3>Results</h3>
          <hr>";
   if ($result == 0)
      echo("<b>Error " . mysql_errno() . ": " . mysql_error() . "</b>");

   elseif (@mysql_num_rows($result) == 0)
      echo("<b>Query completed. No results returned.</b><br>");
   else
   {
     echo "<table border='1'>
           <thead>
            <tr>";
             for ($i = 0; $i < mysql_num_fields($result); $i++) 
             {
                 echo("<th>" . mysql_field_name($result,$i) . "</th>");
             }
     echo " </tr>
           </thead>
           <tbody>";
             for ($i = 0; $i < mysql_num_rows($result); $i++) 
             {
                echo "<tr>";
                $row = mysql_fetch_row($result);
                for ($j = 0; $j < mysql_num_fields($result); $j++) 
                {
                  echo("<td>" . $row[$j] . "</td>");
                }
                echo "</tr>";
             }
             echo "</tbody>
                  </table>";
   }
   
  
   
   echo "<hr><br>
         <form action=$thispage method=post>
          <input type=hidden name=query value=\"$query\">
          <input type=hidden name=password value=$password>
          <input type=submit name=\"queryButton\" value=\"New Query\">
          <input type=submit name=\"queryButton\" value=\"Edit Query\">
         </form>";
   unset($form);
   exit();
   mysql_close($myconnection);
 }

 /* Section that requests user input of query 
 @$query = stripSlashes($query);
 if (@$queryButton != "Edit Query")  
 {
   $database = " ";
   $query = " ";
 }
 
*/
 
?>

<form action="<?php echo $thispage ?>?form=yes" method="post">
 <table>
  <tr>
   <td align="right"><b>Type in password</b></td>
   <td>
     <input type=text name="password" value="<?php echo $password ?>" >
   </td>
  </tr>
  <tr>
   <td align="right" valign="top"><b>Type in SQL query</b></td>
	 <td><textarea name="query" cols="60" rows="10"><?php echo $_POST["query"] ?></textarea>
   </td>
  </tr>
  <tr>
   <td colspan="2" align="center"><input type="submit" value="Submit Query"></td>
  </tr>
 </table>
</form>
 
</body>
</html>
