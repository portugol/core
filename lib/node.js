var sys = require('sys'),
        events = require('events');

var Node = function (data) {
    this.data = data;
};

sys.inherits(Node, events.EventEmitter);

Node.prototype.execute = function() {};

module.exports = Node;

