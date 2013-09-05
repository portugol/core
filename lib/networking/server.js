var sys = require('sys'),
  events = require('events'),
  socketio = require('socket.io'),
  Graph = require('../graph'),
  util=require('util');

function Server(listener) {
  this.listener = listener;
  this.clients = [];
}

function GraphError(errorCode, parameters) {
  this.name="GraphError";
  this.code=errorCode;
  this.parameters=parameters||[];
}

GraphError.prototype = new Error();

sys.inherits(Server, events.EventEmitter);

Server.prototype.start = function() {
  var self = this;
  var defaultLng="en-US";
  var io = socketio.listen(self.listener, { log: false });

  io.sockets.on('connection', function (socket) {
    if(socket.lng===undefined){
      socket.lng=defaultLng;
      console.log("The language is set to "+socket.lng);
    }
    socket.graph = new Graph(socket);
    
    socket.on('setLng',function (lng){
      socket.lng=lng;
      socket.graph.setLanguage(lng);
      console.log("The language is set to "+lng);
    });

    socket.on('next', function (changeToAuto){
      changeToAuto=changeToAuto||false;
      //muda para execução sequencial automática
      if(changeToAuto){
        socket.graph.stepping=false;
      }
      try{
        socket.graph.step();
      }
      catch(e){
        console.log("The server catched an execution error");
        console.log(e.message);
      }
    });

    socket.on('inputFromIDE', function(input){
      try{
        socket.graph.readStep(input);
      }
      catch(e){
        console.log("The server catched an execution error");
        console.log(e);
      }
    });

    socket.graph.on('finished',function(){
      socket.emit('finished',{'actual':socket.graph.actualId,'previous': socket.graph.previousId,'memory':socket.graph.memory.vars, 'memoryChanged': socket.graph.memoryChanged});
      socket.graph.memoryChanged=false;
    });

    socket.graph.on('requestInput',function (varName){
      socket.emit('requestInput',varName);
    });

    socket.graph.on('validated', function(result){
      console.log("VALIDATED");
      //console.log(result);
      if(result.status===true){
        socket.emit('validated',result);
        console.log("Server detected successfully validated graph");
        if(result.isExecution){
          socket.graph.resetValues();
          try{
            socket.graph.step();
          }
          catch(e){
            console.log("The server catched an execution error");
            console.log(e);
          }
        }
      }
      else{
        console.log("VALIDATE ERROR");
        //DEBUG------
        for(var i=0; i<socket.graph.errors.length; i++){
          console.log(socket.graph.errors[i]);
        }
        //-----------
        socket.emit('validateErrors',socket.graph.errors);
      }
    });

    socket.graph.on('consoleUpdate',function(data){
      socket.emit('consoleUpdate',data);
    });

    socket.graph.on('skip', function() {
      if(socket.graph.stepping){

        socket.emit('highlight', {'actual':socket.graph.actualId,'previous': socket.graph.previousId, 'memory': JSON.stringify(socket.graph.memory.vars),'memoryChanged':socket.graph.memoryChanged});
        socket.graph.memoryChanged=false;
      }
      else {
        if(!socket.graph.abort){
          try{
            //console.log(socket.graph.stepNode);
            //process.nextTick(function() {
              socket.graph.step(); //executa o próximo passo
            //});
          }
          catch(e){
            console.log("The server catched an execution error");
            console.log(e);
          }
        }
        else{
          console.log("ABORTADO!!!!!!!");
          var uuid=socket.graph.previousNode.uuid;
          socket.graph.abort=false;
          socket.graph.stepping=false;
          socket.stepNode=undefined;
          socket.graph.memory.clearMemory();
          socket.graph.memoryChanged=false;
          socket.emit('executionAborted',uuid);
        }
      }
    });

    socket.graph.on('errorAbort', function (data){
      data.previous=socket.graph.actualId;
      data.memory=socket.graph.memory.vars;
      data.memoryChanged=socket.graph.memoryChanged;
      console.log("ERROR ABORT");
      console.log(data);
      socket.emit('executionError',data);
    });

    socket.on('validate',function (json){
      socket.graphs=jsonParse(json);
      if(socket.graphs!==undefined){
        try{
          socket.graph.val(socket.graphs[0].root,false);
        }
        catch(e){
          console.log("The server catched a validate error");
          console.log(e.message);
        }
      }
      else{
        var error=new GraphError("BAD_JSON");
        socket.emit('validateErrors',[{'uuid':undefined,'error': error}]);
      }
    });

    socket.on('execute', function (json) {
      socket.stepping=false;
      socket.graphs=jsonParse(json);
      socket.graphIndex=0;
      if(socket.graphs!==undefined){
           process.nextTick(function() {
          startExecution(socket);
        });
      }
      else{
        var error=new GraphError("BAD_JSON");
        socket.emit('validateErrors',[{'uuid':undefined,'error': error}]);
      }
      console.log("DANG");
    });

    socket.on('start',function (json) {
      socket.stepping=true;
      socket.graphs=jsonParse(json);
      socket.graphIndex=0;
      if(socket.graphs!==undefined){
        startExecution(socket);
      }
      else{
        var error=new GraphError("BAD_JSON");
        socket.emit('validateErrors',[{'uuid':undefined,'error':error}]);
      }
    });

    socket.on('stopExecution',function(){
      console.log("O SERVIDOR APANHOU!!!!!!!");
      if(socket.graph.stepping){
        var uuid=socket.graph.previousNode.uuid;
        socket.graph.stepping=false;
        socket.stepNode=undefined;
        socket.graph.memory.vars=[];
        socket.emit('executionAborted',uuid);
      }
      else{
     
          socket.graph.abort=true;
     
      }
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
  console.log("Server has started an execution");
  try{
    socket.graph.execute(socket.graphs[socket.graphIndex].root,socket.stepping);
  }
  catch(e){
    console.log("The server catched an execution error");
    console.log(e.message);
  }
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