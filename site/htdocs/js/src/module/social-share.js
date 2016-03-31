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
    windowPopup(this.getAttribute("href"), 750, 552);
}



var socialLinks = document.querySelectorAll('.popupWindow');

for (i = 0; i < socialLinks.length; ++i) {
    socialLinks[i].addEventListener("click", openSocialPopup);
}
// pinterest needs a larger popup:
var largerPopup = document.querySelector('.largerPopupWindow');
if(largerPopup) {


largerPopup.addEventListener("click", openLargerSocialPopup);
}
