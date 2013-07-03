/*
A classe GRAPH representa o conjunto de elementos que constituem o Fluxograma.
Funciona como uma lista simplesmente ligada.
Cada elemento da lista tem um ponteiro para o elemento seguinte representado pelo atributo NEXT
Existem ainda ponteiros para o elemento inicial e final representados respectivamente pelos atributos ROOT e LAST

Tem como atributos:
  -memory: memória
  -root: primeiro elemento
  -last: último elemento
*/

//Importação de bibliotecas
var Node = require('./node'),
  Begin = require('./nodes/begin'),
  End = require('./nodes/end'),
  util = require('util'),
  Write = require('./nodes/write'),
  Read = require('./nodes/read'),
  Begin = require('./nodes/begin'),
  End = require('./nodes/end'),
  Process = require('./nodes/process'),
  If = require('./nodes/if'),
  Join = require('./nodes/join'),
  Definition = require('./nodes/definition'),
  sys = require('sys'),
  events = require('events'),
  Memory = require('./memory'),
  Evaluator = require('core-parser').Evaluator,
  Expression = require('core-parser').Expression;
  tokenTypes = require('core-parser/definitions/token_types');
  clone = require('clone');

var Graph = function(socket) {
    var self = this;
    this.stepping = false;
    this.memory = new Memory();
    this.evaluator = new Evaluator(Definition,this.memory,false);
    this.console = "";
    this.joinNodes=[];
    this.errors=[];

    //executado quando recebe input do IDE
    this.readStep = function(input){
      if(input==="" || input===undefined || input===null){
        console.log("Empty input in READ");
        this.emit('errorAbort',{'uuid':this.stepNode.uuid,'message':"Não introduziu conteúdo no nó de Leitura"});
        throw new Error("Empty input in READ");
      }
      //cria stack pos fixa
      this.stepNode.postfixStack = new Expression(Definition).toPostfix(input,this.stepNode.type);
      //calcula o resultado através do pos fixo
      try {
        this.evaluate(this.stepNode,this.level);
      }
      catch(e){
        console.log("Evaluator error in READ");
        throw e; //lança erro para parar a execução
      }
      this.uuidUpdate();
      this.previousNode=this.stepNode;
      this.stepNode=this.stepNode.next; //passa ao próximo nó
      if(this.stepping){
        self.emit('memoryUpdate', JSON.stringify(this.memory.vars));
        //self.emit('stepProcessed');
        self.emit('skip');
      }
      else{
        //this.step.apply();
        this.emit("skip");
      }
    };

    this.step = function() {
      //try{
        if(self.stepNode!==undefined) {
          //console.log("STEP");

          switch(self.stepNode.type) {
            case Definition.BEGIN:
              break;
            case Definition.PROCESS:
              try {
                self.evaluate(self.stepNode,self.level);
              } catch(e){
                console.log("Evaluator error in PROCESS");
                throw e;
              }
              break;
            case Definition.IF:
                self.previousWasIf=true;
                self.comeFromIf=true;
                self.level++;
                try{
                  var boolResult=self.evaluate(self.stepNode,self.level);
                }
                catch(e){
                  console.log("Evaluator error in IF");
                  throw new Error("Evaluator error in IF");
                }
                if(boolResult===true){
                  self.uuidUpdate();
                  self.previousNode=self.stepNode;
                  self.stepNode=self.stepNode.nexttrue;
                }
                else if(boolResult===false){
                  self.uuidUpdate();
                  self.previousNode=self.stepNode;
                  self.stepNode=self.stepNode.nextfalse;
                }
                else {
                  this.emit('errorAbort',{'uuid':this.stepNode.uuid,'message':"O expressão do nó IF não tem um resultado boleano"});
                  throw new Error("O no IF nao tem um resultado boolean");
                }
              break;
            case Definition.JOIN:
              //node.times guarda o número de nós que apontam para o JOIN.
              //quando times é igual a 1 singnifica que apenas há uma seta a pontar para o JOIN
              //logo o nó é ignorado.
              if(self.level>0 && self.stepNode.times>1){
                //self.clearLevelMemory(self.level);
                for (var i = 0; i < self.memory.vars.length; ++i) {
                  if (self.memory.vars[i].level_==self.level) {
                      self.memory.vars.splice(i--, 1);
                  }
                }
                if(self.stepping){
                  self.emit('memoryUpdate', JSON.stringify(self.memory.vars));
                }
                self.level--;
              }
              self.comeFromIf=false;
              break;
            case Definition.WRITE:
              try{
                self.console=self.evaluate(self.stepNode,self.level);
                self.emit('consoleUpdate', self.console);
              } catch(e){
                console.log("Evaluator error in WRITE");
                throw e;
              }
              break;
            case Definition.READ:
              self.emit("requestInput",self.stepNode.data);
              return false;
              break;
            case Definition.END:
              if(self.stepping){
                self.clearMemory();
              }
              self.uuidUpdate();
              self.emit('finished');
              console.log("TERMINOU O FLUXOGRAMA");
              return true; //terminou
          }

          if(!self.previousWasIf && self.stepNode.type!=Definition.READ) {
              self.uuidUpdate();
              self.previousNode=self.stepNode;
              self.stepNode=self.stepNode.next;
          }
          self.previousWasIf=false;
          self.emit('skip',self.abort);
        }
        else{
          throw new Error("O NODE E UNDEFINED NO EXECUTE");
        }
        return false; //ainda nao terminou
    };
};//fecha construtor

//relação de herança com o EventEmitter para usar eventos
sys.inherits(Graph, events.EventEmitter);

Graph.prototype.val = function(node,isExecution) {
  this.root=undefined;
  //limpar hashtable dos joins. IMPORTANTE para repetir a execução do mesmo
  //fluxograma com valores actualizados
  this.clearJoin();
  this.clearErrors();
  if(node===null || node ===undefined){
      this.addError("O fluxograma não é válido. Falta o nó Início.");
      this.emit('validated',{'status':false,'isExecution':true});
  }
  else{
    try{
      this.validate(node,undefined,isExecution);
    }
    catch(e){
      this.errors.push({'uuid':undefined,'message':"Ocorreu um erro inesperado ao validar o fluxograma"});
      this.emit('validated',{'status':false, 'isExecution':isExecution});
      throw e;
    }
  }
};

Graph.prototype.uuidUpdate = function(){
  this.previousId=this.actualId;
  this.actualId=this.stepNode.uuid;
};

Graph.prototype.validate = function(node, uuid, isExecution) {
  console.log("VALIDATE METHOD");
  var aux = {};
  if(node===undefined){
    this.addError("O fluxograma não é válido. Faltam ligações",uuid);
  }
  else{
    //Verificação do tipo de elemento
    switch(node.type) {
      
      case Definition.BEGIN:
        if(this.root !== undefined) {
          this.addError("O fluxograma não é válido. Já existe um nó Início");
        }
        aux = new Begin(node);
        this.root = aux;
        break;

      case Definition.END:
        if(this.root === undefined){
          this.addError("O fluxograma não é válido. Não existe um nó Início");
          throw new Error("Graph has not root node");
        }
        if(this.end !== undefined){
          this.addError("O fluxograma não é válido. Já existe um nó Fim");
          throw new Error("Graph already has End node");
        }
        if(node.next !== undefined){
          this.addError("O fluxograma não é válido. Não pode haver nós para além do Fim");
          throw new Error("Graph End Node has a next Node");
        }
        aux = new End(node);
        this.last = aux;
        break;

      case Definition.WRITE:
        if(this.root === undefined) {
          this.addError("O fluxograma não é válido. Não existe um nó Início");
          throw new Error("O fluxograma não é válido. Não existe um nó Início");
        }
        aux = new Write(node.data, node);
        try{
          aux.postfixStack=new Expression(Definition).toPostfix(node.data.toString(),node.type);
        }
        catch(e){
          this.addError(e.message,aux.uuid);
        }
        break;

      case Definition.READ:
        if(this.root === undefined) {
          this.addError("O fluxograma não é válido. Não existe um nó Início");
          throw new Error("O fluxograma não é válido. Não existe um nó Início");
        }
        //verificar se o nó ler tem apenas uma variável no seu conteúdo
        var readContent=node.data;
        var contentPostfix;
        try{
          contentPostfix=new Expression(Definition).toPostfix(node.data.toString(),node.type);
          if(contentPostfix.length==1 && contentPostfix[0].type_==tokenTypes.VAR){
          aux = new Read(node);
          }
          else{
              this.addError("O nó de Leitura só deve conter apenas uma variável, onde será guardado o resultado.",node.uuid);
          }
        }
        catch(e){
          this.addError(e.message,node.uuid);
        }
        break;

      case Definition.PROCESS:
        if(this.root === undefined) {
          this.addError("O fluxograma não é válido. Não existe um nó Início");
          throw new Error("O fluxograma não é válido. Não existe um nó Início");
        }
        aux = new Process(node.data, node);
        try{
          aux.postfixStack=new Expression(Definition).toPostfix(node.data.toString(),node.type);
        }
        catch(e){
          this.errors.push({'uuid':aux.uuid,'message':e.message});
        }
        break;

      case Definition.IF:
        if(this.root === undefined) {
          this.addError("O fluxograma não é válido. Não existe um nó Início");
          throw new Error("O fluxograma não é válido. Não existe um nó Início");
        }
        var ifNode=this.getJoin(node.uuid);
        //verifica se o nó já foi encontrado anteriormente (loop)
        if(ifNode!==undefined){
          return ifNode;
        }
        else{
          aux = new If(node.data, node);  
          try{
            aux.postfixStack=new Expression(Definition).toPostfix(node.data.toString(),node.type);
          }
          catch(e){
            this.errors.push({'uuid':aux.uuid,'message':e.message});
          }
          this.addJoin(node.uuid,aux);
        }
        if(node.nexttrue!==undefined){
          aux.nexttrue=this.validate(node.nexttrue,aux.uuid,isExecution);
        }
        if(node.nextfalse!==undefined){
          aux.nextfalse=this.validate(node.nextfalse,aux.uuid,isExecution);
        }
        break;

      case Definition.JOIN:
        if(this.root === undefined) {
          this.addError("O fluxograma não é válido. Não existe um nó Início");
          throw new Error("O fluxograma não é válido. Não existe um nó Início");
        }
        var joinNode=this.getJoin(node.uuid);
        if(joinNode!==undefined){
          joinNode.times++;
          return joinNode;
          //return master;
        }
        else{
          aux = new Join(node.data, node);
          aux.times++;
          this.addJoin(node.uuid,aux);
        }
        break;

      default:
        console.log(node);
        throw new Error("Tipo de nó desconhecido");
    }

    //Se o nó não é do tipo END chama o método validate recursivamente para validar o próximo nó
    if(aux.type !== Definition.END && aux.type !== Definition.IF) {
      aux.next = this.validate(node.next,aux.uuid,isExecution);
    }
    /*Depois de percorrer todos os nós e verificar que o grafo é válido emite um envento "validated"
      Visto que ficaram pendentes outros nós devido à recursividade e só é pretendido emitir um evento
      é feita uma verificação.
      Esta vereficação certifica que o evento só é emitido no nó BEGIN, ou seja,
      depois de retornar todos os restantes nós.
    */
    if(aux.type === Definition.BEGIN) {
      //this.emit('validated',{'status':true});
      if(this.errors.length>0){
        this.emit('validated',{'status':false,'isExecution':isExecution});
      }
      else{
        this.emit('validated',{'status':true,'isExecution':isExecution});
      }
    }
    return aux;
  }
};

Graph.prototype.addError=function(message,uuid){
  this.errors.push({'uuid':uuid,'message':message});
};

Graph.prototype.getJoin=function(uuid){
  return this.joinNodes[uuid];
};

Graph.prototype.addJoin=function(uuid,node){
  this.joinNodes[uuid]=node;
};

Graph.prototype.clearJoin=function(uuid){
  this.joinNodes=[];
};

Graph.prototype.toString = function() {
    return util.inspect(this, true, 99, true);
};

Graph.prototype.add = function(node) {
    //Se o grafo ainda não tem root o nó recebido passa a ser root e last em simultâneo.
    if (this.root === undefined) {
        this.root = node;
        this.last = this.root;
    }
    //Se o grafo já tem root o nó recebido fica depois do último. O grafo é actualizado
    else {
        this.last.next = node;
        this.last = node;
    }
};

Graph.prototype.clone = function(obj) {
  return clone(obj);
};

Graph.prototype.evaluate = function(node,level){
  var nodeClone =this.clone(node); //cópia do objecto
  try{
    return this.evaluator.evaluate(nodeClone,level);
  }
  catch(e){
    this.emit('errorAbort',{'uuid':this.stepNode.uuid,'message':e.message});
    throw e; //lança erro para parar a execução
  }
};

Graph.prototype.execute = function(jsonRoot,stepping) {
  console.log("Executing Graph");
  this.stepping=stepping;
  this.clearErrors();
  try{
    this.val(jsonRoot,true);
  }
  catch(e){
    throw e;
  }
};

Graph.prototype.resetValues = function(){
  this.previousNode=undefined;
  this.stepNode=this.root;
  this.level=0;
  this.console="";
  this.comeFromIf=false;
  this.clearMemory();
};

Graph.prototype.clearErrors = function(){
  this.errors=[];
};

Graph.prototype.clearMemory = function(){
  this.memory.vars=[];
};

//Exportação de objectos GRAPH
module.exports = Graph;

