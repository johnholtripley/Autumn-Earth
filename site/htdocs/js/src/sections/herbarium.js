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
