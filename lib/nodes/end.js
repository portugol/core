/*
A classe END representa um nó final do fluxograma e define o ponto de conclusão do fluxograma.
Esta classe herda a classe NODE.

Tem como atributos:
  -data: (não aplicável por enquanto)
  -type: constante que permite determinar o tipo de nó
*/

//Importação de bibliotecas
var Node = require('../node'),
        sys = require('sys'),
        Definition = require('./definition');

/*Construtor de objectos END.
  Recebe por parâmetro um nó
*/
var End = function(node) {
  //Se receber um nó parâmetro guarda os atributos "data" e "type"
  if (node !== undefined) {
    this.data = node.data;
    this.type = node.type;
    this.uuid = node.uuid;
  }
  //Se não receber parâmetro define os atributos com os valores por defeito
  else {
   this.data = "fim";
   this.type = Definition.END;
  }
};

sys.inherits(End, Node);

End.prototype.execute = function() {
  this.emit("done");
};

module.exports = End;
