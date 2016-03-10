if (cutsTheMustard && history.pushState && document.getElementById("paginationEnhanced")) {

    function getMoreContent() {
        var savedButtonContent = document.getElementById("loadMore").innerHTML;
        document.getElementById("loadMore").setAttribute("disabled", "disabled");
        document.getElementById("loadMore").innerHTML = 'loading...';

        // http://youmightnotneedjquery.com/
        var request = new XMLHttpRequest();
        // get current page number:
        var currentPage = window.location.toString();
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
        } else {
            // currently on the first page
            startRange = 1;
            pageToRequest = 2;
        }
        request.open('GET', '/includes/getNewsArticleList.php?page=' + pageToRequest, true);
        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                document.getElementById("loadMore").removeAttribute("disabled");
                if (this.status >= 200 && this.status < 400) {
                    // Success:
                    var response = this.responseText;
                    if (response != "") {
                        var jsonResponse = JSON.parse(response);
                        document.getElementById('pageArticleList').insertAdjacentHTML('beforeend', jsonResponse['markup']);
                        // update URL accordingly and update history state
                        urlUpdate = startRange + "-" + pageToRequest;
                        var stateObj = { };
                        history.replaceState(stateObj, "page " + urlUpdate, "/chronicle/page/" + urlUpdate);
                        var resultsRemaining = jsonResponse['resultsRemaining'];
                        if (resultsRemaining == 0) {
                            // remove load more button:
                            document.getElementById("paginationEnhanced").innerHTML = '';
                        } else {
                            document.getElementById("loadMore").innerHTML = 'load more (' + resultsRemaining + ' more)';
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
