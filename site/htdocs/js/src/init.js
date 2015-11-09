// font face loader:
var observer = new FontFaceObserver("forolight")
    .check()
    .then(function() {
        document.documentElement.className += " fontsLoaded";
        // set a cookie as the font should now be in cache and can be displayed immediately subsequently
        createCookie("fontLoaded", "true", 1);
    });

// service worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceWorker.js', {
    scope: '/'
  });
}