var Node = require('../node'),
        sys = require('sys');

var End = function() {
     this.data = "fim";
};

sys.inherits(End, Node);

module.exports = End;
