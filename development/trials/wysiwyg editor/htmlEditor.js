function editorSetup() {
  if (getElement("wysiwygArea")) {
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
  showingSourceCode = false;
  
  // as JavaScript is running, set the textarea in the iframe to be visible in case iframes are disabled
  // (as they won't see the noscript textarea if JS is running)
  if (getElement("noIFrameTextArea")) {
    thiselement.style.display = "block";
  }
}

function doEditCommand(editName,editArgument) {
editableDocument.execCommand(editName, false, editArgument);
 focusContentWindow();
}

function focusContentWindow() {
  if (getElement("wysiwygArea")) {
    thiselement.contentWindow.focus();
  }
}

function showSource() {
if (showingSourceCode == false) {
  if (getInnerHTML()) {
      alert("["+thisSource+"]");
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
    alert("["+savedSource+"]");
  }
}

function setInnerText(setTextContent) { 



  if (getElement("wysiwygArea")) {
    if (thiselement.contentWindow.document.body.innerText) {
      // IE:
     
      thiselement.contentWindow.document.body.innerText = setTextContent; 
    } else if (thiselement.contentWindow.document.body.textContent) {
    
      // firefox etc:
      thiselement.contentWindow.document.body.textContent = setTextContent; 
    } 
  }
} 

function getInnerText() { 

  if (getElement("wysiwygArea")) {
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

function getInnerHTML() {
  if (getElement("wysiwygArea")) {
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

function setInnerHTML(setHTMLContent) {
  if (getElement("wysiwygArea")) {
 
    if (document.body.innerHTML) {
    // overcome bug in IE5 Mac - http://www.quirksmode.org/dom/w3c_html.html:
    thiselement.contentWindow.document.body.innerHTML.innerHTML = '';
    
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
    }
  }
} 