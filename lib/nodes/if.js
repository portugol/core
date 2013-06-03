var Node = require('../node'),
  sys = require('sys'),
  Definition = require('./definition');

 var If = function(data, node) {
  this.hasExpr=true;
  if (node !== undefined) {
    this.data = node.data;
    this.type = node.type;
  }
  else {
    this.data = data;
    this.type = Definition.IF;
  }
};

sys.inherits(If, Node);

If.prototype.execute = function() {
  this.emit("done");
};

module.exports = If;