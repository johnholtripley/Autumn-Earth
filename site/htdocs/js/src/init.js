// font face loader:
// https://www.bramstein.com/writing/web-font-loading-patterns.html




   



var bodyNormal = new FontFaceObserver('Merriweather');
var bodyItalic = new FontFaceObserver('Merriweather', {
  style: 'italic'
});
var titleNormal = new FontFaceObserver('AlegreyaSC');

Promise.all([
  bodyNormal.load(),
  bodyItalic.load(),
  titleNormal.load()
]).then(function () {
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

// accessible modal:
(function () {
      document.addEventListener('DOMContentLoaded', function () {
        var dialogEl = document.getElementById('my-accessible-dialog');
        if(dialogEl) {
        var mainEl = document.getElementById('wrapper');
        var dialog = new window.A11yDialog(dialogEl, mainEl);
}
        // To manually control the dialog:
        // dialog.show()
        // dialog.hide()
      });
    }());







// cancel the <head> timeout as the JS has all loaded and the enhanced UI should show:
clearTimeout( fallbackTimeout ); 
document.documentElement.className += " js";
