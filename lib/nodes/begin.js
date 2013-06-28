/*
A classe BEGIN representa um nó inicial do fluxograma e define o ponto de partida do fluxograma.
Esta classe herda a classe NODE.

Tem como atributos:
  -data: (não aplicável por enquanto)
  -type: constante que permite determinar o tipo de nó
*/

//Importação de bibliotecas
var Node = require('../node'),
  sys = require('sys'),
  Definition = require('./definition');

/*Construtor de objectos BEGIN
  Recebe por parâmetro um Nó
*/
var Begin = function(node) {
    //Se receber parâmetro guarda os atributos "data" e "type"
    if (node !== undefined) {
      this.data = node.data;
      this.type = node.type;
      this.uuid = node.uuid;
    }
    //Se não receber parâmetro define os atributos com os valores por defeito
    else {
      this.data = "inicio";
      this.type = Definition.BEGIN;
    }
};

//Esta classe herda os atributos e métodos da classe NODE
sys.inherits(Begin, Node);

/*Método execute
  Executa a instrução referente ao nó. Visto que o nó inicial não tem qualquer instrução associada
  apenas emite o evento "done" para proseguir
*/
Begin.prototype.execute = function() {
  this.emit("done");
};

//Exportação de objectos do tipo BEGIN
module.exports = Begin;

