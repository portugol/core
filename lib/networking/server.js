var sys = require('sys'),
  events = require('events'),
  socketio = require('socket.io'),
  Graph = require('../graph'),
  util=require('util');

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
      var graph = new Graph();
      var self=this;
      try {
        graph.validate(data[0].root);
        //retornar true para o cliente
        self.emit('validate', {'result': true});
      } catch(e) {
        //retornar false para o cliente
        console.log(e);
        self.emit('validate', {'result': false, 'node': {}});
      }
    });

    socket.on('execute', function (data) {
      console.log('Executing...');
      data=JSON.parse(data);
      
      var graph= new Graph();
      var self=this;
      
      graph.on('consoleUpdate',function(data){
        self.emit('consoleUpdate',data);
      });
      
      graph.on('memoryUpdate',function(data){
        self.emit('memoryUpdate',data);
      });
      
      try {
        graph.validate(data[0].root);
        //console.log(graph.root);
        graph.execute();
        //console.log(graph.memory);
      } catch(e) {
        console.log(e);
        console.log("graph validate error");
      }/*
      graph.on('done', function (data) {
        socket.emit('done', data);
      });

      graph.on('validated', function () {
        console.log('Validated...');
        graph.execute();
      });

      graph.validate(data.root);*/
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