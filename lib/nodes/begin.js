var Node = require('../node'),
        sys = require('sys');

var Begin = function() {
    this.data = "inicio";
};

sys.inherits(Begin, Node);

module.exports = Begin;

