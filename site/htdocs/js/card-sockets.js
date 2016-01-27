// https://davidwalsh.name/websocket
// Create SocketIO instance, connect
/*
var socket = new io.Socket('www.autumnearth.com',{
	port: 8080
});
socket.connect(); 


*/


var socket = io.connect('www.autumnearth.com:8080');

console.log('Connected');
// Add a connect listener
socket.on('connect',function() {
	console.log('Client has connected to the server!');
});
// Add a connect listener
socket.on('message',function(data) {
	console.log('Received a message from the server!',data);
});
// Add a disconnect listener
socket.on('disconnect',function() {
	console.log('The client has disconnected!');
});

// Sends a message to the server via sockets
function sendMessageToServer(message) {
	socket.send(message);
}

sendMessageToServer("hi - connected in");

// successfully connecting and sending messages, but firefox reports
// "Firefox can't establish a connection to the server at wss://www.autumnearth.com:8080/socket.io/?EIO=3&transport=websocket&sid=Dl4Z1Co15rifYXs5AAAB" error