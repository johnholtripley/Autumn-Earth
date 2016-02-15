// font face loader:
// https://helloanselm.com/2015/using-webfonts-in-2015/




    var fontObservers = [];
    var fontFamilies = {
        'Merriweather': [
            {
                weight: 400
            },
            {
                weight: 400,
                style: "italic"
            }
        ],
        
        'AlegreyaSC': [
            {
                weight: 400
            }
        ]
    }

    Object.keys(fontFamilies).forEach(function(family) {
        fontObservers.push(fontFamilies[family].map(function(config) {
            return new FontFaceObserver(family, config).check()
        }));
    });

    Promise.all(fontObservers)
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

// accessible modal:
(function () {
      document.addEventListener('DOMContentLoaded', function () {
        var modalEl = document.getElementById('my-accessible-modal');
        var mainEl = document.getElementById('wrapper');
        var modal = new window.Modal(modalEl, mainEl);

        // To manually control the modal:
        // modal.show()
        // modal.hide()
      });
    }());