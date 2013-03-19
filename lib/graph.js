var Node = require('./node'),
  Begin = require('./nodes/begin'),
  End = require('./nodes/end'),
  util = require('util');

var Graph = function(root) {
    this.memory = {};

    this.root = root;
    this.last = root;
};

Graph.prototype.validate = function(node) {
  var aux = this.root;
  if (node !== undefined) {
      aux = node;
  }

  if(aux instanceof Begin) {
    if(this.root !== undefined) {
      return false;
    } else {
      this.root = aux;
    }
  } else if(aux instanceof End) {
    if(this.last !== undefined) {
      return false;
    } else {
      this.last = aux;
    }
  }

  if (aux.next !== undefined) {
    return this.validate(aux.next);
  } else {
    return true;
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
            console.log("##########################");
            console.log("MEMORIA:");
            console.log(util.inspect(self.memory));
            /*
            console.log("VALOR:");
            console.log(self.memory.bt);

            if(self.memory.a != undefined && self.memory.b != undefined) {
              console.log("SOMA:");
              console.log(parseInt(self.memory.a));
            }
            */
        }
        if (aux.next !== undefined) {
            self.execute(aux.next);
        }
    });


    aux.execute();
};

module.exports = Graph;

