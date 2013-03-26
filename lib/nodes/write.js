var Node = require('../node'),
        sys = require('sys'),
        Definition = require('./definition');

var Write = function(data, node) {
  if (node !== undefined) {
    this.data = node.data;
    this.type = node.type;
  } else {
    this.data = data;
    this.type = Definition.WRITE;
  }
};

sys.inherits(Write, Node);

Write.prototype.execute = function() {
    console.log(this.data);
    this.emit("done");
};

module.exports = Write;

