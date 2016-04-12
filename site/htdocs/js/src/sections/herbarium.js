var catalogueRoot = document.getElementById('herbariumCatalogue');
if (catalogueRoot) {


    var animatedElement = document.getElementById('inkEffect');
var modalWrapper = document.getElementById('modalWrapper');
    function whichAnimationEvent() {
        // https://davidwalsh.name/css-animation-callback
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'animation': 'animationend',
            'OAnimation': 'oAnimationEnd',
            'MozAnimation': 'animationend',
            'WebkitAnimation': 'webkitAnimationEnd'
        }

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    /* Listen for a transition! */
    var animationEvent = whichAnimationEvent();
    animationEvent && animatedElement.addEventListener(animationEvent, function() {
    // will fire on open complete and close complete:
        if(modalWrapper.className == "closing") {
         modalWrapper.className = "";
    }
    });











    function openPlantDetail(e) {
        if (e) {
            e.preventDefault();
        }



        modalWrapper.className = "opening";




    }

    function closePlantDetail(e) {
        if (e) {
            e.preventDefault();
        }
        modalWrapper.className = "closing";

        // remove class after animation is complete ####
        // https://davidwalsh.name/css-animation-callback (but animation end - http://osvaldas.info/examples/detecting-css-animation-transition-end-with-javascript/oncssanimationend.js)

    }

    var catalogueLinks = catalogueRoot.getElementsByClassName('triggersModal');

    for (var i = 0; i < catalogueLinks.length; i++) {
        catalogueLinks[i].addEventListener("click", openPlantDetail);
    }


    document.getElementById('modalClose').addEventListener("click", closePlantDetail);

}
