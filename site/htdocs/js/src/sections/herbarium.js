
var catalogueRoot = document.getElementById('herbariumCatalogue');
if(catalogueRoot) {


    function openPlantDetail(e) {
        if(e) {
            e.preventDefault();
        }
       
addClass(document.getElementById('cd-transition-layer'), "visible");
addClass(document.getElementById('cd-transition-layer'), "opening");


    }

var catalogueLinks = catalogueRoot.getElementsByClassName('catalogueLink');

for (var i=0;i<catalogueLinks.length; i++) {
    catalogueLinks[i].addEventListener("click", openPlantDetail);
}

}