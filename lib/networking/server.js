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

    socket.on('next', function(){
      try{
        socket.graph.step();
      }
      catch(e){
        console.log("The server catched execution error");
      }
    });

    socket.on('inputFromIDE', function(input){
      try{
        socket.graph.readStep(input);
      }
      catch(e){
        console.log("The server catched execution error");
      }
    });

    socket.graph.on('finished',function(){
      socket.emit('finished',{'actual':socket.graph.actualId,'previous': socket.graph.previousId,'memory':socket.graph.memory.vars});
    });

    socket.graph.on('requestInput',function (varName){
      socket.emit('requestInput',varName);
    });

    socket.graph.on('validated', function(result){
      if(result.status===true){
        socket.emit('validated');
        console.log("graph successfully validated");
        if(result.isExecution){
          socket.graph.resetValues();
          socket.graph.step();
        }
      }
      else{
        console.log(socket.graph.errors);
        socket.emit('errors',socket.graph.errors);
      }
    });

    socket.graph.on('consoleUpdate',function(data){
      socket.emit('consoleUpdate',data);
    });

    socket.graph.on('errors',function(){
      socket.emit('errors',socket.graph.errors);
    });

    socket.graph.on('skip', function() {
      console.log("SKIP");
      if(socket.graph.stepping){
        console.log("HIGHLIGHT");
        //socket.emit('highlight', {'actual':socket.graph.stepNode.uuid,'previous': socket.graph.previousNode.uuid, 'memory': JSON.stringify(socket.graph.memory.vars)});
        socket.emit('highlight', {'actual':socket.graph.actualId,'previous': socket.graph.previousId, 'memory': JSON.stringify(socket.graph.memory.vars)});
      } else {
        try{
          socket.graph.step(); //executa o próximo passo
        }
        catch(e){
          console.log("The server catched execution error");
        }
      }
    });

    socket.graph.on('errorAbort', function(error){
      error.previous=socket.graph.actualId;
      console.log("ERROR");
      console.log(error);
      socket.emit('errorAbort',error);
      /*socket.graph.memory.vars=[];
      socket.graph.root=undefined;
      socket.graph.stepNode=undefined;
      socket.graph.previousNode=undefined;*/
    });

    socket.on('validate',function (json){
      socket.graphs=jsonParse(json);
      if(socket.graphs!==undefined){
        socket.graph.val(graphs[0].root,false);
      }
    });

    socket.on('execute', function (json) {
      socket.stepping=false;
      socket.graphs=jsonParse(json);
      socket.graphIndex=0;
      if(socket.graphs!==undefined){
        startExecution(socket);
      }
    });

    socket.on('start',function (json) {
      socket.stepping=true;
      socket.graphs=jsonParse(json);
      socket.graphIndex=0;
      if(socket.graphs!==undefined){
        startExecution(socket);
      }
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
        //socket.abort=true;
        socket.graph.abort();
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
      console.log("connect....");
      socket.abort=false;
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

function startExecution(socket){
    socket.graph.execute(socket.graphs[socket.graphIndex].root,socket.stepping);
    console.log("Server has started an execution");
}

function jsonParse(json){
  try{
    return JSON.parse(json);
  }
  catch(e){
    console.log("Json parse Error. IDE has sent invalid JSON");
    return undefined;
  }
}

module.exports = Server;