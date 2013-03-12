var Node = require('../node'),
        sys = require('sys');

var Write = function(data) {
    this.data = data;
};

sys.inherits(Write, Node);

Write.prototype.execute = function() {
    console.log(this.data);
    this.emit("done");
};

module.exports = Write;

