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

//Construtor de objectos GRAPH. Recebe como parâmetro o elemento inicial do fluxograma
var Graph = function(root) {
    this.memory = new Memory();
    this.evaluator = new Evaluator(this.memory);
    this.console = "";
    this.root = root;
    this.last = root;
    this.joinNodes=[]; //array auxiliar que guarda nós do tipo JOIN
};

//relação de herança com o EventEmitter para usar eventos
sys.inherits(Graph, events.EventEmitter);

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
      aux = new Read(undefined, node);
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
      aux = new If(node.data, node);
      aux.postfixStack=new Expression(Definition).toPostfix(node.data.toString(),node.type);
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
      var join=this.getJoin(node.uuid);
      if(join!==undefined){
        return join;
        //return master;
      }
      else{
        aux = new Join(node.data, node);
        this.addJoin(node.uuid,aux);
      }
      break;
    //O elemento não é nenhum dos anteriores. É lançada uma excapção INVALID.
    default:
        throw "invalid";
  }

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

Graph.prototype.evaluate = function(node){
  console.log("O NO VAI SER AVALIADO");
  console.log(node);
  return this.evaluator.evaluate(node.postfixStack);
};


/*Método execute
  Este método executa o fluxograma.
  Usa recursividade para percorrer sequencialmente os nós do fluxograma,.
*/
Graph.prototype.execute = function() {
  /*if(node==this.root){
    this.parser.createPostfixStacks(this.root);
  }*/
  console.log("GRAPH");
  console.log(this.root);
  var node=this.root;
  var self=this;
  //this.parser.createPostfixStacks(this.root);

  while(node!==undefined){
    switch(node.type) {
      case Definition.BEGIN:
        break;
      case Definition.PROCESS:
        self.evaluate(node);
        self.emit('memoryUpdate', JSON.stringify(self.memory.vars));
        break;
      case Definition.IF:
        var boolResult=self.evaluate(node);
        if(boolResult===true){
          node=node.nexttrue;
          console.log("NEXT TRUE");
          console.log(node);
        }
        else if(boolResult===false){
          node=node.nextfalse;
        }
        else{
          throw "O no IF nao tem um resultado boolean";
        }
        break;
      case Definition.JOIN:
        break;
      case Definition.WRITE:
        console.log("AQUIIIII");
        console.log(node.postfixStack);
        self.console=self.evaluate(node);
        self.emit('consoleUpdate', self.console);
        break;
    }

    if(node.type != Definition.IF) {
      node=node.next;
    }

    console.log(node);
  }
  console.log("ACABOU");
  //node.execute();
};

//Exportação de objectos GRAPH
module.exports = Graph;

