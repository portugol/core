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
  Definition = require('./nodes/definition'),
  sys = require('sys'),
  events = require('events');

//Construtor de objectos GRAPH. Recebe como parâmetro o elemento inicial do fluxograma
var Graph = function(root) {
    this.memory = {};

    this.root = root;
    this.last = root;
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
      aux = new Write(undefined, node);
      break;


    case Definition.READ:
      if(this.root === undefined) {
        throw "invalid";
      }
      aux = new Write(undefined, node);
      break;

    case Definition.PROCESS:
      if(this.root === undefined) {
        throw "invalid";
      }
      aux = new Write(undefined, node);
      break;

    //O elemento não é nenhum dos anteriores. É lançada uma excapção INVALID.
    default:
        throw "invalid";
  }

  //Se o nó não é do tipo END chama o método validate recursivamente para validar o próximo nó
  if(aux.type !== Definition.END) {
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


/*Método execute
  Este método executa o fluxograma.
  Usa recursividade para percorrer sequencialmente os nós do fluxograma,.
*/
Graph.prototype.execute = function(node) {
    //Nó auxiliar que representa o root quando o método não receber parâmetro
    var aux = this.root;
    
    //Caso o método receba parâmetro, o nó auxiliar representa esse objecto
    if (node !== undefined) {
        aux = node;
    }

    //A variável self é usada noutros scopes. Representa a referência o objecto do tipo GRAPH
    var self = this;

    //console.log("EXECUTING:");
    //console.log(util.inspect(aux, true, 7, true));


    /*Após a execução da instrução do nó, ou seja, quando for emitido o evento "done", 
      o conteúdo é guardado em memória
    */
    aux.on('done', function(data) {
        //Se o eventemmiter passar por parâmetro um objecto para memória o conteúdo é guardado
        if (data !== undefined && data.memory !== undefined && data.memory === true) {
            self.memory[Object.keys(data.data)[0]] = data[Object.keys(data.data)[0]];
            console.log("##########################");
            console.log("MEMORIA:");
            console.log(util.inspect(self.memory));
            /*
            console.log("VALOR:");
            console.log(self.memory.bt);

            if(self.memory.a != undefined && self.memory.b != undefined) {
              console.log("SOMA:");
              console.log(parseInt(self.memory.a));
            }
            */

            //?????????????????????????
            self.emit('done', {});
        }  
        else if(data !== undefined && data.memory !== undefined && data.memory === false) {
          self.emit('done', data.data);
        }
        //Enquanto houverem elementos o método é chamado recursivamente e recebe como parâmetro o próximo nó
        if (aux.next !== undefined) {
            self.execute(aux.next);
        }
    });

    //Executa a instrução referente ao nó (nota: método execute da classe NODE)
    aux.execute();
};

//Exportação de objectos GRAPH
module.exports = Graph;

