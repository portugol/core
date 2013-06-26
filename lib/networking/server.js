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
  var io = socketio.listen(self.listener, { log: false });

  io.sockets.on('connection', function (socket) {
    socket.graph = new Graph();
    socket.on('next', socket.graph.step);

    socket.on('inputFromIDE', function(input){
      socket.graph.readStep(input);
    });

    socket.graph.on('finished',function(uuid){
      socket.emit('finished',uuid);
    });

    socket.graph.on('requestInput',function(){
      socket.emit('requestInput');
    });

    socket.graph.on('validated', function(){
      socket.emit('validated');
      console.log("graph validated");
    });

    socket.graph.on('consoleUpdate',function(data){
      socket.emit('consoleUpdate',data);
    });
    
    socket.graph.on('memoryUpdate',function(data){
      socket.emit('memoryUpdate',data);
    });

    socket.graph.on('highlight',function(uuids){
      socket.emit('highlight',{'actual':uuids.actual,'previous':uuids.previous});
    });

    socket.graph.on('stepProcessed',function(){
        socket.emit('stepProcessed');
    });

    socket.graph.on('errors',function(){
      socket.emit('errors',socket.graph.errors);
    });

    socket.graph.on('skip', function(){
      if(socket.abort){
        socket.abort=false;
        var uuid=socket.graph.previousNode.uuid;
        socket.emit('executionAborted',uuid);
      }
      else{
        socket.graph.step.apply(); //executa o próximo passo
      }
    });

    socket.graph.on('errorAbort', function(error){
      socket.emit('errorAbort',error);
      /*socket.graph.memory.vars=[];
      socket.graph.root=undefined;
      socket.graph.stepNode=undefined;
      socket.graph.previousNode=undefined;*/
    });

    socket.on('execute', function (data) {
      var stepping=false;
      startExecution(socket,data,stepping);
    });

    socket.on('start',function (data) {
      var stepping=true;
      startExecution(socket,data,stepping);
    });

    socket.on('stopExecution',function(){
      if(socket.graph.stepping){
        var uuid=socket.graph.previousNode.uuid;
        socket.graph.stepping=false;
        socket.stepNode=undefined;
        socket.graph.memory.vars=[];
        socket.emit('executionAborted',uuid);
      }
      else{
        /*socket.graph.memory.vars=[];
        self.emit('memoryUpdate',JSON.stringify(socket.graph.memory.vars));
        socket.emit('executionAborted');*/
        console.log("coloca abort a true");
        socket.abort=true;
      }
      //socket.graph.stopExecution();
    });

    self.clients.push(socket);
    self.emit('connected', socket);
    console.log("Client connected!!");

    socket.on('disconnect', function () {
      console.log("Client disconnecting!!");
      self.removeClient(this);
    });

    socket.on('connect', function(){
      socket.abort=false;
    });

    socket.on('flowchart', function (data) {
      data = JSON.parse(data);
      var graph = new Graph(self);
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

function startExecution(socket,data,stepping){
  data=JSON.parse(data);
  try {
    socket.graph.execute(data[0].root,stepping);
  }
  catch(e) {
    console.log(e);
    console.log("graph validate error");
  }
}

module.exports = Server;