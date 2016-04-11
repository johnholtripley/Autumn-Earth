var catalogueRoot = document.getElementById('herbariumCatalogue');
if (catalogueRoot) {


    function openPlantDetail(e) {
        if (e) {
            e.preventDefault();
        }

        addClass(document.getElementById('cd-modal'), "visible");
        addClass(document.getElementById('cd-transition-layer'), "opening");
    

    }

    function closePlantDetail(e) {
        if (e) {
            e.preventDefault();
        }
        addClass(document.getElementById('cd-transition-layer'), "closing");
        removeClass(document.getElementById('cd-modal'), "visible");

        // remove class after animation is complete ####
    
    }

    var catalogueLinks = catalogueRoot.getElementsByClassName('catalogueLink');

    for (var i = 0; i < catalogueLinks.length; i++) {
        catalogueLinks[i].addEventListener("click", openPlantDetail);
    }


    document.getElementById('modal-close').addEventListener("click", closePlantDetail);

}
