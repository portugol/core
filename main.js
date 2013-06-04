var Graph = require('./lib/graph'),
  Node = require('./lib/node'),
  Write = require('./lib/nodes/write'),
  Read = require('./lib/nodes/read'),
  Begin = require('./lib/nodes/begin'),
  End = require('./lib/nodes/end'),
  Server = require('./lib/networking/server'),
  http_server = require('http').createServer(),
  ecstatic = require('ecstatic');



/*
var g1 = new Graph();

g1.add(new Begin());
g1.add(new Write('Ola mundo'));
g1.add(new End());

console.log(g1.toString());

//g1.execute();

console.log("VALIDATE:");
console.log(g1.validate());

*/


var static_server = ecstatic(__dirname + '/public');
http_server.on('request', static_server);

http_server.listen(8080, function(){
  console.log('HTTP Server booted...');
});

var comm_server = new Server(http_server);
comm_server.start();

