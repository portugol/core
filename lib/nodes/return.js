var Node = require('../node'),
  sys = require('sys'),
  Definition = require('./definition');

 var Return = function(data, node) {
  if (node !== undefined) {
    this.data = node.data;
    this.type = node.type;
    this.uuid = node.uuid;
  }
  else {
    this.data = data;
    this.type = Definition.RETURN;
  }
};

sys.inherits(RETURN, Node);

Return.prototype.execute = function() {
  this.emit("done");
};

module.exports = Return;
