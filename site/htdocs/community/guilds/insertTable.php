<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<title>insert table</title>
<meta content="Autumn Earth" name="description" />

<meta content="text/html; charset=iso-8859-1" http-equiv="content-type" />
<meta content="no" http-equiv="imagetoolbar" />
<meta content="TRUE" name="MSSmartTagsPreventParsing" />

<script language="javascript" src="/includes/core.js" type="text/javascript"></script>
<script language="javascript" src="/includes/htmlEditor.js" type="text/javascript"></script>

<script type="text/javascript">
function drawPreview() {

  // create new table:
  tableRows = document.insertTableForm.tableRows.value;
  tableCols = document.insertTableForm.tableCols.value;
  borderSize = document.insertTableForm.borderWidth.value;
  borderColour = document.insertTableForm.borderColour.value;
  tableWidth = document.insertTableForm.tableWidth.value;
  widthUnits = document.insertTableForm.widthUnits.value;
  tableHeight = document.insertTableForm.tableHeight.value;
  heightUnits = document.insertTableForm.heightUnits.value;
  tablePadding = document.insertTableForm.tableCellPadding.value;
  tableSpacing = document.insertTableForm.tableCellSpacing.value;
  backgroundColour = document.insertTableForm.backgroundColour.value;
  
  // remove any preceeding '#' if there is one:
  if (backgroundColour.substring(0,1) == "#") {
    backgroundColour = backgroundColour.substring(1,backgroundColour.length);
    document.insertTableForm.backgroundColour.value = backgroundColour;
	}
	if (borderColour.substring(0,1) == "#") {
    borderColour = borderColour.substring(1,borderColour.length);
    document.insertTableForm.borderColour.value = borderColour;
	}
	
	anyErrors = false;

	// check that the hex values are valid:
	if ((borderSize>0) && (!(isValidHex(borderColour)))) {
		anyErrors = true;
		if (getElement("tableBorderColValid")) {
			thiselement.style.display = "inline";
		}
	} else {
		if (getElement("tableBorderColValid")) {
			thiselement.style.display = "none";
		}
	}
	
	if (!(isValidHex(backgroundColour)) && (backgroundColour != "(none)")) {
		anyErrors = true;
		if (getElement("tableBGColValid")) {
			thiselement.style.display = "inline";
		}
	} else {
		if (getElement("tableBGColValid")) {
			thiselement.style.display = "none";
		}
	}
	
	// check that dimensions are valid:
	if (isNaN(tableWidth)) {
	  anyErrors = true;
	  if (getElement("tableWidthValid")) {
		thiselement.style.display = "inline";
	  }
	} else {
		if (getElement("tableWidthValid")) {
		thiselement.style.display = "none";
	  }
	}
	
	if (isNaN(tableHeight)) {
	  anyErrors = true;
	  if (getElement("tableHeightValid")) {
		thiselement.style.display = "inline";
	  }
	} else {
			if (getElement("tableHeightValid")) {
		thiselement.style.display = "none";
	  }
	}
	if (isNaN(tableSpacing)) {
	  anyErrors = true;
	  	  if (getElement("tableSpacingValid")) {
		thiselement.style.display = "inline";
	  }
	} else {
	 if (getElement("tableSpacingValid")) {
		thiselement.style.display = "none";
	  }
	}
	
	if (isNaN(tablePadding)) {
	  anyErrors = true;
	  if (getElement("tablePaddingValid")) {
		thiselement.style.display = "inline";
	  }
	} else {
		  if (getElement("tablePaddingValid")) {
		thiselement.style.display = "none";
	  }
	}
	
	
	if (tablePadding < 0) {
	tablePadding = 0;
	document.insertTableForm.tableCellPadding.value = tablePadding;
	}
	if (tableSpacing < 0) {
	tableSpacing = 0;
	document.insertTableForm.tableCellSpacing.value = tableSpacing;
	}
	
	if (widthUnits == '%') {
		if (tableWidth > 100) {
			tableWidth = 100;
			document.insertTableForm.tableWidth.value = tableWidth;
		}
	} else if (tableWidth > 1000) {
		// stop table width being too wide (if in pixels):
		tableWidth = 1000;
		document.insertTableForm.tableWidth.value = tableWidth;
	}
	if (tableWidth < 1) {
			tableWidth = 1;
			document.insertTableForm.tableWidth.value = tableWidth;
	}
	if (heightUnits == '%') {
		if (tableHeight > 100) {
			tableHeight = 100;
			document.insertTableForm.tableHeight.value = tableHeight;
		}
	}
	if (tableHeight < 1) {
			tableHeight = 1;
			document.insertTableForm.tableHeight.value = tableHeight;
	}
	  
  if (anyErrors == false) {
    // remove existing child node:
  if (getElement("PreviewWrapper")) {
    thiselement.removeChild(thiselement.childNodes[0]);
  }
  newContent = document.createElement("table");
  styleAttributes = "width: "+tableWidth+widthUnits+";height: "+tableHeight+heightUnits+";";
  if (borderSize>0) {
    styleAttributes += "border: "+borderSize+"px solid #"+borderColour+";";
  }
  if (backgroundColour != "(none)") {
    styleAttributes += "background-color: #"+backgroundColour+";";
    // ensure that the body colour is visible over the background colour:
    if (backgroundColour<'888888') {
      styleAttributes += "color: #fff;";
    } else {
      styleAttributes += "color: #000;";
    }
  }
  newContent.setAttribute("style",styleAttributes);
  newContent.setAttribute("cellpadding",tablePadding);
  newContent.setAttribute("cellspacing",tableSpacing);
  for (var thisRow = 1; thisRow<=tableRows; thisRow++) {
    var newRow = document.createElement("tr");
    for (var thisCol = 1; thisCol<=tableCols; thisCol++) {
      var newCell = document.createElement("td");
      var cellContents = document.createTextNode("column "+thisCol+", row "+thisRow);
      newCell.appendChild(cellContents);
      newRow.appendChild(newCell);
    }
    newContent.appendChild(newRow);
  }
  
  thiselement.appendChild(newContent);
  }
 }
</script>

<style type="text/css">
.Error {
border: 2px solid red;
}

#PreviewWrapper {
width: 380px;
height: 200px;
overflow: auto;
}

#PreviewWrapper td, #PreviewWrapper th {
border: 1px dotted #cecece;
}

.Hidden {
display: none;
}

.JsHidden {
/* used on elements that need to be revealed by JS but don't need to be shown if JS is disabled */
display: none;
color: #ff0000;
font-weight: bold;
}

</style>

</head>

<body onload="drawPreview();">

<?php
include($_SERVER['DOCUMENT_ROOT']."/includes/functions.php");

// set up default values:
$tableWidth = "200";
$tableHeight = "100";
$widthUnits = "px";
$heightUnits = "px";
$tableRows = "2";
$tableCols = "2";
$borderWidth = "0";
$borderColour = "";
$backgroundColour = "(none)";
$tableCellPadding = "0";
$tableCellSpacing = "0";

// check for POST data
if (@($_POST["insertTableButton"] == "insert table")) {
	// validate details:
	$errors = "";
	$tableWidth = trim($_POST["tableWidth"]);
	$tableHeight = trim($_POST["tableHeight"]);
	$widthUnits = $_POST["widthUnits"];
	$heightUnits = $_POST["heightUnits"];
	$tableRows = $_POST["tableRows"];
	$tableCols = $_POST["tableCols"];
	$borderWidth = $_POST["borderWidth"];
	$borderColour = trim($_POST["borderColour"]);
	$backgroundColour = trim($_POST["backgroundColour"]);
	$tableCellPadding = trim($_POST["tableCellPadding"]);
	$tableCellSpacing = trim($_POST["tableCellSpacing"]);
	
	if (!(is_numeric($tableWidth))) {
		$errors .= "please enter a number for the table's width<br />"."\n";
	}
	if (!(is_numeric($tableHeight))) {
		$errors .= "please enter a number for the table's height<br />"."\n";
	}
	if (!(is_numeric($tableCellPadding))) {
		$errors .= "please enter a number for the cell padding<br />"."\n";
	}
	if (!(is_numeric($tableCellSpacing))) {
		$errors .= "please enter a number for the cell spacing<br />"."\n";
	}
	if ($widthUnits == '%') {
		if ($tableWidth > 100) {
			$tableWidth = 100;
		} 
	} else if ($tableWidth > 1000) {
		// stop table width being too wide (if in pixels):
		$tableWidth = 1000;
	}
	if ($tableWidth < 1) {
			$tableWidth = 1;
	}
	if ($heightUnits == '%') {
		if ($tableHeight > 100) {
			$tableHeight = 100;
		}  
	}
	if ($tableHeight < 1) {
			$tableHeight = 1;
	}
	
	if ($tableCellPadding < 0) {
	$tableCellPadding = 0;
	}
	if ($tableCellSpacing < 0) {
	$tableCellSpacing = 0;
	}
	
	// remove # at start of border colour and background colour if there is one:
    if (substr($backgroundColour, 0, 1) == "#") {
      $backgroundColour = substr($backgroundColour, 1, (strlen($backgroundColour)-1));
    }
    
    if (substr($borderColour, 0, 1) == "#") {
      $borderColour = substr($borderColour, 1, (strlen($borderColour)-1));
    }
    
    if ($tableCellPadding < 0) {
    $tableCellPadding = 0;
    }
    if ($tableCellSpacing < 0) {
    $tableCellSpacing = 0;
    }
	

	if ($borderWidth > 0) {
		// if there is a border, then check it's a valid colour:
		if (!(validHexColour($borderColour))) {
		   $errors .= "please enter a valid Hex number for the table's border colour<br />"."\n";
		}
    }
    
    if (!(validHexColour($backgroundColour)) && $backgroundColour != "(none)") {
		$errors .= "please enter a valid Hex number for the table's background colour<br />"."\n";
	}
		
	if ($errors == "") {
		// write JS to send details:
		echo '<script type="text/javascript">'."\n";
		echo 'window.opener.insertNewTable(\''.$tableWidth.'\',\''.$widthUnits.'\',\''.$tableHeight.'\',\''.$heightUnits.'\',\''.$tableRows.'\',\''.$tableCols.'\',\''.$borderWidth.'\',\''.$borderColour.'\',\''.$backgroundColour.'\',\''.$tableCellPadding.'\',\''.$tableCellSpacing.'\');'."\n";
		echo 'self.close();'."\n";
		echo '</script>'."\n";
	} else {
		echo '<p class="Error">'.$errors.'</p>'."\n";
	}
}
?>

<form name="insertTableForm" id="insertTableForm" method="post" action="insertTable.php">

<?php
echo '<label for="tableWidth">table width: </label>'."\n";
echo '<input type="text" name="tableWidth" id="tableWidth" value="'.$tableWidth.'" onchange="drawPreview();" />'."\n"; 

echo '<label for="widthUnits" class="Hidden">table width units: </label>'."\n";
echo '<select name="widthUnits" id="widthUnits" onchange="drawPreview();">'."\n";
echo '<option value="px"';
if ($widthUnits == 'px') {
	echo ' selected="selected"';
}
echo '>pixels</option>'."\n";
echo '<option value="%"';
if ($widthUnits == '%') {
	echo ' selected="selected"';
}
echo '>percent</option>'."\n";
echo '</select>'."\n";
echo '<span class="JsHidden" id="tableWidthValid">not valid</span><br />'."\n";

echo '<label for="tableHeight">table height: </label>'."\n";
echo '<input type="text" name="tableHeight" id="tableHeight" value="'.$tableHeight.'" onchange="drawPreview();" />'."\n"; 
echo '<label for="heightUnits" class="Hidden">table height units: </label>'."\n";
echo '<select name="heightUnits" id="heightUnits" onchange="drawPreview();">'."\n";
echo '<option value="px"';
if ($heightUnits == 'px') {
	echo ' selected="selected"';
}
echo '>pixels</option>'."\n";
echo '<option value="%"';
if ($heightUnits == '%') {
	echo ' selected="selected"';
}
echo '>percent</option>'."\n";
echo '</select>'."\n";
echo '<span class="JsHidden" id="tableHeightValid">not valid</span><br />'."\n";
echo '<label for="tableRows">number of rows: </label>'."\n";
echo '<select name="tableRows" id="tableRows" onchange="drawPreview();">'."\n";
for ($i=1; $i<11; $i++) {
	echo '<option value="'.$i.'"';
	if ($tableRows == $i) {
		echo ' selected="selected"';
	}
	echo '>'.$i.'</option>'."\n";
}
echo '</select><br />'."\n";
echo '<label for="tableCols">number of columns: </label>'."\n";
echo '<select name="tableCols" id="tableCols" onchange="drawPreview();">'."\n";
for ($i=1; $i<11; $i++) {
	echo '<option value="'.$i.'"';
	if ($tableCols == $i) {
		echo ' selected="selected"';
	}
	echo '>'.$i.'</option>'."\n";
}
echo '</select><br />'."\n";

echo '<label for="tableCellPadding">cell padding: </label>'."\n";
echo '<input type="text" name="tableCellPadding" id="tableCellPadding" value="'.$tableCellPadding.'" onchange="drawPreview();" />'."\n"; 
echo '<span class="JsHidden" id="tablePaddingValid">not valid</span>'."\n";
echo '<br />'."\n";
echo '<label for="tableCellSpacing">cell spacing: </label>'."\n";
echo '<input type="text" name="tableCellSpacing" id="tableCellSpacing" value="'.$tableCellSpacing.'" onchange="drawPreview();" />'."\n"; 
echo '<span class="JsHidden" id="tableSpacingValid">not valid</span>'."\n";
echo '<br />'."\n";

echo '<label for="borderWidth">table\'s border thickness: </label>'."\n";
echo '<select name="borderWidth" id="borderWidth" onchange="drawPreview();">'."\n";
for ($i=0; $i<11; $i++) {
	echo '<option value="'.$i.'"';
	if ($borderWidth == $i) {
		echo ' selected="selected"';
	}
	echo '>'.$i.'</option>'."\n";
}
echo '</select><br />'."\n";
echo '<label for="borderColour">table\'s border colour: #</label>'."\n";
echo '<input type="text" name="borderColour" id="borderColour" value="'.$borderColour.'" onchange="drawPreview();" />'."\n"; 
echo '<a href="palette.php?picker=tablebordercolour" onclick="return openPopup(this.href,\'palette\',\'200\',\'280\');">open palette</a>'."\n";
echo '<span class="JsHidden" id="tableBorderColValid">not valid</span>'."\n";
echo '<br />'."\n";
echo '<label for="backgroundColour">table\'s background colour: #</label>'."\n";
echo '<input type="text" name="backgroundColour" id="backgroundColour" value="'.$backgroundColour.'" onchange="drawPreview();" />'."\n"; 
echo '<a href="palette.php?picker=tablebackgroundcolour" onclick="return openPopup(this.href,\'palette\',\'200\',\'280\');">open palette</a>'."\n";
echo '<span class="JsHidden" id="tableBGColValid">not valid</span>'."\n";
echo '<br />'."\n";
?>
<input type="submit" value="insert table" name="insertTableButton" id="insertTableButton" />
<button onclick="self.close(); return false;">cancel</button>
</form>



<hr />

<div id="PreviewWrapper">
sorry - the preview isn't available with your browser
</div>



</body>
</html>