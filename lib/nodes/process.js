var Node = require('../node'),
  sys = require('sys'),
  Definition = require('./definition');

 var Process = function(data,node) {
  this.hasExpr=true;
  if (node !== undefined) {
    this.data = node.data;
    this.type = node.type;
    this.uuid = node.uuid;
  }
  else {
    this.data = data;
    this.type = Definition.PROCESS;
  }
};

sys.inherits(Process, Node);

Process.prototype.execute = function() {
  this.emit("done");
};

module.exports = Process;
