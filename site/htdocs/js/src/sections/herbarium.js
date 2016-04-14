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

var thisPlantURL = this.getAttribute('data-url');


var thisShareString = shareString.replace(/##urlToShare##/g,'https://www.autumnearth.com/herbarium/'+thisPlantURL);
var thisShareString = thisShareString.replace(/##hashTag##/g,'AutumnEarth');
// ############ TO DO:
var thisShareString = thisShareString.replace(/##imageToShare##/g,'image-path-goes-here');
var thisShareString = thisShareString.replace(/##descToShare##/g,'names-and-desc-go-here');

        plantModalDetails.innerHTML = thisPlantDetail+thisShareString;
        modalWrapper.className = "opening";
        modalWrapper.removeAttribute('aria-hidden');
        document.getElementById('offCanvasWrapper').setAttribute('aria-hidden', 'true');
        storedCurrentPage = window.location.pathname.toString();
        var stateObj = {};
        history.replaceState(stateObj, "Plant detail ", "/herbarium/" + thisPlantURL);
        bindSocialLinks();
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
