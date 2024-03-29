function getLocalCoordinatesX(tileX) {
    if (!isOverWorldMap) {
        return tileX;
    } else {
        // get local map coordinates from global coordinates:
        return tileX % worldMapTileLength;
    }
}

function getLocalCoordinatesY(tileY) {
    if (!isOverWorldMap) {
        return tileY;
    } else {
        return tileY % worldMapTileLength;
    }

}

function findMapNumberFromGlobalCoordinates(tileX, tileY) {
    return worldMap[Math.floor(tileY / worldMapTileLength)][Math.floor(tileX / worldMapTileLength)];
}

function getPythagorasDistance(ax, ay, bx, by) {
    return Math.sqrt(((ax - bx) * (ax - bx)) + ((ay - by) * (ay - by)));
}

// https://mathiasbynens.be/notes/xhr-responsetype-json
var getJSON = function(url, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        // https://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
        if (xhr.readyState == 4) { // `DONE`
            status = xhr.status;
            var wasParsedOk = true;
            if (status == 200) {
                try {
                    data = JSON.parse(xhr.responseText);
                } catch (e) {
                    // JSON parse error:
                    wasParsedOk = false;
                    errorHandler && errorHandler(status);
                }
                if (wasParsedOk) {
                    successHandler && successHandler(data);
                }
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
};