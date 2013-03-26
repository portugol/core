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
        graph.validate(data.root);
        this.emit('validate', {'result': true});
      } catch(e) {
        this.emit('validate', {'result': false, 'node': {}});
      }
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