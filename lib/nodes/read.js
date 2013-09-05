/*
A classe READ representa um nó de entrada de dados do fluxograma.
Esta classe herda a classe NODE.

Tem como atributos:
    -data: conteúdo de entrada
    -type: constante que permite determinar o tipo de nó
    -name: nome da variável em memória que recebe o conteúdo
*/

//Importação de bibliotecas
var Node = require('../node'),
        sys = require('sys'),
        prompt = require('prompt'),
        events = require('events'),
        Definition = require('./definition');

/*
Construtor de objectos READ.
Recebe por parâmetro o nome da variável em memória que guarda o conteúdo.
*/
var Read = function(node) {
    //guarda o nome da variavel que recebe o input
    //o input sera guardado em pós fixo no atributo postfixStack posteriormente
    this.data = node.data; 
    this.type = Definition.READ;
    this.uuid = node.uuid;
};

//Relação de herança com a classe NODE
sys.inherits(Read, Node);

/*
O método execute executa a instrução correspondente ao nó.
Neste caso faz uma leitura do teclado através da prompt e guarda o conteúdo lido.
*/
Read.prototype.execute = function(graph) {
    this.emit('done');
};

//Exportação de objectos READ
module.exports = Read;