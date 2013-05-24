var sys = require('sys'),
  events = require('events'),
  socketio = require('socket.io'),
  Graph = require('../graph');

function Server(listener) {
  this.listener = listener;
  this.clients = [];
}

sys.inherits(Server, events.EventEmitter);

Server.prototype.start = function() {
  var self = this;
  var io = socketio.listen(self.listener);

  io.sockets.on('connection', function (socket) {
    self.clients.push(socket);
    self.emit('connected', socket);

    socket.on('disconnect', function () {
      self.removeClient(this);
    });

    socket.on('flowchart', function (data) {
      data = JSON.parse(data);
      //console.log(data);
      var graph = new Graph();
      try {
        //graph.validate(data.root);
        var p = new Parser(graph);
        p.createPostfixStacks();
        //retornar true para o cliente
        this.emit('validate', {'result': true});
      } catch(e) {
        //retornar false para o cliente
        this.emit('validate', {'result': false, 'node': {}});
      }
    });

    socket.on('execute', function (data) {
      console.log('Executing...');
      data=JSON.parse(data);
      //console.log(data.root);
      var graph= new Graph();

      graph.on('done', function (data) {
        socket.emit('done', data);
      });

      graph.on('validated', function () {
        console.log('Validated...');
        graph.execute();
      });

      graph.validate(data.root);
    });
  });
};

Server.prototype.removeClient = function(rclient) {
  for(i = 0; i < this.clients.length; i++) {
    if(this.clients[i].id == rclient.id) {
      this.clients.splice(i, 1);
      i = this.clients.length+1;
    }
  }
};

module.exports = Server;