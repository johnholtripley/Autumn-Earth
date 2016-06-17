
/*
function viewport() {
 
// http://stackoverflow.com/questions/11309859/css-media-queries-and-javascript-window-width-do-not-match
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}
 */
//Then use it with something like
//if (viewport().width > 749) {
//}
/*
  function isNumeric(n) {
        // http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
  */
// helpers:
/*function supportsSVG() {
  return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
}
*/


/*
function detectKonamiCode() {
    // http://codepen.io/jacknumber/pen/BKBjvM
    var user_keys = [],
        konami = '38,38,40,40,37,39,37,39,66,65';
    document.onkeydown = function(e) {
        user_keys.push(e.keyCode)

        if (user_keys.toString().indexOf(konami) >= 0) {
            alert('KONAMI!');
            user_keys = [];
        }
    }
}
*/




    function whichAnimationEvent() {
        // https://davidwalsh.name/css-animation-callback
        var t;
        var el = document.createElement('fakeelement');
        var animations = {
            'animation': 'animationend',
            'OAnimation': 'oAnimationEnd',
            'MozAnimation': 'animationend',
            'WebkitAnimation': 'webkitAnimationEnd'
        }
        for (t in animations) {
            if (el.style[t] !== undefined) {
                return animations[t];
            }
        }
    }


    function whichTransitionEvent() {
        // https://davidwalsh.name/css-animation-callback
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }





function createCookie(name,value,days) {
  // http://www.quirksmode.org/js/cookies.html
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function supportsCanvas() {
  // http://diveintohtml5.info/detect.html#canvas
 // return !!document.createElement('canvas').getContext;
 // http://stackoverflow.com/questions/2745432/best-way-to-detect-that-html5-canvas-is-not-supported#answer-2745459 
 // faster way of doing it as no element is created:
 return !!window.HTMLCanvasElement;
}



function domReady() {
setUpNavigation();
}

// http://stackoverflow.com/questions/1795089/how-can-i-detect-dom-ready-and-add-a-class-without-jquery/1795167#1795167
// Mozilla, Opera, Webkit 
if ( document.addEventListener ) {
  document.addEventListener( "DOMContentLoaded", function(){
    document.removeEventListener( "DOMContentLoaded", arguments.callee, false);
    domReady();
  }, false );

// If IE event model is used
} else if ( document.attachEvent ) {
  // ensure firing before onload
  document.attachEvent("onreadystatechange", function(){
    if ( document.readyState === "complete" ) {
      document.detachEvent( "onreadystatechange", arguments.callee );
      domReady();
    }
  });
}






/*
function viewport() {
  // https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
    var e = window, a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width: e[a + 'Width'], height: e[a + 'Height'] }
}

// viewport width = viewport().width;
*/









/*
// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};




var throttledResize = debounce(function() {
//    checkMenuConfig();
}, 250);

window.addEventListener('resize', throttledResize);
*/

// check for flexbox support:
var doc = document.body || document.documentElement;
var style = doc.style;
if (style.webkitFlexWrap == '' || style.msFlexWrap == '' || style.flexWrap == '') {
    document.documentElement.className += " supports-flex";
}




function getStyle(el,styleProp) {
  // http://www.quirksmode.org/dom/getstyles.html
  var x = document.getElementById(el);
  if (x.currentStyle)
    var y = x.currentStyle[styleProp];
  else if (window.getComputedStyle)
    var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
  return y;
}


/*
    if(supportsCanvas) {
document.documentElement.className +=" canvas" ;
}

*/

// create AE object for scoping:
var ae = new Object();


// ---------------------
// http://youmightnotneedjquery.com/ - IE8+
function addClass(whichElement, className) {
  if (whichElement.classList) {
    whichElement.classList.add(className);
  } else {
    whichElement.className += ' ' + className;
  }
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function hasParent(element, id) {
  if (element) {
    do {
      if (element.id === id) {
        return true;
      }
      if (element.nodeType === 9) {
        // root node
        break;
      }
    }
    while ((element = element.parentNode));
  }
  return false;
}


function hasClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }
}




/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT / GPLv2 License.
*/
(function(w){
  
  // This fix addresses an iOS bug, so return early if the UA claims it's something else.
  var ua = navigator.userAgent;
  if( !( /iPhone|iPad|iPod/.test( navigator.platform ) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf( "AppleWebKit" ) > -1 ) ){
    return;
  }

    var doc = w.document;

    if( !doc.querySelector ){ return; }

    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ",maximum-scale=1",
        enabledZoom = initialContent + ",maximum-scale=10",
        enabled = true,
    x, y, z, aig;

    if( !meta ){ return; }

    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true;
    }

    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;
    }
  
    function checkTilt( e ){
    aig = e.accelerationIncludingGravity;
    x = Math.abs( aig.x );
    y = Math.abs( aig.y );
    z = Math.abs( aig.z );
        
    // If portrait orientation and in one of the danger zones
        if( (!w.orientation || w.orientation === 180) && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) ) ){
      if( enabled ){
        disableZoom();
      }         
        }
    else if( !enabled ){
      restoreZoom();
        }
    }
  
  w.addEventListener( "orientationchange", restoreZoom, false );
  w.addEventListener( "devicemotion", checkTilt, false );

})( this );

/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-load
 */
/*
;window.Modernizr=function(a,b,c){function t(a){i.cssText=a}function u(a,b){return t(prefixes.join(a+";")+(b||""))}function v(a,b){return typeof a===b}function w(a,b){return!!~(""+a).indexOf(b)}function x(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:v(f,"function")?f.bind(d||b):f}return!1}var d="2.8.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l={},m={},n={},o=[],p=o.slice,q,r={}.hasOwnProperty,s;!v(r,"undefined")&&!v(r.call,"undefined")?s=function(a,b){return r.call(a,b)}:s=function(a,b){return b in a&&v(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=p.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(p.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(p.call(arguments)))};return e});for(var y in l)s(l,y)&&(q=y.toLowerCase(),e[q]=l[y](),o.push((e[q]?"":"no-")+q));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)s(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},t(""),h=j=null,e._version=d,e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};



   Modernizr.load([
                {
                    // load additional assets needed for the enhanced experience:
                    load: ['/js/jquery-1.11.1.min.js',
                    '/js/enhancements.js'
                    ],
                    complete: function () {
                    enhancedLoaded = true;
                        initEnhancements();
                    }
                }
            ]);
            */
// -----------------------------------------------
// cssTransitionSupport = false;
// http://davidwalsh.name/css-animation-callback
/* From Modernizr */
/*
function whichTransitionEvent(){
    var t;
    var el = document.getElementById("wrapper");
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
        //  cssTransitionSupport = true;
            return transitions[t];
        }
    }
}
*/
/*
// Listen for a transition on the login panel
var transitionEvent = whichTransitionEvent();
transitionEvent && navigationInner.addEventListener(transitionEvent, function() {
  // transition ended:

if(loginExpanded) {
addClass(loginPanel,"focussed");
}

});



*/
/*


     var contactBlockHeaders = document.querySelectorAll("#contactBlocks h4");
     var contactBlockListItems = document.querySelectorAll("#contactBlocks li");
     var contactBlockListItemsLength = contactBlockListItems.length;
     
     for(var i = 0; i < contactBlockHeaders.length; i++) {
     
     contactBlockHeaders[i].addEventListener("click", function(e) {
       
       // remove class from siblings:
       for(var j = 0; j < contactBlockListItemsLength; j++) {
       removeClass(contactBlockListItems[j], "active");
       }
       addClass(this.parentNode.parentNode, "active");
       
     }, false);
     
 
     }


*/

/*

if (supportsSVG()) {
  document.documentElement.className += " svg";
}

*/




/*
use the visibility API to change the page title when the user moves to another tab
var title = document.title,
newTitle = "Remember to read this " + title;
document.addEventListener("visibilitychange", function() {
  document.title = ((document.hidden) ? newTitle : title);
});
*/
function AccordionWidget(el, selectedIndex) {
    // http://codepen.io/stowball/pen/eZKwRv
    // kudos Matt Stow
    if (!el) {
        return;
    }
    this.el = el;
    this.accordionTriggers = this.el.getElementsByClassName('js-accordion-trigger');
    this.accordionPanels = this.el.getElementsByClassName('js-accordion-panel');
    if (this.accordionTriggers.length === 0 || this.accordionTriggers.length !== this.accordionPanels.length) {
        return;
    }
    this.init(selectedIndex);
}

AccordionWidget.prototype.init = function(selectedIndex) {
    this.accordionTriggersLength = this.accordionTriggers.length;
    this.expandedAccordions = new Array(this.accordionTriggersLength);
    this.multiSelectable = this.el.hasAttribute('aria-multiselectable');
    this.keys = {
        prev: 38,
        next: 40,
        space: 32
    };
    var initialSelectedIndex;
    for (var i = 0; i < this.accordionTriggersLength; i++) {
        this.accordionTriggers[i].index = i;
        this.accordionTriggers[i].addEventListener('click', this.accordionClick.bind(this), false);
        this.accordionTriggers[i].addEventListener('keydown', this.accordionCursor.bind(this), false);
        this.accordionTriggers[i].addEventListener('focus', this.accordionFocus.bind(this), false);
        if (this.accordionTriggers[i].classList.contains('is-selected')) {
            this.expandedAccordions[i] = true;
        }
    }
    if (!isNaN(selectedIndex)) {
        initialSelectedIndex = selectedIndex < this.accordionTriggersLength ? selectedIndex : this.accordionTriggersLength - 1;
        this.expandedAccordions = new Array(this.accordionTriggersLength);
        this.expandedAccordions[initialSelectedIndex] = true;
    } else {
        initialSelectedIndex = this.expandedAccordions.lastIndexOf(true);
        if (!this.multiSelectable) {
            this.expandedAccordions = new Array(this.accordionTriggersLength);
            this.expandedAccordions[initialSelectedIndex] = true;
        }
    }
    this.setSelected(initialSelectedIndex);
    this.setExpanded();
    this.el.classList.add('is-initialized');
};

AccordionWidget.prototype.accordionClick = function(e) {
    e.preventDefault();
    this.setSelected(e.target.index, true);
    this.setExpanded(e.target.index, true);
};

AccordionWidget.prototype.accordionCursor = function(e) {
    var targetIndex;
    if (e.keyCode === this.keys.space || e.keyCode === this.keys.prev || e.keyCode === this.keys.next) {
        e.preventDefault();
        if (e.keyCode === this.keys.space) {
            this.setExpanded(e.target.index, true);
            return;
        }
    } else {
        return;
    }

    if (e.keyCode === this.keys.prev && e.target.index > 0) {
        targetIndex = e.target.index - 1;
    } else if (e.keyCode === this.keys.next && e.target.index < this.accordionTriggersLength - 1) {
        targetIndex = e.target.index + 1;
    } else {
        return;
    }
    this.setSelected(targetIndex, true);
};

AccordionWidget.prototype.accordionFocus = function() {
    if (this.accordionTriggersLength === 1) {
        this.setSelected(0);
    }
    return;
};

AccordionWidget.prototype.setSelected = function(index, userInvoked) {
    if (index === -1) {
        this.accordionTriggers[0].setAttribute('tabindex', 0);
        return;
    }

    for (var i = 0; i < this.accordionTriggersLength; i++) {
        if (i === index) {
            this.accordionTriggers[i].classList.add('is-selected');
            this.accordionTriggers[i].setAttribute('aria-selected', true);
            this.accordionTriggers[i].setAttribute('tabindex', 0);
            if (userInvoked) {
                this.accordionTriggers[i].focus();
            }
        } else {
            this.accordionTriggers[i].classList.remove('is-selected');
            this.accordionTriggers[i].setAttribute('aria-selected', false);
            this.accordionTriggers[i].setAttribute('tabindex', -1);
        }
    }
};

AccordionWidget.prototype.setExpanded = function(index, userInvoked) {
    var i;
    if (userInvoked) {
        if (this.multiSelectable) {
            this.expandedAccordions[index] = !this.expandedAccordions[index];
        } else {
            for (i = 0; i < this.accordionTriggersLength; i++) {
                if (i === index) {
                    this.expandedAccordions[i] = !this.expandedAccordions[i];
                } else {
                    this.expandedAccordions[i] = false;
                }
            }
        }
    }
    for (i = 0; i < this.accordionTriggersLength; i++) {
        if (this.expandedAccordions[i]) {
            this.accordionTriggers[i].setAttribute('aria-expanded', true);
            this.accordionTriggers[i].classList.add('is-expanded');
            this.accordionPanels[i].setAttribute('aria-hidden', false);
            this.accordionPanels[i].classList.remove('is-hidden');
            this.accordionPanels[i].setAttribute('tabindex', 0);
        } else {
            this.accordionTriggers[i].setAttribute('aria-expanded', false);
            this.accordionTriggers[i].classList.remove('is-expanded');
          //  this.accordionPanels[i].setAttribute('aria-hidden', true);
            this.accordionPanels[i].classList.add('is-hidden');
            this.accordionPanels[i].setAttribute('tabindex', -1);
        }
    }
};

// transition callback
var animatedElements = document.getElementsByClassName('js-accordion-panel');
var transitionEvent = whichTransitionEvent();
if (transitionEvent) {
    for (var i = 0; i < animatedElements.length; i++) {
        animatedElements[i].addEventListener(transitionEvent, function() {
            // will fire on open complete and close complete:
            if (hasClass(this, 'is-hidden')) {
                this.setAttribute('aria-hidden', true);
            } else {
                this.setAttribute('aria-hidden', false);
            }
        });
    }
}


// set up:
if (cutsTheMustard) {
    var accordionElements = document.getElementsByClassName('accordion-interface');
    accordionCount = accordionElements.length;
    for (i = 0; i < accordionCount; i++) {
        new AccordionWidget(accordionElements[i], 0);
    }
}

(function (global) {
  'use strict';

  // Helper function to get all focusable children from a node
  function getFocusableChildren (node) {
    var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

    return $$(focusableElements.join(','), node).filter(function (child) {
      return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
    });
  }

  // Helper function to get all nodes in context matching selector as an array
  function $$ (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector) || []);
  }

  // Helper function trapping the tab key inside a node
  function trapTabKey (node, event) {
    var focusableChildren = getFocusableChildren(node);
    var focusedItemIndex = focusableChildren.indexOf(document.activeElement);

    if (event.shiftKey && focusedItemIndex === 0) {
      focusableChildren[focusableChildren.length - 1].focus();
      event.preventDefault();
    } else if (!event.shiftKey && focusedItemIndex === focusableChildren.length - 1) {
      focusableChildren[0].focus();
      event.preventDefault();
    }
  }

  // Helper function to focus first focusable item in node
  function setFocusToFirstItem (node) {
    var focusableChildren = getFocusableChildren(node);
    if (focusableChildren.length) focusableChildren[0].focus();
  }

  var focusedBeforeDialog;

  /**
   * A11yDialog constructor
   * @param {Node} node - Dialog element
   * @param {Node} main - Main element of the page
   */
  var A11yDialog = function (node, main) {
    var namespace = 'data-a11y-dialog';
    var that = this;
    main = main || document.querySelector('#main');

    this.shown = false;
    this.show = show;
    this.hide = hide;

    $$('[' + namespace + '-show="' + node.id + '"]').forEach(function (opener) {
      opener.addEventListener('click', show);
    });

    $$('[' + namespace + '-hide]', node).concat($$('[' + namespace + '-hide="' + node.id + '"]')).forEach(function (closer) {
      closer.addEventListener('click', hide);
    });

    document.addEventListener('keydown', function (event) {
      if (that.shown && event.which === 27) {
        event.preventDefault();
        hide();
      }

      if (that.shown && event.which === 9) {
        trapTabKey(node, event);
      }
    });

    document.body.addEventListener('focus', function (event) {
      if (that.shown && !node.contains(event.target)) {
        setFocusToFirstItem(node);
      }
    }, true);

    function show () {
      that.shown = true;
      node.removeAttribute('aria-hidden');
      main.setAttribute('aria-hidden', 'true');
      focusedBeforeDialog = document.activeElement;
      setFocusToFirstItem(node);
    }

    function hide () {
      that.shown = false;
      node.setAttribute('aria-hidden', 'true');
      main.removeAttribute('aria-hidden');
      focusedBeforeDialog.focus();
    }
  };

  global.A11yDialog = A11yDialog;
}(window));

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

/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/



;
(function(document, window, index) {
    if (cutsTheMustard) {
        var inputs = document.querySelectorAll('.fileInput');
        Array.prototype.forEach.call(inputs, function(input) {
            var label = input.nextElementSibling, labelVal = label.innerHTML;
            input.addEventListener('change', function(e) {
                var fileName = '';
                if (this.files && this.files.length > 1)
                    fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                else
                    fileName = e.target.value.split('\\').pop();

                if (fileName)
                    label.querySelector('span').innerHTML = fileName;
                else
                    label.innerHTML = labelVal;
            });

            // Firefox bug fix
            //input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
            //input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
        });
    }
}(document, window, 0));

function debounce(func, wait, immediate) {
	http://davidwalsh.name/javascript-debounce-function
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
(function(){'use strict';var f,g=[];function l(a){g.push(a);1==g.length&&f()}function m(){for(;g.length;)g[0](),g.shift()}f=function(){setTimeout(m)};function n(a){this.a=p;this.b=void 0;this.f=[];var b=this;try{a(function(a){q(b,a)},function(a){r(b,a)})}catch(c){r(b,c)}}var p=2;function t(a){return new n(function(b,c){c(a)})}function u(a){return new n(function(b){b(a)})}function q(a,b){if(a.a==p){if(b==a)throw new TypeError;var c=!1;try{var d=b&&b.then;if(null!=b&&"object"==typeof b&&"function"==typeof d){d.call(b,function(b){c||q(a,b);c=!0},function(b){c||r(a,b);c=!0});return}}catch(e){c||r(a,e);return}a.a=0;a.b=b;v(a)}}
function r(a,b){if(a.a==p){if(b==a)throw new TypeError;a.a=1;a.b=b;v(a)}}function v(a){l(function(){if(a.a!=p)for(;a.f.length;){var b=a.f.shift(),c=b[0],d=b[1],e=b[2],b=b[3];try{0==a.a?"function"==typeof c?e(c.call(void 0,a.b)):e(a.b):1==a.a&&("function"==typeof d?e(d.call(void 0,a.b)):b(a.b))}catch(h){b(h)}}})}n.prototype.g=function(a){return this.c(void 0,a)};n.prototype.c=function(a,b){var c=this;return new n(function(d,e){c.f.push([a,b,d,e]);v(c)})};
function w(a){return new n(function(b,c){function d(c){return function(d){h[c]=d;e+=1;e==a.length&&b(h)}}var e=0,h=[];0==a.length&&b(h);for(var k=0;k<a.length;k+=1)u(a[k]).c(d(k),c)})}function x(a){return new n(function(b,c){for(var d=0;d<a.length;d+=1)u(a[d]).c(b,c)})};window.Promise||(window.Promise=n,window.Promise.resolve=u,window.Promise.reject=t,window.Promise.race=x,window.Promise.all=w,window.Promise.prototype.then=n.prototype.c,window.Promise.prototype["catch"]=n.prototype.g);}());

(function(){var k=!!document.addEventListener;function l(a,b){k?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function v(a){document.body?a():k?document.addEventListener("DOMContentLoaded",a):document.attachEvent("onreadystatechange",function(){"interactive"!=document.readyState&&"complete"!=document.readyState||a()})};function w(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function y(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;left:-999px;white-space:nowrap;font:"+b+";"}function z(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function A(a,b){function c(){var a=m;z(a)&&null!==a.a.parentNode&&b(a.g)}var m=a;l(a.b,c);l(a.c,c);z(a)};function B(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var C=null,D=null,H=!!window.FontFace;function I(){if(null===D){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}D=""!==a.style.font}return D}function J(a,b){return[a.style,a.weight,I()?a.stretch:"","100px",b].join(" ")}
B.prototype.load=function(a,b){var c=this,m=a||"BESbswy",x=b||3E3,E=(new Date).getTime();return new Promise(function(a,b){if(H){var K=new Promise(function(a,b){function e(){(new Date).getTime()-E>=x?b():document.fonts.load(J(c,c.family),m).then(function(c){1<=c.length?a():setTimeout(e,25)},function(){b()})}e()}),L=new Promise(function(a,c){setTimeout(c,x)});Promise.race([L,K]).then(function(){a(c)},function(){b(c)})}else v(function(){function q(){var b;if(b=-1!=f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=
h)(b=f!=g&&f!=h&&g!=h)||(null===C&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),C=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=C&&(f==r&&g==r&&h==r||f==t&&g==t&&h==t||f==u&&g==u&&h==u)),b=!b;b&&(null!==d.parentNode&&d.parentNode.removeChild(d),clearTimeout(G),a(c))}function F(){if((new Date).getTime()-E>=x)null!==d.parentNode&&d.parentNode.removeChild(d),b(c);else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,g=n.a.offsetWidth,
h=p.a.offsetWidth,q();G=setTimeout(F,50)}}var e=new w(m),n=new w(m),p=new w(m),f=-1,g=-1,h=-1,r=-1,t=-1,u=-1,d=document.createElement("div"),G=0;d.dir="ltr";y(e,J(c,"sans-serif"));y(n,J(c,"serif"));y(p,J(c,"monospace"));d.appendChild(e.a);d.appendChild(n.a);d.appendChild(p.a);document.body.appendChild(d);r=e.a.offsetWidth;t=n.a.offsetWidth;u=p.a.offsetWidth;F();A(e,function(a){f=a;q()});y(e,J(c,'"'+c.family+'",sans-serif'));A(n,function(a){g=a;q()});y(n,J(c,'"'+c.family+'",serif'));A(p,function(a){h=
a;q()});y(p,J(c,'"'+c.family+'",monospace'))})})};window.FontFaceObserver=B;window.FontFaceObserver.prototype.check=window.FontFaceObserver.prototype.load=B.prototype.load;"undefined"!==typeof module&&(module.exports=window.FontFaceObserver);}());

if(cutsTheMustard && document.getElementById("menuToggle")) {
ae.navigationIsRevealed = false;

menuToggleElem = document.getElementById("menuToggle");

// toggle with the menu button:
document.getElementById("menuToggle").addEventListener("click", function(e) {
	ae.checkToggleNavigation();
	if (e) {
		e.preventDefault();
	}
}, false);

// add ARIA attributes to help:
document.getElementById("menuToggle").setAttribute('aria-expanded', false);
document.getElementById("menuToggle").setAttribute('aria-controls', 'navigation');

ae.checkToggleNavigation = function() {
	if (ae.navigationIsRevealed) {
		// hide navigation:
		removeClass(document.documentElement, "offCanvas");
		ae.navigationIsRevealed = false;
		document.getElementById("menuToggle").setAttribute('aria-expanded', false);
	} else {
		// reveal navigation:
		addClass(document.documentElement, "offCanvas");
		ae.navigationIsRevealed = true;
		document.getElementById("menuToggle").setAttribute('aria-expanded', true);
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
				document.getElementById("menuToggle").setAttribute('aria-expanded', false);
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
		document.getElementById("menuToggle").setAttribute('aria-expanded', false);
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
if (cutsTheMustard && history.pushState && document.getElementById("paginationEnhanced")) {

    // get the name of the file to load the content from:
    var whichContentToGet = document.getElementById('paginationEnhanced').previousElementSibling.id;
    // eg. if the content block is newsArticleList then the content will be loaded from getnewsArticleList.php
  

    function getMoreContent() {
        var savedButtonContent = document.getElementById("loadMore").innerHTML;
        document.getElementById("loadMore").setAttribute("disabled", "disabled");
        document.getElementById("loadMore").innerHTML = 'loading...';

        // http://youmightnotneedjquery.com/
        var request = new XMLHttpRequest();
        // get current page number:
        var currentPage = window.location.pathname.toString();
        var pagePos = currentPage.indexOf("page/");
        if (pagePos != -1) {
            pageToRequest = currentPage.substr(pagePos + 5);
            // check if it's a page range
            var rangePos = pageToRequest.indexOf("-");
            if (rangePos != -1) {
                var startRange = pageToRequest.substr(0, rangePos);
                var endRange = pageToRequest.substr(rangePos + 1);
                pageToRequest = parseInt(endRange) + 1;
            } else {
                startRange = parseInt(pageToRequest);
                pageToRequest = parseInt(pageToRequest) + 1;
            }
            sectionRoot = currentPage.substr(0, pagePos);
        } else {
            // currently on the first page
            startRange = 1;
            pageToRequest = 2;
            sectionRoot = currentPage;
        }
        if (sectionRoot.slice(-1) != "/") {
            sectionRoot += "/";
        }

        request.open('GET', '/includes/get' + whichContentToGet + '.php?page=' + pageToRequest, true);
        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                document.getElementById("loadMore").removeAttribute("disabled");
                if (this.status >= 200 && this.status < 400) {
                    // Success:
                    var response = this.responseText;
                    if (response != "") {
                        var jsonResponse = JSON.parse(response);
                        document.getElementsByClassName('paginatedBlock')[0].insertAdjacentHTML('beforeend', jsonResponse['markup']);
                        // update URL accordingly and update history state
                        urlUpdate = startRange + "-" + pageToRequest;
                        var stateObj = {};
                        history.replaceState(stateObj, "page " + urlUpdate, sectionRoot + "page/" + urlUpdate);
                        var resultsRemaining = jsonResponse['resultsRemaining'];
                        if (resultsRemaining == 0) {
                            // remove load more button:
                            document.getElementById("paginationEnhanced").innerHTML = '';
                        } else {
                            document.getElementById("loadMore").innerHTML = 'load more (' + resultsRemaining + ' more)';
                        }

if (catalogueRoot) {
    // is the Herbarium page, so bind the click events to the newly loaded items
    // (it's safe to re-bind the event to existing items as it won't be fired twice)
bindHerbariumModal();
}

                    }
                } else {
                    // Error:
                    // restore the button to be able to try again:
                    document.getElementById("loadMore").innerHTML = savedButtonContent;
                }
            }
        };
        request.send();
        request = null;
    }
    resultsRemaining = document.getElementById('articlesRemaining').innerHTML;
    if (resultsRemaining > 0) {
        document.getElementById("paginationEnhanced").innerHTML = '<button id="loadMore">load more (' + resultsRemaining + ' more)</button>';
        document.getElementById("loadMore").addEventListener("click", getMoreContent);
    } else {
        document.getElementById("paginationEnhanced").innerHTML = '';
    }
}

function windowPopup(url, width, height) {
    var left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);
    window.open(url, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
}


function openSocialPopup(e) {
    if (e) {
        e.preventDefault();
    }
    windowPopup(this.getAttribute("href"), 500, 300);
}

function openLargerSocialPopup(e) {
    if (e) {
        e.preventDefault();
    }
    windowPopup(this.getAttribute("href"), 750, 552);
}


function bindSocialLinks() {
    var socialLinks = document.querySelectorAll('.popupWindow');
    for (i = 0; i < socialLinks.length; ++i) {
        socialLinks[i].addEventListener("click", openSocialPopup);
    }
    // pinterest needs a larger popup:
    var largerPopup = document.querySelector('.largerPopupWindow');
    if (largerPopup) {
        largerPopup.addEventListener("click", openLargerSocialPopup);
    }
}
bindSocialLinks();
var catalogueRoot = document.getElementById('herbariumCatalogue');
var storedCurrentPage = "/herbarium/";

function bindHerbariumModal() {
    var catalogueLinks = catalogueRoot.getElementsByClassName('triggersModal');
    for (var i = 0; i < catalogueLinks.length; i++) {
        catalogueLinks[i].addEventListener("click", openPlantDetail, false);
    }
}

if (catalogueRoot) {
    var animatedElement = document.getElementById('inkEffect');
    var modalWrapper = document.getElementById('modalWrapper');
    var plantModalDetails = document.getElementById('plantModalDetails');


    var animationEvent = whichAnimationEvent();
    animationEvent && animatedElement.addEventListener(animationEvent, function() {
        // will fire on open complete and close complete:
        if (modalWrapper.className == "closing") {
            modalWrapper.className = "";
        }
    });

    function openPlantDetail(e) {
        if (e) {
            e.preventDefault();
        }

plantURL = this.getAttribute('data-url');
pageToRequest = '/includes/herbarium/plant-detail.php?plant='+plantURL;

// start ajax request:
var request = new XMLHttpRequest();
 request.open('GET', pageToRequest, true);
        request.onreadystatechange = function() {
            if (this.readyState === 4) {

if (this.status >= 200 && this.status < 400) {
                    // Success:
                    var response = this.responseText;
                    if (response != "") {
                        plantModalDetails.innerHTML = response;
                        bindSocialLinks();
                    }
                }
            }
              };
        request.send();
        request = null;




        var thisPlantDetail = this.innerHTML;
        plantModalDetails.innerHTML = thisPlantDetail;
        modalWrapper.className = "opening";
        modalWrapper.removeAttribute('aria-hidden');
        document.getElementById('offCanvasWrapper').setAttribute('aria-hidden', 'true');
        storedCurrentPage = window.location.pathname.toString();
        var stateObj = {};
        history.replaceState(stateObj, "Plant detail ", "/herbarium/" + plantURL);



 
    }

    function closePlantDetail(e) {
        if (e) {
            e.preventDefault();
        }
        modalWrapper.className = "closing";
        modalWrapper.setAttribute('aria-hidden', 'true');
        document.getElementById('offCanvasWrapper').removeAttribute('aria-hidden');
        var stateObj = {};
        history.replaceState(stateObj, "Plant detail ", storedCurrentPage);
    }
    bindHerbariumModal();

    document.getElementById('modalClose').addEventListener("click", closePlantDetail);
}

// font face loader:
// https://www.bramstein.com/writing/web-font-loading-patterns.html




   



var bodyNormal = new FontFaceObserver('Merriweather');
var bodyItalic = new FontFaceObserver('Merriweather', {
  style: 'italic'
});
var titleNormal = new FontFaceObserver('AlegreyaSC');

Promise.all([
  bodyNormal.load(),
  bodyItalic.load(),
  titleNormal.load()
]).then(function () {
   document.documentElement.className += " fontsLoaded";
        // set a cookie as the font should now be in cache and can be displayed immediately subsequently
        createCookie("fontLoaded", "true", 1);
});



// service worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.min.js', {
    scope: '/'
  });
}

// accessible modal:
(function () {
      document.addEventListener('DOMContentLoaded', function () {
        var dialogEl = document.getElementById('my-accessible-dialog');
        if(dialogEl) {
        var mainEl = document.getElementById('wrapper');
        var dialog = new window.A11yDialog(dialogEl, mainEl);
}
        // To manually control the dialog:
        // dialog.show()
        // dialog.hide()
      });
    }());







// cancel the <head> timeout as the JS has all loaded and the enhanced UI should show:
clearTimeout( fallbackTimeout ); 
document.documentElement.className += " js";

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZ1bmN0aW9ucy5qcyIsIm1vZHVsZS9hY2Nlc3NpYmxlLWFjY29yZGlvbi5qcyIsIm1vZHVsZS9hY2Nlc3NpYmxlLW1vZGFsLWRpYWxvZy5qcyIsIm1vZHVsZS9hY2Nlc3NpYmxlLW5hdmlnYXRpb24uanMiLCJtb2R1bGUvY3VzdG9tLWZpbGUtaW5wdXQuanMiLCJtb2R1bGUvZGVib3VuY2UuanMiLCJtb2R1bGUvZm9udGZhY2VvYnNlcnZlci5qcyIsIm1vZHVsZS9vZmZjYW52YXMuanMiLCJtb2R1bGUvcGFnaW5hdGlvbi5qcyIsIm1vZHVsZS9zb2NpYWwtc2hhcmUuanMiLCJzZWN0aW9ucy9oZXJiYXJpdW0uanMiLCJpbml0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiJodGRvY3MvanMvc3JjLyoqLyouanMifQ==
