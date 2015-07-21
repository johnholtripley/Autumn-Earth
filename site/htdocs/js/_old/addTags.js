function AddTags(tagStart,tagEnd) {
	// thanks to http://www.alexking.org/blog/2004/06/03/js-quicktags-under-lgpl/ for the Opera support
	var textblock = window.document.postform.postcontents;
	//	
	// IE
	if (window.document.selection && browsersafe) {
		textblock.focus();
		sel = window.document.selection.createRange();
		if (promptopen !="false") {
			// retrieve saved selection before the prompt was opened (and if any text was selected)
			if (savedselection.text.length > 0) {
				savedselection
				if (savedselection.text.length > 0) {
					savedselection.text = tagStart + savedselection.text + tagEnd;
				} else if (tagStart.indexOf("[link") != -1) {
					// if it's a link and no text selected, add the URL in:
					savedselection.text = tagStart + URLentered + tagEnd;
				} else {
					savedselection.text = tagStart+tagEnd;
				}
			} else {
				if (tagStart.indexOf("[link") != -1) {
					textblock.value += tagStart+URLentered+tagEnd;
				} else {
					textblock.value += tagStart+tagEnd;
				}
				textblock.focus();
			}
		} else {
			if (sel.text.length > 0) {
				sel.text = tagStart + sel.text + tagEnd;
			} else if (tagStart.indexOf("[link") != -1) {
				// if it's a link and no text selected, add the URL in:
				sel.text = tagStart + URLentered + tagEnd;
			} else {
				sel.text = tagStart+tagEnd;
			}
		}
	textblock.focus();
	} else if (textblock.selectionStart || textblock.selectionStart == '0') {
		// firefox / netscape
		var startPos = textblock.selectionStart;
		var endPos = textblock.selectionEnd;
		var cursorPos = endPos;
		var scrollTop = textblock.scrollTop;
		if (startPos != endPos) {
			textblock.value = textblock.value.substring(0, startPos) + tagStart + textblock.value.substring(startPos, endPos) + tagEnd + textblock.value.substring(endPos, textblock.value.length);
			cursorPos += tagStart.length + tagEnd.length;
		} else {
			// if it's a link tag, and nothing was highlighted, then insert the link inbetween the tags
			if (tagStart.indexOf("[link") != -1) {
				textblock.value = textblock.value.substring(0, startPos) + tagStart + URLentered + tagEnd + textblock.value.substring(endPos, textblock.value.length);
				cursorPos = startPos + tagStart.length + URLentered.length + tagEnd.length;
			} else {
				textblock.value = textblock.value.substring(0, startPos) + tagStart + tagEnd + textblock.value.substring(endPos, textblock.value.length);
				cursorPos = startPos + tagStart.length;
			}
		}
		textblock.focus();
		textblock.selectionStart = cursorPos;
		textblock.selectionEnd = cursorPos;
		textblock.scrollTop = scrollTop;
	} else {
		// if it's a link tag, and nothing was highlighted, then insert the link inbetween the tags
		if (tagStart.indexOf("[link") != -1) {
			textblock.value += tagStart+URLentered+tagEnd;
		} else {
			textblock.value += tagStart+tagEnd;
		}
		textblock.focus();
	}
}
//
function init() {
	promptwindowboxwidth = 200;
	promptwindowboxheight = 120;
	screenwidth = 1024;
	screenheight = 768;
	// override default screen size if they can be determined:
	if (screen.width) {
		screenwidth = screen.width;
		screenheight = screen.height;
	}
	
	if (window.innerWidth) {
		screenwidth = window.innerWidth;
		screenheight = window.innerHeight;
	}
	//
	promptopen = "false";
	//
	browsersafe = true;
	// try and catch IE 4 as this adds the tags to the link instead of the text
	if (window.document.all) {
		var detect = navigator.userAgent.toLowerCase();
		versionplacement = detect.indexOf('msie');
		if (versionplacement != -1) {
			if (detect.substr(versionplacement+5, 1) == "4") {
			browsersafe = false;
			}
		}
	}
	//
	preloads('/assets/tooltips/ttip_topbig.gif','/assets/tooltips/ttip_bottom.gif');
	//
	if (getElement('recipient')) {
		if (thiselement) {
			thiselement.focus();
		} else if (getElement('threadtitle')) {
			if (thiselement) {
				thiselement.focus();
			} else if (getElement('postcontents')) {
				if (thiselement) {
					thiselement.focus();
				}
			}
		}
	}
}
//
function closeURLPrompt(promptaction) {
	if (getElement("PromptWrapper")) {
		thiselement.style.display = "none";
	}
	if (promptaction != "cancel") {
		URLentered = window.document.postform.userinput.value;
			// add and http:// if needed:
		URLentered = URLentered.toLowerCase();
	if (URLentered.substring(0,3) == "www") {
	URLentered = "http://"+URLentered;
	}
		AddTags("[link="+URLentered+"]","[/link]");
		
	}
	promptopen = "false";
}
//
function AddURL() {
URLentered = "";
// check for catch older browsers - opera <=6, ie 4 and NS4
if (document.createTextNode) {
		// make a copy of the current selection for IE
		if (window.document.selection && browsersafe) {
			savedselection = document.selection.createRange().duplicate();
		}
		window.document.postform.userinput.value = "";
		var posTop = (screenheight-promptwindowboxheight)/2-100;
		var posLeft = (screenwidth-promptwindowboxwidth)/2;
		//
		if (getElement("PromptWrapper")) {
			thiselement.style.top = posTop+"px";
			thiselement.style.left = posLeft+"px";
			thiselement.style.display = "block";
		}
		// focus text field:
		window.document.postform.userinput.focus();
		// catch for Opera 7
		if (window.document.getElementById) {
			window.document.getElementById('userinput').focus();
		}
		promptopen = "link";
	} else {
	// is older browser
	URLentered = prompt("Please enter the link address","");
	// add and http:// if needed:
		URLentered = URLentered.toLowerCase();
	if (URLentered.substring(0,3) == "www") {
	URLentered = "http://"+URLentered;
	}
	AddTags("[link="+URLentered+"]","[/link]");
	}
}
//
function closeImgPrompt(promptaction) {
	if (getElement("PromptImgWrapper")) {
		thiselement.style.display = "none";
	}
	if (promptaction != "cancel") {
		URLentered = window.document.postform.imguserinput.value;
		URLentered = URLentered.toLowerCase();
	if (URLentered.substring(0,3) == "www") {
	URLentered = "http://"+URLentered;
	}
		AddTags("[image="+URLentered+"]","");
		
	}
	promptopen = "false";
}
//
//
function AddImage() {
URLentered = "";
// check for catch older browsers - opera <=6, ie 4 and NS4
if (document.createTextNode) {
		// make a copy of the current selection for IE
		if (window.document.selection && browsersafe) {
			savedselection = document.selection.createRange().duplicate();
		}
		window.document.postform.imguserinput.value = "";
		var posTop = (screenheight-promptwindowboxheight)/2-100;
		var posLeft = (screenwidth-promptwindowboxwidth)/2;
		//
		if (getElement("PromptImgWrapper")) {
			thiselement.style.top = posTop+"px";
			thiselement.style.left = posLeft+"px";
			thiselement.style.display = "block";
		}
		// focus text field:
		window.document.postform.imguserinput.focus();
		// catch for Opera 7
		if (window.document.getElementById) {
			window.document.getElementById('imguserinput').focus();
		}
		promptopen = "image";
	} else {
	// is older browser
	URLentered = prompt("Please enter the link address","");
	URLentered = URLentered.toLowerCase();
	if (URLentered.substring(0,3) == "www") {
	URLentered = "http://"+URLentered;
	}
		AddTags("[image="+URLentered+"]","");
		
	}
}
//


function checkpromptclosed() {
	if (promptopen != "false") {
	
	
	if (promptopen == "image") {
			// grab the textarea contents
			var textboxcontents = window.document.postform.postcontents.value;
			// grab the prompt box contents
			URLentered = window.document.postform.imguserinput.value;
			// apply usual formatting:
			URLentered = URLentered.toLowerCase();
			if (URLentered.substring(0,3) == "www") {
				URLentered = "http://"+URLentered;
			}
			AddTags("[image="+URLentered+"]","");
			
				if (getElement("PromptImgWrapper")) {
		thiselement.style.display = "none";
	}
			
			
		}
		if (promptopen == "link") {
			// grab the textarea contents
			var textboxcontents = window.document.postform.postcontents.value;
			// grab the prompt box contents
			URLentered = window.document.postform.userinput.value;
			// apply usual formatting:
			URLentered = URLentered.toLowerCase();
			if (URLentered.substring(0,3) == "www") {
				URLentered = "http://"+URLentered;
			}
			AddTags("[link="+URLentered+"]","[/link]");
			
				if (getElement("PromptWrapper")) {
		thiselement.style.display = "none";
	}
			
		}
	
	promptopen = "false";
	
		return false;
	} else {
		return true;
	}
}
//

function moneyAttached() {
	// used in sendmail to check if money has been attached and remove any attached items
	
	var thisgold = window.document.postform.attachgold.value;
	var thissilver = window.document.postform.attachsilver.value;
	if (thisgold=="") {
	thisgold = 0;
	}
		if (thissilver=="") {
	thissilver = 0;
	}
	
	totalamountofmoney = parseInt(thisgold*100) + parseInt(thissilver);

	
		
		// check if they have this amount:
		if (totalamountofmoney>moneyavailable) {
			if (getElement('ErrorMessage')) {
				if (thiselement) {
				thiselement.style.display = 'block';
				}
			} else { 
				alert('You don\'t have that much money - your full amount has been entered');
			}
			// correct amount being added:
				availablesilver = moneyavailable%100;
				availablegold = (moneyavailable-availablesilver)/100;
			window.document.postform.attachgold.value = availablegold;
			window.document.postform.attachsilver.value = availablesilver;
			
		} else {
		// hide error message
		if (getElement('ErrorMessage')) {
				if (thiselement) {
				thiselement.style.display = 'none';
				}
			}
		}
		
		
		if (totalamountofmoney>99) {
			// display gold inventory item in the attached-item box
			whichIcon = 28;
		} else if (totalamountofmoney>0) {
			// display silver
			whichIcon = 27;
		} else {
		whichIcon = 0;
		// correct display (user may have entered text)
		window.document.postform.attachgold.value = 0;
		window.document.postform.attachsilver.value = 0;
		}
		
		
		
		
		// check for any currently attached items:
			if (savedslotnumber != -1) {
		if (getElement('attachedslot')) {
			if (thiselement.style.background != 'url(/assets/inventory/0.jpg)') {
				// there is already an attached item, so restore this:
				
				eval('window.document.invgraphic'+savedslotnumber).src = '/assets/inventory/quantity'+quantityavailable+'.gif';
				if (getElement('invslot'+savedslotnumber)) {
					thiselement.style.background = "url(/assets/inventory/"+saveditemtype+".jpg)";
				}
				// clear attach slot graphics:
				window.document.attachedimage.src = '/assets/inventory/quantity0.gif';
				if (getElement('attachedslot')) {
					thiselement.style.background = "url(/assets/inventory/0.jpg)";
				}
			}
		}
	}
		
		
		
		
		window.document.postform.invQuantity.value = totalamountofmoney;
			window.document.postform.invSlotClicked.value = -1;
			window.document.postform.invItemType.value = whichIcon;
			// update attach slot graphic - it should be the same as the one just clicked
			if (getElement('attachedslot')) {
				if (thiselement) {
				
				thiselement.style.background = "url(/assets/inventory/"+whichIcon+".jpg)";
				}
			}	
			window.document.attachedimage.src = '/assets/inventory/quantity0.gif';
			
				// show 'remove' link
				if (getElement('removeAttach')) {
					if (thiselement) {
						if (totalamountofmoney>0) {
							thiselement.style.display = 'block';
							} else {
							thiselement.style.display = 'none';
							}
					}
				}
			
		
		
		// set this as the attached icon is not from the inventory
		savedslotnumber = -1;
		
		
		
		
		
		
	
}
