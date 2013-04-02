/*
A classe NODE representa um elemento do fluxograma.
Existem vários tipos de elementos e por isso esta classe subdivide-se:
	-Elemento BEGIN: nó inicial do fluxograma
	-Elemento WRITE: nó de escrita do fluxograma
	-Elemento READ: nó de entrada de dados do fluxograma
	-Elemento END: nó final do fluxograma

Todos os elementos listados têm uma relação de herança com a classe NODE.
Esta classe herda ainda a EventEmitter para uso de eventos nas subclasses.

Tem como atributos:
  -data: guarda informação adicional do nó
*/

//Importação de bibliotecas
var sys = require('sys'),
        events = require('events');

//Construtor de objectos NODE
var Node = function (data) {
    this.data = data;
};

//Relação de herança com o EventEmitter para uso de eventos
sys.inherits(Node, events.EventEmitter);

//Método que faz a execução da instrução representada pelo elemento fluxográfico.
//Cada subclasse especifica como o método EXECUTE se comporta (dependendo do tipo de elemento)
Node.prototype.execute = function() {};

//Esportação de objectos do tipo NODE
module.exports = Node;

