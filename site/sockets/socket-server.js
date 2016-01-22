
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
}
