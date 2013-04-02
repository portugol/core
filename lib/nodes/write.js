/*
A classe WRITE representa um nó de saída de dados do fluxograma.
Esta classe herda a classe NODE.

Tem como atributos:
  -data: conteúdo de saída
  -type: constante que permite determinar o tipo de nó
*/

//Importação de bibliotecas
var Node = require('../node'),
        sys = require('sys'),
        Definition = require('./definition');

/*
Construtor de objectos WRITE.
Parâmetros ??????????????????????????
*/
var Write = function(data, node) {
  //Se receber o prâmetro "node" guarda os seus atributos
  if (node !== undefined) {
    this.data = node.data;
    this.type = node.type;
  }
  //Se não receber o prâmetro "node" guarda o consteúdo do parâmeto "data" e define o type
  else {
    this.data = data;
    this.type = Definition.WRITE;
  }
};

//A classe WRITE herda a classe NODE
sys.inherits(Write, Node);


/*
O método "execute" executa a instrução correspondente ao nó, que neste caso corresponde a mostrar o ouput
*/
Write.prototype.execute = function() {
    //console.log(this.data);
    this.emit('done', {'memory': false, 'data': this.data});
};

//Exportação de objectos WRITE
module.exports = Write;

