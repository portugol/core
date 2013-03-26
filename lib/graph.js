var Node = require('./node'),
  Begin = require('./nodes/begin'),
  End = require('./nodes/end'),
  util = require('util'),
  Write = require('./nodes/write'),
  Read = require('./nodes/read'),
  Begin = require('./nodes/begin'),
  End = require('./nodes/end'),
  Definition = require('./nodes/definition'),
  sys = require('sys'),
  events = require('events');

var Graph = function(root) {
    this.memory = {};

    this.root = root;
    this.last = root;
};

sys.inherits(Graph, events.EventEmitter);

Graph.prototype.validate = function(node) {
  var aux = {};
  switch(node.type) {
    case Definition.BEGIN:
      if(this.root !== undefined) {
        throw "invalid";
      }
      aux = new Begin(node);
      this.root = aux;
      break;
    case Definition.END:
      if(this.end !== undefined || node.next !== undefined) {
        throw "invalid";
      }
      aux = new End(node);
      this.last = aux;
      break;
    case Definition.WRITE:
      aux = new Write(undefined, node);
      break;
    default:
        throw "invalid";
  }
  if(aux.type !== Definition.END) {
    aux.next = this.validate(node.next);
  }
  if(aux.type === Definition.BEGIN) {
    this.emit('validated');
  }
  return aux;
};

/*
Graph.prototype.validate = function(node) {
  var aux = this.root;
  if (node !== undefined) {
      aux = node;
  }

  if(aux.type === Definition.BEGIN) {
    if(this.root !== undefined) {
      return false;
    } else {
      this.root = new Begin();
    }
  } else if(aux.type === Definition.END) {
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
*/

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

    aux.on('done', function(data) {
        if (data !== undefined && data.memory !== undefined && data.memory === true) {
            self.memory[Object.keys(data.data)[0]] = data[Object.keys(data.data)[0]];
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
            self.emit('done', {});
        } else if(data !== undefined && data.memory !== undefined && data.memory === false) {
          self.emit('done', data.data);
        }
        if (aux.next !== undefined) {
            self.execute(aux.next);
        }
    });


    aux.execute();
};

module.exports = Graph;

