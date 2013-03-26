var Node = require('../node'),
        sys = require('sys'),
        Definition = require('./definition');

var End = function(node) {
  if (node !== undefined) {
    this.data = node.data;
    this.type = node.type;
  } else {
   this.data = "fim";
   this.type = Definition.END;
  }
};

sys.inherits(End, Node);

End.prototype.execute = function() {
  this.emit("done");
};

module.exports = End;
