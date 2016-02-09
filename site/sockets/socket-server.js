// ----------------------
// helpers:

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ----------------------

var fs = require('fs');
var express = require('express');
//var cookieParser = require('cookie-parser');
var session = require('express-session');

var options = {
    key: fs.readFileSync('/home/autumnearth.com/ssl.key'),
    cert: fs.readFileSync('/home/autumnearth.com/ssl.cert'),
    ca: fs.readFileSync('/home/autumnearth.com/ssl.ca')
};

var app = express();

var server = require('https').createServer(options, app);
io = require('socket.io')(server);

app.use(express.static(__dirname));

//app.use(cookieParser());
app.use(session({
    secret: 'D5fgftyYsw3DFgu8H',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Access the session as req.session
app.get('/', function(req, res, next) {
    var sess = req.session;
    // set cookie to exist for an hour:
    var hour = 3600000
    req.session.cookie.expires = new Date(Date.now() + hour);
    if (sess.views) {
        sess.views++
            res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + sess.views + '</p>')
        res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
        res.write('<p>id: ' + (sess.id) + '</p>')
        res.end()
    } else {
        sess.views = 1
        res.end('welcome to the session demo. refresh!')
    }
});


server.listen(8080);

io.on('connection', function(client) {
    // count connections:
    var activeConnections = io.engine.clientsCount;
    var latestSessionId = ''
    client.on('join', function(data) {
        // send message to the client that just connected:
        switch (activeConnections) {
            case 1:
                // if 1 - send message to just connected client saying "waiting for opponent"
                client.emit('messages', 'waiting for opponent (#'+latestSessionId+')');
                break;
            case 2:
                // if 2 - determine who goes first and send that to both clients
                client.emit('messages', 'flipping coin (#'+latestSessionId+')');
                client.broadcast.emit('broad', 'second player has joined');
                var whichPlayerStarts = getRandomInteger(1,2);
                break;
            default:
                // if 3 or more tell client they are in Spectator Mode
                client.emit('messages', 'game in progress - you\'re in spectator mode (#'+latestSessionId+')');
        }
    });
    client.on('messages', function(data) {
        // send message to all sockets except the sender:
        client.broadcast.emit('broad', data);
    });
});
