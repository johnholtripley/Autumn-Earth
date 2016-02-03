
// ----------------------
// helpers:

function getRandomInteger(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------



var fs = require('fs');


var options = {
    key: fs.readFileSync('/home/autumnearth.com/ssl.key'),
    cert: fs.readFileSync('/home/autumnearth.com/ssl.cert'),
    ca: fs.readFileSync('/home/autumnearth.com/ssl.ca')
};

var app = require('https').createServer(options, handler),
    io = require('socket.io').listen(app);

app.listen(8080);

function handler(req, res) {
    res.writeHead(200);
    res.end("<h1>hello</h1>\n");
    // is this needed? #########
}

var socket = io.listen(app);
// Add a connect listener:
socket.on('connection', function(client) {
    socket.emit('message', 'welcome - you are connected');
    console.log("socket connect success - listening...");
    console.log(io.engine.clientsCount + " open connections");
    // count connections:
    var activeConnections = io.engine.clientsCount;




// send the clients id to the client itself.
//  socket.io.engine.id
// http://stackoverflow.com/questions/6979992/how-to-get-session-id-of-socket-io-client-in-client

    switch (activeConnections) {
        case 1:
            // if 1 - send message to client saying "waiting for opponent"
            socket.emit('message', 'waiting for opponent...');
            break;
        case 2:
            // if 2 - determine who goes first and send that to both clients
            socket.emit('message', 'flipping coin...');

            whichPlayerStarts = getRandomInteger(1, 2);

            // send to just this socket:
            // socket.emit('start', 'player'+whichPlayerStarts);
            // send the opposite value to the first connecting socket:
            // ###
            // https://gist.github.com/alexpchin/3f257d0bb813e2c8c476
            break;
        default:
            // if 3 or more tell client they are in Spectator Mode
            socket.emit('message', 'you\'re in spectator mode');
    }
    // listen to messages to be received
    client.on('message', function(event) {
        console.log('Received message from client!', event);
    });
    client.on('disconnect', function() {
        console.log('player has disconnected');
    });
});
