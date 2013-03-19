var Graph = require('./lib/graph'),
        Node = require('./lib/node'),
        Write = require('./lib/nodes/write'),
        Read = require('./lib/nodes/read'),
        Begin = require('./lib/nodes/begin'),
        End = require('./lib/nodes/end');

var g1 = new Graph();

g1.add(new Begin());
g1.add(new Read('a'));
g1.add(new Read('b'));
g1.add(new End());

console.log(g1.toString());

g1.execute();

console.log("VALIDATE:");
console.log(g1.validate());

