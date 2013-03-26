var Node = require('../node'),
  sys = require('sys'),
  Definition = require('./definition');

var Begin = function(node) {
    if (node !== undefined) {
      this.data = node.data;
      this.type = node.type;
    } else {
      this.data = "inicio";
      this.type = Definition.BEGIN;
    }
};

sys.inherits(Begin, Node);

Begin.prototype.execute = function() {
  this.emit("done");
};

module.exports = Begin;

