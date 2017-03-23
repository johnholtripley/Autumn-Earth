onmessage = function(e) {

    switch (e.data[0]) {
        case 'shop':
        console.log('web worker is looking for a shop');
            var thisNPC = e.data[1];
            var thisMapData = e.data[2];

            postMessage([thisNPC.name,["n","n","e","endPath"]]);
            break;
    }
}
