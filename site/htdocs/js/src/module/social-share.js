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
    windowPopup(this.getAttribute("href"), 740, 552);
}

function webShareAPI(e) {
    if (navigator.share !== undefined) {
        // API is supported - override default share behaviour:
        if (e) {
            e.preventDefault();
        }
        // get meta description:
        var allMeta = document.getElementsByTagName('meta');
        metaDescContent = "Autumn Earth Community Site";
        for (var i = 0; i < allMeta.length; i++) {
            if (allMeta[i].getAttribute("name") == "description") {
                metaDescContent = allMeta[i].getAttribute("content");
            }
        }
        navigator.share({
            title: document.title,
            text: metaDescContent,
            url: window.location.href
        }) /*.then(() => console.log('Successful share')).catch(error => console.log('Error sharing:', error))*/ ;
    }
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
    // look for Web Share API links:
    var socialAPILinks = document.querySelectorAll('.shareLink');

    for (i = 0; i < socialAPILinks.length; ++i) {
        socialAPILinks[i].addEventListener("click", webShareAPI);
    }
}
bindSocialLinks();
