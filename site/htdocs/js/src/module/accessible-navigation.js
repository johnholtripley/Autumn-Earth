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
    toggleNavElem(target, event);
};

function setUpNavigation() {
    // https://adactio.com/journal/10365
    // http://codepen.io/adactio/pen/oxLNwY/
    if (cutsTheMustard) {
        navElementsWithChildren = document.querySelectorAll('#navigation [aria-controls]');
        navCount = navElementsWithChildren.length;
        for (i = 0; i < navCount; i++) {
            thisNavId = navElementsWithChildren[i].getAttribute('aria-controls');
            thisNavContent = document.getElementById(thisNavId);
            thisNavContent.setAttribute('aria-hidden', 'true');
            thisNavContent.setAttribute('tabindex', '-1');
            navElementsWithChildren[i].setAttribute('aria-expanded', 'false');
            navElementsWithChildren[i].parentNode.parentNode.addEventListener("click", navigationReaction, false);

        }
    }
}
