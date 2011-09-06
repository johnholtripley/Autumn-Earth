function editorSetup() {
  if (getElement("customWrapper")) {
    if (thiselement) {
      if (thiselement.contentDocument) {
        editableDocument = thiselement.contentDocument;
      } else if (thiselement.contentWindow.document) {
        // IE:
        editableDocument = thiselement.contentWindow.document;
      } else {
        alert("failed to assign editableDocument");
      }
      editableDocument.designMode="on";
    }
  }
  showingSourceCode = false;
  attributesNeedChanging = true;
}
//
function doEditCommand(editName,editArgument) {
	try {
		editableDocument.execCommand(editName, false, editArgument);
	} catch (err) {
		alert("Error! "+err);
		if (editName.substring(0,7) == "justify") {
			nodeStyleRequired = editName.substring(7,checkString.length);
			if (nodeStyleRequired == "full") {
				nodeStyleRequired = "justify";
			}
			// try and set at least the anchor node:
			setParentNodeStyle("text-align: "+nodeStyleRequired);
		}
	}
	focusContentWindow();
}
//
function insertImage(pathToImage) {
	editableDocument.execCommand('insertimage', false, pathToImage);
	focusContentWindow();
}
//
function focusContentWindow() {
  if (getElement("customWrapper")) {
    thiselement.contentWindow.focus();
  }
}
//
function saveSource() {
if (showingSourceCode == false) {
  if (getInnerHTML()) {
      document.saveContentForm.savedContent.value = thisSource;
      focusContentWindow();
   }
  } else {
    // need to convert back to not showing source
    if (getInnerText()) {
      thisInnerText = thisInnerText;
      setInnerHTML(thisInnerText);
      if (getInnerHTML()) {
        savedSource = thisSource;
      }
    }

    // then set it back:
    if (getInnerHTML()) {
      thisInnerHTML = thisSource;
      setInnerText(thisInnerHTML)
    }
    focusContentWindow();
    document.saveContentForm.savedContent.value = savedSource;
  }
  // now this has done, get javascript to submit the form:
  document.saveContentForm.submit();
}
//
function setInnerText(setTextContent) { 
  if (getElement("customWrapper")) {
    if (thiselement.contentWindow.document.body.innerText) {
      // IE:
     
      thiselement.contentWindow.document.body.innerText = setTextContent; 
    } else if (thiselement.contentWindow.document.body.textContent) {
    
      // firefox etc:
      thiselement.contentWindow.document.body.textContent = setTextContent; 
    } 
  }
} 
//
function getInnerText() { 
  if (getElement("customWrapper")) {
    if (thiselement.contentWindow.document.body.innerText) {
      // IE:
      thisInnerText = thiselement.contentWindow.document.body.innerText; 
      return true;
    } else if (thiselement.contentWindow.document.body.textContent) {
      // firefox etc:
      thisInnerText = thiselement.contentWindow.document.body.textContent; 
      return true;
    } else {
      return false;
    } 
  }
} 
//
function getInnerHTML() {
  if (getElement("customWrapper")) {
    if (document.body.innerHTML) {
      thisSource = thiselement.contentWindow.document.body.innerHTML;
      return true;
    } else {
      thisSource = "innerhtml not supported";
      alert("innerhtml not supported");
      // http://slayeroffice.com/articles/innerHTML_alternatives/
      return false;
    }
  } 
}
//
function setInnerHTML(setHTMLContent) {
  if (getElement("customWrapper")) {
 
    if (document.body.innerHTML) {
    // overcome bug in IE5 Mac - http://www.quirksmode.org/dom/w3c_html.html:
    thiselement.contentWindow.document.body.innerHTML = '';
    
      thiselement.contentWindow.document.body.innerHTML = setHTMLContent;
      return true;
    } else {
      thisSource = "innerhtml not supported";
      alert("innerhtml not supported");
      // http://slayeroffice.com/articles/innerHTML_alternatives/
      return false;
    }
  } 
}
//
function toggleSourceCode() {
  if (showingSourceCode == false) {
    if (getInnerHTML()) {
      thisInnerHTML = thisSource;
      setInnerText(thisInnerHTML)
      focusContentWindow();
      showingSourceCode = true;
      // show html message:
      if (getElement("SourceMode")) {
        thiselement.style.display = "block";
      }
      // change iframe to basic display:
      if (getElement("customWrapper")) {
		thiselement.contentWindow.document.body.style.fontFamily = "'courier new', courier, monospace";
		thiselement.contentWindow.document.body.style.background = "#fff";
		thiselement.contentWindow.document.body.style.color = "#000";
      }
    }
  } else {
    if (getInnerText()) {
    thisInnerText = thisInnerText;
    setInnerHTML(thisInnerText);
    focusContentWindow();
    showingSourceCode = false; 
     // hide html message:
      if (getElement("SourceMode")) {
        thiselement.style.display = "none";
      }
      // change iframe to styled display:
      if (getElement("customWrapper")) {
		thiselement.contentWindow.document.body.style.fontFamily = window.document.saveContentForm.fontSelector.value;
		thiselement.contentWindow.document.body.style.background = "#"+window.document.saveContentForm.wrapperbackgroundColour.value;
		thiselement.contentWindow.document.body.style.color = "#"+window.document.saveContentForm.wrappertextColour.value;
      }
    }
  }
} 
function setNewFont() {
	// called when the font family selection is changed - need to update the CSS of the iframe:
	if (getElement("customWrapper")) {
		  thiselement.contentWindow.document.body.style.fontFamily = window.document.saveContentForm.fontSelector.value;
	}
}
//
function updateColours() {
  // called when palette is closed - need to update the body CSS on the iframe
  
  // validate values first:
	thisNewTextColour = window.document.saveContentForm.wrappertextColour.value;
	thisNewBGColour = window.document.saveContentForm.wrapperbackgroundColour.value;
	// remove '#' if there is one:
	if (thisNewTextColour.substring(0,1) == "#") {
    thisNewTextColour = thisNewTextColour.substring(1,thisNewTextColour.length);
    window.document.saveContentForm.wrappertextColour.value = thisNewTextColour;
	}
	if (thisNewBGColour.substring(0,1) == "#") {
    thisNewBGColour = thisNewBGColour.substring(1,thisNewBGColour.length);
    window.document.saveContentForm.wrapperbackgroundColour.value = thisNewBGColour;
	}
	
	if (isValidHex(thisNewTextColour)) {
		if (getElement("customWrapper")) {
		  thiselement.contentWindow.document.body.style.color = "#"+thisNewTextColour;
		}
		if (getElement("textColourValid")) {
		  thiselement.style.display = "none";
		}
	} else {
		// show message saying it isn't valid:
		if (getElement("textColourValid")) {
		  thiselement.style.display = "inline";
		}
	}
	if (isValidHex(thisNewBGColour)) {
		if (getElement("customWrapper")) {
		  thiselement.contentWindow.document.body.style.background = "#"+thisNewBGColour;
		}
		if (getElement("backgroundColourValid")) {
		  thiselement.style.display = "none";
		}
	} else {
		// show message saying it isn't valid:
		if (getElement("backgroundColourValid")) {
		  thiselement.style.display = "inline";
		}
	}
}
//
function isValidHex(valueToCheck) {
	regexHex = /^([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?$/;
	return regexHex.test(valueToCheck);
}
//
function startFade() {
	startFadeTimeOut = setTimeout("fadetext();",3000);
}

function fadetext() { 
	// fades from black to white
	if(colourValue<255) {
		colourValue+=11;
		if (getElement("textToFade")) {
			if (thiselement) {
				thiselement.style.color = "rgb("+colourValue+","+colourValue+","+colourValue+")";
			}
		}
		fadeTimeOut = setTimeout("fadetext();",60); 
	} else {
		// hide element:
		if (getElement("textToFade")) {
			if (thiselement) {
				thiselement.style.display = "none";
			}
		}
		
	}
}
//
function doBlockFormatting(thisCommand) {
  if (thisCommand != "null") {
    doEditCommand('formatBlock','<'+thisCommand+'>');
  }
}
//
function wrapHTMLTags(htmlTag, htmlAttributes) {
	// make sure the user's not in source code mode:
	if (showingSourceCode == false) {
		if (getElement("customWrapper")) {
			
			if (thiselement.contentWindow.getSelection) {
				userSelection = thiselement.contentWindow.getSelection();
				thisRange = getRangeObject(userSelection);
				// check the range isn't empty:
				if (!(thisRange.collapsed)) {
					// create html element to wrap around range:
					var newNode = document.createElement(htmlTag);
					if (htmlAttributes != "") {
						newNode.setAttribute("style", htmlAttributes);
					}
					thisRange.surroundContents(newNode);
					thisRange.collapse(true);
				}
			} else if (thiselement.contentWindow.document.selection) {
				// IE
				thisRange = thiselement.contentWindow.document.selection.createRange();
				if (htmlAttributes == "") {
          thisRange.pasteHTML('<'+htmlTag+'>'+thisRange.text+'</'+htmlTag+'>');
        } else {
          thisRange.pasteHTML('<'+htmlTag+' style="'+htmlAttributes+';"'+'>'+thisRange.text+'</'+htmlTag+'>');
        }
			}
		}
		focusContentWindow();
	}
}
//
function getRangeObject(selectionObject) {
	if (selectionObject.getRangeAt) {
		return selectionObject.getRangeAt(0);
	} else { 
	// Safari:
		var range = document.createRange();
		range.setStart(selectionObject.anchorNode,selectionObject.anchorOffset);
		range.setEnd(selectionObject.focusNode,selectionObject.focusOffset);
		return range;
	}
}
//
function insertHTMLElement(stringToAdd) {
	// make sure the user's not in source code mode:
	if (showingSourceCode == false) {
		if (getElement("customWrapper")) {
			if (thiselement.contentWindow.getSelection) {
				userSelection = thiselement.contentWindow.getSelection();
				thisRange = getRangeObject(userSelection);
				// clear range contents:
				thisRange.deleteContents();
				newContent = document.createTextNode("&"+stringToAdd);
				thisRange.insertNode(newContent);
				thisRange.collapse(true);
			} else if (thiselement.contentWindow.document.selection) {
				// IE
				thisRange = thiselement.contentWindow.document.selection.createRange();
				thisRange.pasteHTML('&'+stringToAdd);
			}
		}
	}
	focusContentWindow();
}
//
function setParentNodeStyle(stringToAdd) {
	// primarily used for setting 'align' style to selected blocks of text
	// if the execCommand throws an exception
	//
	// make sure the user's not in source code mode:
	if (showingSourceCode == false) {
		if (getElement("customWrapper")) {
			if (thiselement.contentWindow.getSelection) {
				userSelection = thiselement.contentWindow.getSelection();
				// set the attribute for the anchor node:
					userSelection.anchorNode.parentNode.setAttribute("style",stringToAdd);
					// (anchorNode is the selected text, its parentNode is the surrounding tag)
			
				
			
				
		} else if (thiselement.contentWindow.document.selection) {
			// IE
			// ###############
			
		}
			
	}
	}
	focusContentWindow();
}
//
function insertNewTable(tableWidth,widthUnits,tableHeight,heightUnits,tableRows,tableCols,borderSize,borderColour,backgroundColour,tablePadding,tableSpacing) {
	if (showingSourceCode == false) {
		if (getElement("customWrapper")) {
			if (thiselement.contentWindow.getSelection) {
				userSelection = thiselement.contentWindow.getSelection();
				thisRange = getRangeObject(userSelection);
			} else if (thiselement.contentWindow.document.selection) {
				// IE
				thisRange = thiselement.contentWindow.document.selection.createRange();
			}
			// clear range contents:
			thisRange.deleteContents();
			newContent = document.createElement("table");
			styleAttributes = "width: "+tableWidth+widthUnits+";height: "+tableHeight+heightUnits+";";
			if (borderSize>0) {
				styleAttributes += "border: "+borderSize+"px solid #"+borderColour+";";
			}
			if (backgroundColour != "(none)") {
				styleAttributes += "background-color: #"+backgroundColour+";";
			}
			newContent.setAttribute("style",styleAttributes);
			newContent.setAttribute("cellpadding",tablePadding);
			newContent.setAttribute("cellspacing",tableSpacing);
			for (var thisRow = 1; thisRow<=tableRows; thisRow++) {
				var newRow = document.createElement("tr");
				for (var thisCol = 1; thisCol<=tableCols; thisCol++) {
					var newCell = document.createElement("td");
					newRow.appendChild(newCell);
				}
				newContent.appendChild(newRow);
			}
			
			thisRange.insertNode(newContent);
			thisRange.collapse(true);
		}
	}
	focusContentWindow();
}
//
function checkAttributes() {
	if (attributesNeedChanging == true) {
		// if IE, then need to convert all styled aligns to attribute aligns so that user can change them if need be
		// (php will convert them back when page is saved)
		if (document.selection) {
			// IE
			if (getInnerHTML()) {
				thisSource = thisSource.replace(/style="text-align: center"/gi,"align=center");
				thisSource = thisSource.replace(/style="text-align: justify"/gi,"align=justify");
				thisSource = thisSource.replace(/style="text-align: right"/gi,"align=right");
				thisSource = thisSource.replace(/style="text-align: left"/gi,"align=left");
				setInnerHTML(thisSource);
				attributesNeedChanging = false;
			} 
		} else {
			// non IE
			attributesNeedChanging = false;
		}
	}
}