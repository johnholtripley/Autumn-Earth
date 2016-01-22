/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/template.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
  	// send to all except sender:
  	// http://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender-socket-io#answer-10099325
    socket.broadcast.emit('chat message', msg);
  });
});


http.listen(8080, function(){
  console.log('listening on *:8080');
});

*/

// Require HTTP module (to start server) and Socket.IO
var http = require('http'), io = require('socket.io');

// Start the server at port 8080
var server = http.createServer(function(req, res){ 

  // Send HTML headers and message
  res.writeHead(200,{ 'Content-Type': 'text/html' }); 
  res.end('<h1>Hello Socket Lover!</h1>');
});
server.listen(8080);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

// Add a connect listener
socket.on('connection', function(client){ 
  
  // Success!  Now listen to messages to be received
  client.on('message',function(event){ 
    console.log('Received message from client!',event);
  });
  client.on('disconnect',function(){
    clearInterval(interval);
    console.log('Server has disconnected');
  });

});