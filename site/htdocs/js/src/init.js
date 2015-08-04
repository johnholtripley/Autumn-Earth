// font face loader:


var observer = new FontFaceObserver( "forolight" )
    .check()
    .then( function(){
        document.documentElement.className += " fontsLoaded";
    });