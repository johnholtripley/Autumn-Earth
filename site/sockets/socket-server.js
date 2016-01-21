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