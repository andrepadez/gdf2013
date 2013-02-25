/// Create server

var server = require('http').createServer();


/// Serve static files

var ecstatic = require('ecstatic');
var serveStatic = ecstatic(__dirname + '/../browser');

server.on('request', serveStatic);


/// Listen

var port = 8080;
server.listen(8080, function() {
  console.log('HTTP server listening on port %d', port);
});