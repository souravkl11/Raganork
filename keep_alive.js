var http = require('http');
http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(5000, '0.0.0.0');
