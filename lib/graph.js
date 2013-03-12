var Node = require('./node'),
        util = require('util');

var Graph = function(root) {
    this.memory = {};
    if (this.root === undefined) {
        this.root = undefined;
        this.last = undefined;
    } else {
        this.root = root;
        this.last = root;
    }
};

Graph.prototype.toString = function() {
    return util.inspect(this, true, 99, true);
};

Graph.prototype.add = function(node) {
    if (this.root === undefined) {
        this.root = node;
        this.last = this.root;
    } else {
        this.last.next = node;
        this.last = node;
    }

    //console.log(util.inspect(this, true, 7, true));
};

Graph.prototype.execute = function(node) {
    var aux = this.root;
    if (node !== undefined) {
        aux = node;
    }

    var self = this;

    //console.log("EXECUTING:");
    //console.log(util.inspect(aux, true, 7, true));

    aux.on("done", function(data) {
        if (data !== undefined) {
            self.memory[Object.keys(data)[0]] = data[Object.keys(data)[0]];
            console.log(util.inspect(self.memory));
        }
        if (aux.next !== undefined) {
            self.execute(aux.next);
        }
    });


    aux.execute();
};

module.exports = Graph;

