function getElement(elementName) {
// thanks to http://www.netlobo.com/div_hiding.html
if (window.document.getElementById) {
	// this is the way the standards work
	thiselement = window.document.getElementById(elementName);
	return true;
	} else if (window.document.all) {
	// this is the way old msie versions work
	thiselement = window.document.all[elementName];
	return true;
	} else if (window.document.layers) {
	// this is the way nn4 works
	thiselement = window.document.layers[elementName];
	return true;
	}
	return false;
}
//
function selectall(thisformname,subbuttonname) {
	// runs through all checkboxes in a form and check them all:
	var thisform = eval('window.document.'+thisformname);
	for (i = 0; i < thisform.length; i++) {
		if (thisform[i].value != subbuttonname) {
			// ignore the submit button
			thisform[i].checked = true;
		}
	}
}
//
function unselectall(thisformname,subbuttonname) {
	// runs through all checkboxes in a form and unchecks them all:
	var thisform = eval('window.document.'+thisformname);
	for (i = 0; i < thisform.length; i++) {
		if (thisform[i].value != subbuttonname) {
			thisform[i].checked = false;
		}
	}
}
//
function getmouseposition(e) {
	var offsetx = 12;										  
	var offsety =  8;
	var iebody = document.body;
	if (document.documentElement) {
		if (document.documentElement.scrollTop) {
			iebody = document.documentElement;
		}
	}
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX + iebody.scrollLeft;
		posy = e.clientY + iebody.scrollTop;
	}
	// thanks to http://www.quirksmode.org/js/events_properties.html
	if (getElement(currenttooltip)) {
		thiselement.style.left = posx+offsetx + 'px';
		thiselement.style.top = posy+offsety + 'px';
	}
}
//
function tooltip(tipdiv) {
	if (getElement(tipdiv)) {
		document.onmousemove = getmouseposition;
		thiselement.style.display = 'block';
		currenttooltip = tipdiv;
	}
}
//
function dyntooltip(tipdiv,texttoshow) {
	if (document.body.innerHTML) {
		if (getElement('ttipdyn')) {
			thiselement.innerHTML = '<p>'+texttoshow+'</p>';
		}
	}
	//
	if (getElement(tipdiv)) {
		document.onmousemove = getmouseposition;
		thiselement.style.display = 'block';
		currenttooltip = tipdiv;
	}
}
//
function exit(tipdiv) {
	if (getElement(tipdiv)) {
		thiselement.style.display = 'none';
		// remove event
		document.onmousemove = null;
	}
}
//
function preloads() {
	var arImages=new Array();
	var temp = preloads.arguments; 
	for(i=0; i < temp.length; i++) {
		arImages[i]=new Image();
		arImages[i].src=preloads.arguments[i];
	}
}
//
function attachItem(slotNumber,NumberAvailable,ItemType) {
	// check if there is already an attached item:
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
	//
	// clear any money added:
	window.document.postform.attachgold.value = 0;
	window.document.postform.attachsilver.value = 0;
	//
	quantityavailable = NumberAvailable;
	savedslotnumber = slotNumber;
	saveditemtype = ItemType;
	//
	if (quantityavailable>1) {
		// display quantity available in prompt:
		if (document.body.innerHTML) {
			if (getElement('DynQuanText')) {
				thiselement.innerHTML = '<label for="quanuserinput">Quantity? (0-'+quantityavailable+')</label>';
			}
		}
		quantityentered = "";
		// check for catch older browsers - opera <=6, ie 4 and NS4
		if (document.createTextNode) {
			window.document.postform.quanuserinput.value = "";
			var posTop = (screenheight-promptwindowboxheight)/2-100;
			var posLeft = (screenwidth-promptwindowboxwidth)/2;
			//
			if (getElement("QuantityPromptWrapper")) {
				thiselement.style.top = posTop+"px";
				thiselement.style.left = posLeft+"px";
				thiselement.style.display = "block";
			}
			// focus text field:
			window.document.postform.quanuserinput.focus();
			// catch for Opera 7
			if (window.document.getElementById) {
				window.document.getElementById('quanuserinput').focus();
			}
			promptopen = "quantity";
		} else {
			// is older browser
			// update attach slot graphic - it should be the same as the one just clicked
			if (getElement('attachedslot')) {
				var targetelement = thiselement;
				if (getElement('invslot'+savedslotnumber)) {
					targetelement.style.background = thiselement.style.background;
				}
			}
			quantityentered = prompt("Quantity? (0-"+quantityavailable+")","");
			if (quantityentered>quantityavailable) {
				quantityentered=quantityavailable;
			}
			if (quantityentered<=0) {
				quantityentered = 0;
			}
			if (quantityentered != 0) {		
				// update attach slot graphic:
				window.document.attachedimage.src = '/assets/inventory/quantity'+quantityentered+'.gif';
				// update inventory display:
				if (quantityentered == quantityavailable) {
					// need to black out the inventory panel graphic
					eval('window.document.invgraphic'+savedslotnumber).src = '/assets/inventory/quantity0.gif';
					if (getElement('invslot'+savedslotnumber)) {
						thiselement.style.background = 'url('+saveditemtype+'b.jpg)';
					}
				} else {
					// just update number:
					eval('window.document.invgraphic'+savedslotnumber).src = '/assets/inventory/quantity'+(quantityavailable-quantityentered)+'.gif';
				}
				// show 'remove' link
				if (getElement('removeAttach')) {
					if (thiselement) {
						thiselement.style.display = 'block';
					}
				}
			} else {
				savedslotnumber = -1;
			}
			window.document.postform.invSlotClicked.value = savedslotnumber;
			window.document.postform.invItemType.value = saveditemtype;
		}
	} else {
		// update attach slot graphic - it should be the same as the one just clicked
		if (getElement('attachedslot')) {
			var targetelement = thiselement;
			if (getElement('invslot'+savedslotnumber)) {
				targetelement.style.background = thiselement.style.background;
			}
		}
		quantityentered = 1;
		window.document.postform.invQuantity.value = 1;
		// need to black out the inventory panel graphic
		eval('window.document.invgraphic'+savedslotnumber).src = '/assets/inventory/quantity0.gif';
		if (getElement('invslot'+savedslotnumber)) {
			thiselement.style.background = "url(/assets/inventory/"+saveditemtype+"b.jpg)";
		}
		// show 'remove' link
		if (getElement('removeAttach')) {
			if (thiselement) {
				thiselement.style.display = 'block';
			}
		}
		window.document.postform.invSlotClicked.value = savedslotnumber;
		window.document.postform.invItemType.value = saveditemtype;
	}
}
//
function closeQuanPrompt(promptaction) {
	if (getElement("QuantityPromptWrapper")) {
		thiselement.style.display = "none";
	}
	if (promptaction != "cancel") {
		quantityentered = window.document.postform.quanuserinput.value;
		if (quantityentered>quantityavailable) {
			quantityentered=quantityavailable;
		}
		if (quantityentered<=0) {
			quantityentered = 0;
		}
		if (quantityentered != 0) {
			window.document.postform.invQuantity.value = quantityentered;
			window.document.postform.invSlotClicked.value = savedslotnumber;
			window.document.postform.invItemType.value = saveditemtype;
			// update attach slot graphic - it should be the same as the one just clicked
			if (getElement('attachedslot')) {
				var targetelement = thiselement;
				if (getElement('invslot'+savedslotnumber)) {
					targetelement.style.background = thiselement.style.background;
				}
			}	
			// update attach slot graphic:
			window.document.attachedimage.src = '/assets/inventory/quantity'+quantityentered+'.gif';
			// update inventory display:
			if (quantityentered == quantityavailable) {
				// need to black out the inventory panel graphic
				eval('window.document.invgraphic'+savedslotnumber).src = '/assets/inventory/quantity0.gif';
				if (getElement('invslot'+savedslotnumber)) {
					thiselement.style.background = "url(/assets/inventory/"+saveditemtype+"b.jpg)";
				}
			} else {
				// just update number:
				eval('window.document.invgraphic'+savedslotnumber).src = '/assets/inventory/quantity'+(quantityavailable-quantityentered)+'.gif';
			}
			// show 'remove' link
			if (getElement('removeAttach')) {
				if (thiselement) {
					thiselement.style.display = 'block';
				}
			}
		} else {
			savedslotnumber = -1;
		}
	}
promptopen = "false";
}
//
function removeItem() {
	// remove item from attachment slot and add it back to the inventory panel
	//
	// check that there is an attached item:
	if (getElement('attachedslot')) {
		if (thiselement.style.background != 'url(/assets/inventory/0.jpg)') {
			
			if (savedslotnumber != -1) {
				// restore inventory panel graphics (otherwise it was money attached):
				eval('window.document.invgraphic'+savedslotnumber).src = '/assets/inventory/quantity'+quantityavailable+'.gif';
				if (getElement('invslot'+savedslotnumber)) {
					thiselement.style.background = "url(/assets/inventory/"+saveditemtype+".jpg)";
				}
			}
			
			// clear attach slot graphics:
			window.document.attachedimage.src = '/assets/inventory/quantity0.gif';
			if (getElement('attachedslot')) {
				thiselement.style.background = "url(/assets/inventory/0.jpg)";
			}
			
			// clear form values:
			window.document.postform.invSlotClicked.value = 'notset';
			window.document.postform.invQuantity.value = '0';
			window.document.postform.invItemType.value = '0';
			window.document.postform.attachgold.value = 0;
			window.document.postform.attachsilver.value = 0;
			// hide 'remove' link
			if (getElement('removeAttach')) {
				if (thiselement) {
					thiselement.style.display = 'none';
				}
			}
		}
	}
}
//
function charchange() {
	// called on the send mail page when a new character is selected,
	// so that the inventory can be updated to show that character's items
	//
	window.document.postform.refreshInv.value = 'true';
	// submit the form to refresh the page:
	window.document.postform.submit();
}
//
function addItem() {
	// called on the view mail page to cause the page to refresh and the item be added:
	window.document.attachmentForm.jssubmit.value = 'true';
	// the above value is set so that the php knows that this is a refreshed page and post values should be taken
	window.document.attachmentForm.submit();
}
//
function IEflash(Fwidth, Fheight, Fpath, Faltimage, Falttext, Fobjectname) {
	// write flash to avoid IE activex warning
	document.write("<object type=\"application/x-shockwave-flash\" data=\""+Fpath+"\" width=\""+Fwidth+"\" height=\""+Fheight+"\" name=\""+Fobjectname+"\"id=\""+Fobjectname+"\">");
	document.write("<param name=\"movie\" value=\""+Fpath+"\" />");
	document.write("<img src=\""+Faltimage+"\" width=\""+Fwidth+"\" height=\""+Fheight+"\" alt=\""+Falttext+"\" />");
	document.write("</object>");
}
//
function focusMailClient() {
	/* only works in IE */
	if (getElement('MailClient')) {
					if (thiselement) {
						thiselement.focus();
					}
				}
	}
//
function hideHelp() {
	// hide the context senstive help boxes on the create account page:
	elemHide('Help1');
}
//
function elemShow(elementName) {
	// show an element
	if (getElement(elementName)) {
		thiselement.style.display = "block";
	}
}
//
function elemHide(elementName) {
	// hide an element
	if (getElement(elementName)) {
		thiselement.style.display = "none";
	}
}
//
function openPopup(popupLocation, popupName, popupWidth, popupHeight) {
  // set defaults if they can't be read
  var screenWidth = 760;
  var screenHeight = 420;
  if (self.screen.width) {
    screenWidth = self.screen.width;
    screenHeight = self.screen.height;
    //alert(screenWidth+", "+screenHeight);
  }
  var popupTop = (screenHeight-popupHeight)/2;
  var popupLeft = (screenWidth-popupWidth)/2;
  popupName=window.open(popupLocation,popupName,'height='+popupHeight+',width='+popupWidth+',left='+popupLeft+',top='+popupTop+',resizable=0');
  if (window.focus) {
    popupName.focus();
  }
  return false;
}
//
function clearDefaults(whichField,defaultValue) {
  // clear default text when field is focused:
  if (whichField.value == defaultValue) {
    whichField.value = "";
  }
}
//
function scrollPageInit() {
	// initialise variable that will hold the Interval
	scrollInterval = null;
}
//
function scrollWindow(scrollAmount,dest,anchor) {
	oldcurrentYPos = getCurrentYPos();
	isAbove = (oldcurrentYPos < dest);
	window.scrollTo(0,oldcurrentYPos + scrollAmount);
	newCurrentYPos = getCurrentYPos();
	isAboveNow = (newCurrentYPos < dest);
	if ((isAbove != isAboveNow) || (oldcurrentYPos == newCurrentYPos)) {
		// if scrolled past the destination, or not moved since last scroll
		// (ie at bottom of page) then scroll exactly to link:
		window.scrollTo(0,dest);
		clearInterval(scrollInterval);
		// jump to link directly so that the URL is correct too:
		location.hash = anchor;
	}
}
function getCurrentYPos() {
	if (document.body && document.body.scrollTop) {
		return document.body.scrollTop;
	}
	if (document.documentElement && document.documentElement.scrollTop) {
		return document.documentElement.scrollTop
	}
	if (window.pageYOffset) {
		return window.pageYOffset
	}
	return 0;
}
//
function scrollPageLinks(anchorClicked,idToJumpTo) {
	// smoothly scroll between anchors on the same page
	// thanks to http://www.sitepoint.com/article/scroll-smoothly-javascript
	if (getElement(idToJumpTo)) {
		// find the destination's position:
		var desty = thiselement.offsetTop;
		var thisNode = thiselement;
		// support for IE5:
		while ((thisNode.offsetParent) && (thisNode.offsetParent != document.body)) {
			thisNode = thisNode.offsetParent;
			desty += thisNode.offsetTop;
		}
		clearInterval(scrollInterval);
		currentYPos = getCurrentYPos();
		stepSize = parseInt((desty-currentYPos)/25);
		scrollInterval = setInterval('scrollWindow('+stepSize+','+desty+',"'+idToJumpTo+'")',10);
		return false;
	} else {
		// won't work - let the browser jump as usual:
		return true;
	}
}