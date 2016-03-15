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

navigationReaction = function(event) {
    target = event.target || event.srcElement;
    console.log(event.type);
    toggleNavElem(target, event);

};

function setUpNavigation() {
    // https://adactio.com/journal/10365
    // http://codepen.io/adactio/pen/oxLNwY/
    if (cutsTheMustard) {
        ae.useHover = false;
        if (getStyle("menuToggle", "display") == "none") {
            // use hover instead
            ae.useHover = true;
        }
        // set up menus:
        navElementsWithChildren = document.querySelectorAll('[aria-controls]');
        navCount = navElementsWithChildren.length;
        for (i = 0; i < navCount; i++) {
            thisNavId = navElementsWithChildren[i].getAttribute('aria-controls');
            thisNavContent = document.getElementById(thisNavId);
            thisNavContent.setAttribute('aria-hidden', 'true');
            thisNavContent.setAttribute('tabindex', '-1');
            navElementsWithChildren[i].setAttribute('aria-expanded', 'false');
            if (ae.useHover) {
                navElementsWithChildren[i].addEventListener("mouseenter", navigationReaction, false);
                navElementsWithChildren[i].addEventListener("mouseleave", navigationReaction, false);
            } else {
                navElementsWithChildren[i].addEventListener("click", navigationReaction, false);
            }
        }
    }
}

function checkMenuConfig() {
    // called on resize.
    ae.olduseHover = ae.useHover;
    ae.useHover = false;
    if (getStyle("menuToggle", "display") == "none") {
        // use hover instead
        ae.useHover = true;
    }
    if (ae.useHover != ae.olduseHover) {
        // change handlers:
        for (i = 0; i < navCount; i++) {
            thisNavId = navElementsWithChildren[i].getAttribute('aria-controls');
            if (ae.useHover) {
                // remove previous click - add hover
                navElementsWithChildren[i].removeEventListener('click', navigationReaction, false);
                navElementsWithChildren[i].addEventListener("mouseenter", navigationReaction, false);
                navElementsWithChildren[i].addEventListener("mouseleave", navigationReaction, false);
            } else {
                navElementsWithChildren[i].removeEventListener('mouseenter', navigationReaction, false);
                navElementsWithChildren[i].removeEventListener('mouseleave', navigationReaction, false);
                navElementsWithChildren[i].addEventListener("click", navigationReaction, false);
            }
            // hide
            document.getElementById(thisNavId).setAttribute('aria-hidden', 'true');
            navElementsWithChildren[i].setAttribute('aria-expanded', 'false');
        }
    }
}
