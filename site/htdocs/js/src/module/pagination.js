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
