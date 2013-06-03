var Node = require('../node'),
  sys = require('sys'),
  Definition = require('./definition');

 var Join = function(data, node) {
  if (node !== undefined) {
    this.data = node.data;
    this.type = node.type;
  }
  else {
    this.data = data;
    this.type = Definition.JOIN;
  }
};

sys.inherits(Join, Node);

Join.prototype.execute = function() {
  this.emit("done");
};

module.exports = Join;
