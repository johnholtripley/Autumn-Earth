
var fs = require('fs');

var options = {
  key: fs.readFileSync('/home/autumnearth.com/ssl.key'),
  cert: fs.readFileSync('/home/autumnearth.com/ssl.cert'),
  ca: fs.readFileSync('/home/autumnearth.com/ssl.ca')
};

var app = require('https').createServer(options, handler),
io = require('socket.io').listen(app);

app.listen(8080);


function handler (req, res) {
      res.writeHead(200);
    res.end("<h1>hello</h1>\n");
    // is this needed? #########
}


var socket = io.listen(app);
// Add a connect listener
socket.on('connection', function(client){ 
  socket.emit('message', 'welcome - you are connected');
  console.log("socket connect success - listening...");
  // Success!  Now listen to messages to be received
  client.on('message',function(event){ 
    console.log('Received message from client!',event);
  });
  client.on('disconnect',function(){
 //   clearInterval(interval);
    console.log('Server has disconnected');
  });

});