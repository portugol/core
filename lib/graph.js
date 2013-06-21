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
  //Evaluator = require('core-parser').Evaluator,
  //Expression = require('core-parser').Expression;
  Evaluator=require('../../core-parser/evaluator'),
  Expression = require('../../core-parser/expression');

//Construtor de objectos GRAPH. Recebe como parâmetro o elemento inicial do fluxograma
var Graph = function() {
    var self = this;
    this.memory = new Memory();
    this.evaluator = new Evaluator(Definition,this.memory);
    this.console = "";
    //this.root = root;
    //this.last = root;
    
    this.joinNodes=[];

    this.readStep = function(input){
      //cria stack pos fixa
      this.stepNode.postfixStack = new Expression(Definition).toPostfix(input,this.stepNode.type);
      //calcula o resultado através do pos fixo
      this.evaluate(this.stepNode,this.level);
      this.stepNode=this.stepNode.next; //passa ao próximo nó
      self.emit('memoryUpdate', JSON.stringify(this.memory.vars));
      self.emit('stepProcessed');

    };

    this.step = function() {
      self.emit('highlight',self.stepNode.uuid);
      if(self.stepNode!==undefined){
        console.log("NEXT");

        var orig = self.stepNode; //guarda no original
        switch(self.stepNode.type) {
          case Definition.BEGIN:
            break;
          case Definition.PROCESS:
            self.evaluate(self.stepNode,self.level);
            self.emit('memoryUpdate', JSON.stringify(self.memory.vars));
            break;
          case Definition.IF:
            self.previousWasIf=true;
            self.comeFromIf=true;
            self.level++;
            var boolResult=self.evaluate(self.stepNode,self.level);
            if(boolResult===true){
              self.stepNode=self.stepNode.nexttrue;
            } else if(boolResult===false){
              self.stepNode=self.stepNode.nextfalse;
            } else {
              throw "O no IF nao tem um resultado boolean";
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
              self.emit('memoryUpdate', JSON.stringify(self.memory.vars));
              self.level--;
            }
            self.comeFromIf=false;
            break;
          case Definition.WRITE:
            self.console=self.evaluate(self.stepNode,self.level);
            self.emit('consoleUpdate', self.console);
            break;
          case Definition.READ:
            this.emit("requestInput");
        }

        //if(orig.type != Definition.IF) {
        //
        //se o nó for do tipo IF não tem NEXt, mas tem NEXTRUE e NEXTFALSE, portanto nao entra
        //se o nó for do tipo READ primeiro tem de receber o input por isso não entra
        if(!self.previousWasIf && self.stepNode.type!=Definition.READ) {
          self.stepNode=self.stepNode.next;
          if(self.stepNode===undefined){
            self.memory.vars=[];
            self.emit('memoryUpdate',JSON.stringify(self.memory.vars));
            self.emit('finished');
          }
        }
        self.previousWasIf=false;
        self.emit('stepProcessed');
      }
      else{
        throw "O NODE E UNDEFINED NO EXECUTE";
        //console.log("TERMINOU O FLUXOGRAMA");
        //self.emit('finished');
      }
    }; //array auxiliar que guarda nós do tipo JOIN  
};

//relação de herança com o EventEmitter para usar eventos
sys.inherits(Graph, events.EventEmitter);

Graph.prototype.val = function(node) {
  this.root=undefined;
  //limpar hashtable dos joins. IMPORTANTE para repetir a execução do mesmo
  //fluxograma com valores actualizados
  this.clearJoin(); 
  this.validate(node);
};

/*Método VALIDATE
  Este método percorre recursivamente os elementos do grafo para verificar se este é válido.
  O grafo é considerado válido se contiver um e só um elemento BEGIN e END e estes forem os elementos inicial e final, respectivamente.
  Se for inválido lança uma excepção INVALID.
*/
Graph.prototype.validate = function(node) {
  var aux = {};
  //Verificação do tipo de elemento
  switch(node.type) {
    //O elemento é do tipo BEGIN
    case Definition.BEGIN:
      if(node===undefined){
        throw "Nao existe no de inicio";
      }
      //Se já foi encontrdo um elemento BEGIN lança uma excepção INVALID
      if(this.root !== undefined) {
        throw "invalid";
      }
      //Se ainda não encontrou um elemento BEGIN é criado e definido como ROOT
      aux = new Begin(node);
      this.root = aux;
      break;

    //O elemento é do tipo END
    case Definition.END:
      //Se ainda não foi encontrado um BEGIN ou já encontrou um END ou existem elementos para além do final. É lançada uma excepção
      //NOTA: FOI ACRESCENTADO A PRIMEIRA VERIFICAÇÃO PARA O CASO DE NAO TER SIDO ENCONTRADO ANTERIORMENTE UM BEGIN
      if(this.root === undefined || this.end !== undefined || node.next !== undefined) {
        throw "invalid";
      }
      //Ainda não foi encontrado um END. É criado e definido como LAST
      aux = new End(node);
      this.last = aux;
      break;

    //O elemento é do tipo WRITE
    case Definition.WRITE:
      //Se ainda não existe um root do tipo BEGIN
      //NOTA: ESTA VERIFICAÇÃO FOI ACRESCENTADA PARA O CASO DE NAO TER SIDO ENCONTRADO ANTERIORMENTE UM BEGIN
      if(this.root === undefined) {
        throw "invalid";
      }
      //cria um objecto WRITE. Passa por parâmetro o atributo node para adquirir o seu conteúdo no construtor.
      aux = new Write(node.data, node);
      aux.postfixStack=new Expression(Definition).toPostfix(node.data.toString(),node.type);
      break;

    case Definition.READ:
      if(this.root === undefined) {
        throw "invalid";
      }
      aux = new Read(node.data);
      break;

    case Definition.PROCESS:
      if(this.root === undefined) {
        throw "invalid";
      }
      aux = new Process(node.data, node);
      aux.postfixStack=new Expression(Definition).toPostfix(node.data.toString(),node.type);
      break;
    case Definition.IF:
      if(this.root === undefined) {
        throw "invalid";
      }
      /*
      var ifNode=this.hashtable.get(node.uuid);
      if(ifNode!==undefined){
        return ifNode;
      }
      else{
        aux = new Join(node.data, node);
        this.hashtable.put(node.uuid, {'value':node});
      }*/

      var ifNode=this.getJoin(node.uuid);
      if(ifNode!==undefined){
        return ifNode;
      }
      else{
        aux = new If(node.data, node);
        aux.postfixStack=new Expression(Definition).toPostfix(node.data.toString(),node.type);
        this.addJoin(node.uuid,aux);
      }
      
      if(node.nexttrue!==undefined){
        aux.nexttrue=this.validate(node.nexttrue);
      }
      if(node.nextfalse!==undefined){
        aux.nextfalse=this.validate(node.nextfalse);
      }
      break;
    case Definition.JOIN:
      if(this.root === undefined) {
        throw "invalid";
      }
      //se o no join existir na lista é usado senao é adicionado
       
      /*var joinNode=this.hashtable.get(node.uuid);
      if(joinNode!==undefined){
        return join;
        //return master;
      }
      else{
        aux = new Join(node.data, node);
        this.hashtable.put(node.uuid, {'value':node});
        //this.addJoin(node.uuid,aux);
      }*/
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
    //O elemento não é nenhum dos anteriores. É lançada uma excapção INVALID.
    default:
        throw "invalid";
  }

  aux.uuid=node.uuid;

  //Se o nó não é do tipo END chama o método validate recursivamente para validar o próximo nó
  if(aux.type !== Definition.END && aux.type !== Definition.IF) {
    aux.next = this.validate(node.next);
  }
  /*Depois de percorrer todos os nós e verificar que o grafo é válido emite um envento "validated"
    Visto que ficaram pendentes outros nós devido à recursividade e só é pretendido emitir um evento
    é feita uma verificação.
    Esta vereficação certifica que o evento só é emitido no nó BEGIN, ou seja,
    depois de retornar todos os restantes nós.
  */
  if(aux.type === Definition.BEGIN) {
    this.emit('validated');
  }
  return aux;
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

/*Método toString
  Retorna o resultado do método inspect 
*/
Graph.prototype.toString = function() {
    return util.inspect(this, true, 99, true);
};

/*Método add
  Este método adiciona um nó recebido por parâmetro ao grafo.
*/

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

    //console.log(util.inspect(this, true, 7, true));
};

Graph.prototype.clone = function(obj) {
    /*if (null === obj || "object" !== typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;*/
    var aux=JSON.stringify(obj);
  return JSON.parse(aux);
};

Graph.prototype.evaluate = function(node,level){
  var nodeClone =this.clone(node); //cópia do objecto
  try{
    return this.evaluator.evaluate(nodeClone,level);
  }
  catch(e){
    throw(e);
  }
  //return this.evaluator.evaluate(node.postfixStack);
};


/*Método execute
  Este método executa o fluxograma.
  Usa recursividade para percorrer sequencialmente os nós do fluxograma,.
*/
Graph.prototype.execute = function(jsonRoot) {
  /*if(node==this.root){
    this.parser.createPostfixStacks(this.root);
  }*/
  try{
    this.val(jsonRoot);
  }
  catch(e){
    throw e;
  }

  console.log("Executing Graph");
  this.stepNode=this.root;
  
  //this.parser.createPostfixStacks(this.root);
  this.level=0;
  this.comeFromIf=false;
  this.step.apply();
  
  //this.emit('validated');

  //while(node!==undefined){
  //node.execute();
};



//Exportação de objectos GRAPH
module.exports = Graph;

