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
  Expression = require('../../core-parser/expression'),
  clone = require('clone');

//Construtor de objectos GRAPH. Recebe como parâmetro o elemento inicial do fluxograma
var Graph = function() {
    var self = this;
    this.stepping = false;
    this.memory = new Memory();
    this.evaluator = new Evaluator(Definition,this.memory);
    this.console = "";
    //this.root = root;
    //this.last = root;
    
    this.joinNodes=[];
    this.errors=[];

    //executado quando recebe input do IDE
    this.readStep = function(input){
      if(input==="" || input===undefined || input===null){
        console.log("Empty input in READ");
        this.emit('errorAbort',{'uuid':this.stepNode.uuid,'message':"Empty inpunt in read"});
        throw "Empty input in READ";
      }
      //cria stack pos fixa
      this.stepNode.postfixStack = new Expression(Definition).toPostfix(input,this.stepNode.type);
      //calcula o resultado através do pos fixo
      try {
        this.evaluate(this.stepNode,this.level);
      }
      catch(e){
        console.log("Evaluator error in READ");
        this.emit('errorAbort',{'uuid':this.stepNode.uuid,'message':e.message});
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
          console.log("STEP");

          var orig = self.stepNode; //guarda no original
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
                  throw "Evaluator error in IF";
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
              self.emit("requestInput");
              return false;
              break;
            case Definition.END:
              if(self.stepping){
                self.memory.vars=[];
              }
              //self.emit('finished',self.stepNode.uuid);
              //self.previousId=self.actualId;
              //self.actualId=self.stepNode.uuid;
              self.uuidUpdate();
              self.emit('finished');
              console.log("TERMINOU O FLUXOGRAMA");
              return true; //terminou
          }

          //if(orig.type != Definition.IF) {
          //
          //se o nó for do tipo IF não tem NEXt, mas tem NEXTRUE e NEXTFALSE, portanto nao entra
          //se o nó for do tipo READ primeiro tem de receber o input por isso não entra
          if(!self.previousWasIf && self.stepNode.type!=Definition.READ) {
              //self.previousId=self.actualId;
              //self.actualId=self.stepNode.uuid;
              self.uuidUpdate();
              self.previousNode=self.stepNode;
              self.stepNode=self.stepNode.next;
          }
          self.previousWasIf=false;
          self.emit('skip');
        }
        else{
          throw "O NODE E UNDEFINED NO EXECUTE";
        }
        return false; //ainda nao terminou
      /*}
      catch(e){
        console.log("step error! abort");
        console.log("#########################");
        console.log(e);
        require('util').inspect(e,true,null);
      }*/
    }; //fecha function step
    
};//fecha construtor

//relação de herança com o EventEmitter para usar eventos
sys.inherits(Graph, events.EventEmitter);

Graph.prototype.val = function(node) {
  this.root=undefined;
  //limpar hashtable dos joins. IMPORTANTE para repetir a execução do mesmo
  //fluxograma com valores actualizados
  this.clearJoin(); 
  this.errors=[]; //limpar lista de erros
  try{
    this.validate(node);
  }
  catch(e){
    console.log(e);
    console.log("mensagem");
    console.log(e.message);
    //this.addError(e.message);
    this.emit('validated',{'status':false});
  }
};

Graph.prototype.uuidUpdate = function(){
  this.previousId=this.actualId;
  this.actualId=this.stepNode.uuid;
}

/*Método VALIDATE
  Este método percorre recursivamente os elementos do grafo para verificar se este é válido.
  O grafo é considerado válido se contiver um e só um elemento BEGIN e END e estes forem os elementos inicial e final, respectivamente.
  Se for inválido lança uma excepção INVALID.
*/
Graph.prototype.validate = function(node, uuid) {
  console.log("VALIDATE METHOD");
  var aux = {};
  if(node===undefined){
    this.addError("O fluxograma não é válido. Faltam ligações",uuid);
    throw "invalid graph";
  }
  //Verificação do tipo de elemento
  switch(node.type) {
    //O elemento é do tipo BEGIN
    case Definition.BEGIN:
      //Se já foi encontrdo um elemento BEGIN lança uma excepção 
      if(this.root !== undefined) {
        this.addError("O fluxograma não é válido. Não existe um nó Início");
        throw "invalid graph";
      }
      //Se ainda não encontrou um elemento BEGIN é criado e definido como ROOT
      aux = new Begin(node);
      this.root = aux;
      break;

    //O elemento é do tipo END
    case Definition.END:
      //Se ainda não foi encontrado um BEGIN ou já encontrou um END ou existem elementos para além do final. É lançada uma excepção
      //NOTA: FOI ACRESCENTADO A PRIMEIRA VERIFICAÇÃO PARA O CASO DE NAO TER SIDO ENCONTRADO ANTERIORMENTE UM BEGIN
      //if(this.root === undefined || this.end !== undefined || node.next !== undefined) {
      if(this.root === undefined){
        this.addError("O fluxograma não é válido. Não existe um nó Início");
        throw "invalid graph";
      }
      if(this.end !== undefined){
        this.addError("O fluxograma não é válido. Já existe um nó Fim");
        throw "Já existe um nó Fim";
      }
      if(node.next !== undefined){
        this.addError("O fluxograma não é válido. Não pode haver nós para além do Fim");
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
        throw "O fluxograma não é válido. Não existe um nó Início";
      }
      //cria um objecto WRITE. Passa por parâmetro o atributo node para adquirir o seu conteúdo no construtor.
      aux = new Write(node.data, node);
      try{
        aux.postfixStack=new Expression(Definition).toPostfix(node.data.toString(),node.type);
      }
      catch(e){
        this.errors.push({'uuid':aux.uuid,'message':e.message});
      }
      break;

    case Definition.READ:
      if(this.root === undefined) {
        throw "O fluxograma não é válido. Não existe um nó Início";
      }
      aux = new Read(node);
      break;

    case Definition.PROCESS:
      if(this.root === undefined) {
        throw "O fluxograma não é válido. Não existe um nó Início";
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
        throw "O fluxograma não é válido. Não existe um nó Início";
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
      //verifica se o nó já foi encontrado anteriormente
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
        aux.nexttrue=this.validate(node.nexttrue,aux.uuid);
      }
      if(node.nextfalse!==undefined){
        aux.nextfalse=this.validate(node.nextfalse,aux.uuid);
      }
      break;
      case Definition.JOIN:
        if(this.root === undefined) {
          throw "O fluxograma não é válido. Não existe um nó Início";
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
        throw "Tipo de nó desconhecido";
  }

  //aux.uuid=node.uuid;

  //Se o nó não é do tipo END chama o método validate recursivamente para validar o próximo nó
  if(aux.type !== Definition.END && aux.type !== Definition.IF) {
    aux.next = this.validate(node.next,aux.uuid);
  }
  /*Depois de percorrer todos os nós e verificar que o grafo é válido emite um envento "validated"
    Visto que ficaram pendentes outros nós devido à recursividade e só é pretendido emitir um evento
    é feita uma verificação.
    Esta vereficação certifica que o evento só é emitido no nó BEGIN, ou seja,
    depois de retornar todos os restantes nós.
  */
  if(aux.type === Definition.BEGIN) {
    if(this.errors.length>0){
      //this.emit('errors');
      //throw "validate error";
      this.emit('validated',{'status':false});
    }
    else{
      this.emit('validated',{'status':true});
    }
  }
  return aux;
};

Graph.prototype.addError=function(message,uuid){
  console.log("+ 1 erro");
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
    
    //var aux=JSON.stringify(obj);
    //return JSON.parse(aux);
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
  //return this.evaluator.evaluate(node.postfixStack);
};


/*Método execute
  Este método executa o fluxograma.
  Usa recursividade para percorrer sequencialmente os nós do fluxograma,.
*/
Graph.prototype.execute = function(jsonRoot,stepping) {
  console.log("Executing Graph");
  this.stepping=stepping;
  this.errors=[];
  try{
    if(jsonRoot!==null){
      this.val(jsonRoot);
      //this.resetValues(); //com isto aqui ha problemas de sincronismo
    }
    else{
      //não existem objectos na tela
      this.addError("O fluxograma não é válido. Falta o nó Início.");
      this.emit('validated',{'status':false});
      throw "invalid graph";
    }
    //this.resetValues();
    //this.step();
  }
  catch(e){
    console.log(e);
  }
};

Graph.prototype.resetValues = function(){
  this.previousNode=undefined;
  this.stepNode=this.root;
  this.level=0;
  this.console="";
  this.comeFromIf=false;
  this.memory.vars=[];
};

//Exportação de objectos GRAPH
module.exports = Graph;

