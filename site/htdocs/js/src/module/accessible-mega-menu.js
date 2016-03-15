function toggleNavElem(whichElement, event) {
    thisNavId = whichElement.getAttribute('aria-controls');
    if (thisNavId) {
        event.preventDefault();
        thisNavContent = document.getElementById(thisNavId);
        if (thisNavContent.getAttribute('aria-hidden') == 'true') {
            thisNavContent.setAttribute('aria-hidden', 'false');
            whichElement.setAttribute('aria-expanded', 'true');
            //thisNavContent.focus(); https://github.com/edenspiekermann/a11y-toggle/issues/10
        } else {
            thisNavContent.setAttribute('aria-hidden', 'true');
            whichElement.setAttribute('aria-expanded', 'false');
        }
    }
}

function checkForMegaMenus() {
    // https://adactio.com/journal/10365
    // http://codepen.io/adactio/pen/oxLNwY/
    if (cutsTheMustard) {
        var useHover = false;
        if (getStyle("menuToggle", "display") == "none") {
            // use hover instead
            useHover = true;
        }
        // set up menus:
        var navElementsWithChildren = document.querySelectorAll('[aria-controls]');
        var navCount = navElementsWithChildren.length;
        for (i = 0; i < navCount; i++) {
            thisNavId = navElementsWithChildren[i].getAttribute('aria-controls');
            thisNavContent = document.getElementById(thisNavId);
            thisNavContent.setAttribute('aria-hidden', 'true');
            thisNavContent.setAttribute('tabindex', '-1');
            navElementsWithChildren[i].setAttribute('aria-expanded', 'false');
            if (useHover) {
                navElementsWithChildren[i].addEventListener("mouseover", function(e) {
                    toggleNavElem(this, e);
                }, false);
                navElementsWithChildren[i].addEventListener("mouseout", function(e) {
                    toggleNavElem(this, e);
                }, false);
            } else {
                navElementsWithChildren[i].addEventListener("click", function(e) {
                    toggleNavElem(this, e);
                }, false);
            }
        }
    }
}
