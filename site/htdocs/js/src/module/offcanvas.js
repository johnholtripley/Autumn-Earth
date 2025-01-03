
ae.menuToggleElem = document.getElementById("menuToggle");

if(cutsTheMustard && ae.menuToggleElem) {
ae.navigationIsRevealed = false;



// toggle with the menu button:
ae.menuToggleElem.addEventListener("click", function(e) {
	ae.checkToggleNavigation();
	if (e) {
		e.preventDefault();
	}
}, false);

// add ARIA attributes to help:
ae.menuToggleElem.setAttribute('aria-expanded', false);
ae.menuToggleElem.setAttribute('aria-controls', 'navigation');

ae.checkToggleNavigation = function() {
	if (ae.navigationIsRevealed) {
		// hide navigation:
		removeClass(document.documentElement, "offCanvas");
		ae.navigationIsRevealed = false;
		ae.menuToggleElem.setAttribute('aria-expanded', false);
	} else {
		// reveal navigation:
		addClass(document.documentElement, "offCanvas");
		ae.navigationIsRevealed = true;
		ae.menuToggleElem.setAttribute('aria-expanded', true);
		document.querySelector("#navigation a").focus();
	}
};

ae.checkCloseNavigation = function(e) {
	if (ae.navigationIsRevealed) {
		// check it's not the menu icon itself as this will trigger independently (and would cause the event to be fired twice)
		if (e.target.id != "menuToggle") {
			// check the click isn't within the nav panel:
			if (!hasParent(e.target, 'navigation')) {
				// hide navigation:
				removeClass(document.documentElement, "offCanvas");
				ae.navigationIsRevealed = false;
				ae.menuToggleElem.setAttribute('aria-expanded', false);
				e.preventDefault();
			}
		}
	}
};

	// close by touching the visible part of the content:
document.addEventListener("click", function(e) {
		
	ae.checkCloseNavigation(e);

}, true);
// double up for mobile event:
document.addEventListener("touchend", function(e) {
	
	ae.checkCloseNavigation(e);

});
ae.swipeLeft = function() {
	if (ae.navigationIsRevealed) {
		removeClass(document.documentElement, "offCanvas");
		ae.navigationIsRevealed = false;
		ae.menuToggleElem.setAttribute('aria-expanded', false);
	}
};

	// init touch:
if ("ontouchstart" in document.documentElement) {
	document.body.addEventListener("touchstart", function(a) {
		startPointX = a.touches[0].pageX;
		startPointY = a.touches[0].pageY;
		isScrolling = "";
		deltaX = 0;
	}, false);
	document.body.addEventListener("touchmove", function(a) {
		if (a.touches.length > 1 || a.scale && a.scale !== 1) {
			return;
		}
		deltaX = a.touches[0].pageX - startPointX;
		if (isScrolling === "") {
			isScrolling = (isScrolling || Math.abs(deltaX) < Math.abs(a.touches[0].pageY - startPointY));
		}
		if (!isScrolling) {
			a.preventDefault();
		}
	}, false);
	document.body.addEventListener("touchend", function(a) {
		if (!isScrolling) {
			if ((Math.abs(deltaX)) > 100) {
				if (deltaX < 0) {
					ae.swipeLeft();
				} else {
					// ae.swipeRight();
				}
			}
		}
	}, false);
}
}