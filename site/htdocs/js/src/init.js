// font face loader:
// https://helloanselm.com/2015/using-webfonts-in-2015/
var observer = new FontFaceObserver("forolight")
    .check()
    .then(function() {
        document.documentElement.className += " fontsLoaded";
        // set a cookie as the font should now be in cache and can be displayed immediately subsequently
        createCookie("fontLoaded", "true", 1);
    });

// service worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.min.js', {
    scope: '/'
  });
}