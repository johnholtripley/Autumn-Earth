// ----------------------
// helpers:

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------

var fs = require('fs');
var express = require('express');
var options = {
    key: fs.readFileSync('/home/autumnearth.com/ssl.key'),
    cert: fs.readFileSync('/home/autumnearth.com/ssl.cert'),
    ca: fs.readFileSync('/home/autumnearth.com/ssl.ca')
};

var app = express();

var server = require('https').createServer(options, app);
io = require('socket.io')(server);

app.use(express.static(__dirname));
server.listen(8080);

io.on('connection', function(client) {
    // count connections:
    var activeConnections = io.engine.clientsCount;
    client.on('join', function(data) {
        // send message to the client that just connected:
        switch (activeConnections) {
            case 1:
                // if 1 - send message to just connected client saying "waiting for opponent"
                client.emit('messages', 'waiting for opponent');
                break;
            case 2:
                // if 2 - determine who goes first and send that to both clients
                client.emit('messages', 'flipping coin');
                client.broadcast.emit('broad', 'second player has joined');
                break;
            default:
                // if 3 or more tell client they are in Spectator Mode
                client.emit('messages', 'game in progress - you\'re in spectator mode');
        }
    });
    client.on('messages', function(data) {
        // send message to all sockets except the sender:
        client.broadcast.emit('broad', data);
    });
});
