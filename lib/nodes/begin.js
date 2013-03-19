var Node = require('../node'),
        sys = require('sys');

var Begin = function() {
    this.data = "inicio";
};

sys.inherits(Begin, Node);

Begin.prototype.execute = function() {
  this.emit("done");
};

module.exports = Begin;

