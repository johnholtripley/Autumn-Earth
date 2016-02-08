/*

TO DO:

have a unique URL for each room - first two connections are players, 3rd or after can only view
http://socket.io/docs/rooms-and-namespaces/


// successfully connecting and sending messages, but firefox reports
// "Firefox can't establish a connection to the server at wss://www.autumnearth.com:8080/socket.io/?EIO=3&transport=websocket&sid=Dl4Z1Co15rifYXs5AAAB" error

*/



isANetworkGame = true;

function startNetworkGame(whichPlayerStarts) {
    console.log(whichPlayerStarts);
  // need to determine if this player goes first or the opponent - socket will send this through
  // currentPlayersTurn = whoGoesFirst;
        whoCanClick = currentPlayersTurn;
    
      
        if (currentPlayersTurn == 1) {
            currentOpponent = 2;
          
        }
            gameMode = "play";
}

// ----------------------------

var socket = io.connect('https://www.autumnearth.com:8080');


// Add a connect listener
socket.on('connect', function() {
    console.log('Client has connected to the server');
    socket.emit('join','client has connected');
});


socket.on('messages', function(data) {
         alert('message: '+data);
   });

socket.on('broad', function(data) {
         alert('broadcast: '+data);
   });



