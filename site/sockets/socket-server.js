
var fs = require('fs');

var options = {
  key: fs.readFileSync('/etc/ssl/private/autumnearth.com.key'),
  cert: fs.readFileSync('/etc/ssl/certs/autumnearth.com.crt'),
  ca: fs.readFileSync('/etc/ssl/certs/ca-bundle.crt')
};

var app = require('https').createServer(options, handler),
io = require('socket.io').listen(app);

app.listen(8080);


function handler (req, res) {
      res.writeHead(200);
    res.end("<h1>hello</h1>\n");
}
