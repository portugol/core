var Node = require('../node'),
        sys = require('sys');

var End = function() {
     this.data = "fim";
};

sys.inherits(End, Node);

End.prototype.execute = function() {
  this.emit("done");
};

module.exports = End;
