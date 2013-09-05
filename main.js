var Server = require('./lib/networking/server'),
  http_server = require('http').createServer(),
  ecstatic = require('ecstatic');

var static_server = ecstatic(__dirname + '/public');
http_server.on('request', static_server);

http_server.listen(8080, function(){
  console.log('HTTP Server booted...');
});

var comm_server = new Server(http_server);
comm_server.start();

