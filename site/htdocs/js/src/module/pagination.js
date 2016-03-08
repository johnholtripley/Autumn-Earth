if (cutsTheMustard && document.getElementById("paginationEnhanced")) {
    function getMoreContent() {
        // http://youmightnotneedjquery.com/
        var request = new XMLHttpRequest();
        // get current page number:
        var currentPage = window.location.toString();
        var pagePos = currentPage.indexOf("page/");
        if (pagePos != -1) {
            pageToRequest = parseInt(currentPage.substr(pagePos + 5)) + 1;
        } else {
            // currently on the first page
            pageToRequest = 2;
        }
        request.open('GET', '/includes/getNewsArticleList.php?page=' + pageToRequest, true);
        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {
                    // Success:
                    var response = this.responseText;
                    if (response != "") {
                        document.getElementById('pageArticleList').insertAdjacentHTML('beforeend', response);
                        // update URL accordingly and update history state
                        if (history.pushState) {
                            var stateObj = {};
                            history.pushState(stateObj, "page " + pageToRequest, "/chronicle/page/" + pageToRequest);
                        } else {
                            // ###
                        }
                    }
                } else {
                    // Error:
                    // ###
                }
            }
        };
        request.send();
        request = null;
    }
    document.getElementById("paginationEnhanced").innerHTML = '<button id="loadMore">load more</button>';
    document.getElementById("loadMore").addEventListener("click", getMoreContent);
}
