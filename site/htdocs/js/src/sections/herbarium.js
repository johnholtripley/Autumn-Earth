var catalogueRoot = document.getElementById('herbariumCatalogue');

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
        var thisPlantDetail = this.innerHTML;
        plantModalDetails.innerHTML = thisPlantDetail;
        modalWrapper.className = "opening";
    }

    function closePlantDetail(e) {
        if (e) {
            e.preventDefault();
        }
        modalWrapper.className = "closing";
    }
bindHerbariumModal();
 
    document.getElementById('modalClose').addEventListener("click", closePlantDetail);
}
