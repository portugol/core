////////////////////////////////////////////////////
//////////         PARSER TESTING         //////////
////////////////////////////////////////////////////

//
// mocha testes_parser.js
// 


//Requires do parser
var Expression = require('./expression');
var Token = require('./token');
var tokenTypes= require('./definitions/token_types');
var comp=require('./compatibility/binary_comp').binComp;
var binops=require('./definitions/binary_operators').binops;
var Evaluator = require('./evaluator');
var unaryLeftComp=require('./compatibility/unary_left_comp').unaryLeftComp;
var u=require('./compatibility/unary_right_comp').unaryRightComp;
var Var= require('./var');
var Parser = require('./parser');
var util=require('util');
var sys = require('sys');
var events = require('events');

//Biblioteca de asserts
var chai = require("./chai");

var assert = chai.assert,
	expect = chai.expect,
	should = chai.should(); //Should tem de ser executado

var parser = new Evaluator();

//////////////////////////////////////Testar outros caracteres
///////////////////////////////////////////Testar subtracção com resultados negativos
///////////////////////////////////////////Testar soma de caracteres com + 1 caracter
///////////////////////////////////////////Testar os vários .
///////////////////////////////////////////-funções matemáticas (diz se tens parâmetros errados)
///////////////////////////////////////////-constantes
///////////////////////////////////////////-factorial
/////////////////////////////////////////// 3>2+1+2 && 2>3
/////////////////////////////////////////// a=b=c=3
/////////////////////////////////////////// "func((1),2)"
/////////////////////////////////////////// testes operacoes bitwise + de 32 bits  number.MAX_VALUE number.MIN_VALUE
/////////////////////////////////////////// 2*cos(PI/2)
/////////////////////////////////////////// Potenciação valores com e overflow
//
describe(' Soma (+) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(8, parser.evaluateStringExpr("3 + 5"), 'Esperado valor 8 da soma (soma de inteiros)');
	    	assert.strictEqual(10.7, parser.evaluateStringExpr("5 + 5.7"), 'Esperado valor 10.7 da soma (soma de inteiro com real)');
	    	assert.strictEqual("5teste", parser.evaluateStringExpr("5 + \"teste\""), 'Esperado texto 5teste da soma (soma de inteiro com texto)');
	    	assert.strictEqual('b', parser.evaluateStringExpr("'a' + 1"), 'Esperado caracter b da soma (soma de caracter com inteiro)');
	    	assert.strictEqual(9.0, parser.evaluateStringExpr("4.5 + 4.5"), 'Esperado valor 9.0 da soma (soma de reais)');
	    	assert.strictEqual("13.9teste", parser.evaluateStringExpr("13.9 + \"teste\""), 'Esperado texto 13.9teste da soma (soma de real com texto)');
	    	assert.strictEqual('Ȱ',parser.evaluateStringExpr("'đ' + 'ğ'"), 'Esperado caracter Ȱ ͗da soma (soma de caracteres)');
	    	assert.strictEqual("Ńt3st3", parser.evaluateStringExpr("'Ń' + \"t3st3\""), 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)');
	    	assert.strictEqual("t3starº*ß", parser.evaluateStringExpr("\"t3st\" + \"arº*ß\""), 'Esperado texto t3starº*ß da soma (soma de textos)');
	    });

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluateStringExpr("3 + 5"), 'number', 'Esperado number da soma (soma de inteiros)');
	    	assert.typeOf( parser.evaluateStringExpr("5 + 5.7"), 'number', 'Esperado number da soma (soma de inteiro com real)');
	    	assert.typeOf( parser.evaluateStringExpr("5 + \"teste\""), 'string','Esperado string da soma (soma de inteiro com texto)');
	    	assert.typeOf( parser.evaluateStringExpr("'a' + 1"), 'string' , 'Esperado string da soma (soma de caracter com inteiro)');
	    	assert.typeOf( parser.evaluateStringExpr("4.5 + 4.5"), 'number' ,'Esperado number da soma (soma de reais)');
	    	assert.typeOf( parser.evaluateStringExpr("13.9 + \"teste\""), 'string' , 'Esperado string da soma (soma de real com texto)');
	    	assert.typeOf( parser.evaluateStringExpr("'đ' + 'ğ'"), 'string' , 'Esperado string da soma (soma de caracteres)');
	    	assert.typeOf( parser.evaluateStringExpr("'Ń' + \"t3st3\""), 'string' ,'Esperado string da soma (soma de caracter com texto)');
	    	assert.typeOf( parser.evaluateStringExpr("\"t3st\" + \"arº*ß\""), 'string' , 'Esperado string da soma (soma de textos)');    	
	    });

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluateStringExpr("5 + TRUE"); },'parse error [column 5]: Não e esperado um boolean');
    		assert.throws(function() {return parser.evaluateStringExpr("3.6 + TRUE"); },'parse error [column 7]: Não e esperado um boolean');
    		assert.throws(function() {return parser.evaluateStringExpr("34.3 + 'Ƨ'"); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("TRUE + FALSE"); },'parse error [column 6]: Nao e esperado um operador aritmetico');
    		assert.throws(function() {return parser.evaluateStringExpr("TRUE + \"teste\""); },'parse error [column 6]: Nao e esperado um operador aritmetico');
    		assert.throws(function() {return parser.evaluateStringExpr("FALSE + 'უ'"); },'parse error [column 7]: Nao e esperado um operador aritmetico');
	    });

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluateStringExpr("3 + 5"), 'Esperado valor 8 da soma (soma de inteiros)').to.equal(8);
	    	expect(parser.evaluateStringExpr("5 + 5.7"), 'Esperado valor 10.7 da soma (soma de inteiro com real)').to.equal(10.7);
	    	expect(parser.evaluateStringExpr("5 + \"teste\""),  'Esperado string 5teste da soma (soma de inteiro com texto)').to.equal("5teste");
	    	expect(parser.evaluateStringExpr("'a' + 1"), 'Esperado caracter b da soma (soma de caracter com inteiro)').to.equal('b');
	    	expect(parser.evaluateStringExpr("4.5 + 4.5"), 'Esperado valor 9.0 da soma (soma de reais)').to.equal(9.0);
	    	expect(parser.evaluateStringExpr("13.9 + \"teste\""), 'Esperado texto 13.9teste da soma (soma de real com texto)').to.equal("13.9teste");
	    	expect(parser.evaluateStringExpr("'đ' + 'ğ'"), 'Esperado caracter Ȱ da soma (soma de caracteres)').to.equal('Ȱ');
	    	expect(parser.evaluateStringExpr("'Ń' + \"t3st3\""), 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)').to.equal("Ńt3st3");
	    	expect(parser.evaluateStringExpr("\"t3st\" + \"arº*ß\""), 'Esperado texto t3starº*ß da soma (soma de textos)').to.equal("t3starº*ß");
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluateStringExpr("3 + 5")).to.be.a('number');
  			expect(parser.evaluateStringExpr("5 + 5.7")).to.be.a('number');
  			expect(parser.evaluateStringExpr("5 + \"teste\"")).to.be.a('string');
  			expect(parser.evaluateStringExpr("'a' + 1")).to.be.a('string');
  			expect(parser.evaluateStringExpr("4.5 + 4.5")).to.be.a('number');
  			expect(parser.evaluateStringExpr("13.9 + \"teste\"")).to.be.a('string');
  			expect(parser.evaluateStringExpr("'đ' + 'ğ'")).to.be.a('string');
  			expect(parser.evaluateStringExpr("'Ń' + \"t3st3\"")).to.be.a('string');
  			expect(parser.evaluateStringExpr("\"t3st\" + \"arº*ß\"")).to.be.a('string');
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluateStringExpr("5 + TRUE"); }).to.throw('parse error [column 5]: Não e esperado um boolean');
  			expect(function() {return parser.evaluateStringExpr("3.6 + TRUE"); }).to.throw('parse error [column 7]: Não e esperado um boolean');
  			expect(function() {return parser.evaluateStringExpr("34.3 + 'Ƨ'"); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
  			expect(function() {return parser.evaluateStringExpr("TRUE + FALSE"); }).to.throw('parse error [column 6]: Nao e esperado um operador aritmetico');
  			expect(function() {return parser.evaluateStringExpr("TRUE + \"teste\""); }).to.throw('parse error [column 6]: Nao e esperado um operador aritmetico');
			expect(function() {return parser.evaluateStringExpr("FALSE + 'უ'"); }).to.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluateStringExpr("3 + 5").should.equal(8, 'Esperado valor 8 da soma (soma de inteiros)');
		 	parser.evaluateStringExpr("5 + 5.7").should.equal(10.7, 'Esperado valor 10.7 da soma (soma de inteiro com real)');
		 	parser.evaluateStringExpr("5 + \"teste\"").should.equal("5teste", 'Esperado string 5teste da soma (soma de inteiro com texto)');
		 	parser.evaluateStringExpr("'a' + 1").should.equal('b', 'Esperado caracter b da soma (soma de caracter com inteiro)');
		 	parser.evaluateStringExpr("4.5 + 4.5").should.equal(9.0, 'Esperado valor 9.0 da soma (soma de reais)');
		 	parser.evaluateStringExpr("13.9 + \"teste\"").should.equal("13.9teste", 'Esperado texto 13.9teste da soma (soma de real com texto)');
		 	parser.evaluateStringExpr("'đ' + 'ğ'").should.equal('Ȱ', 'Esperado caracter Ȱ da soma (soma de caracteres)');
		 	parser.evaluateStringExpr("'Ń' + \"t3st3\"").should.equal("Ńt3st3", 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)');
		 	parser.evaluateStringExpr("\"t3st\" + \"arº*ß\"").should.equal("t3starº*ß", 'Esperado texto t3starº*ß da soma (soma de textos)');	    	
	    })


		it('.typeOf()', function (){	
			(parser.evaluateStringExpr("5 + 3")).should.be.a('number');
			(parser.evaluateStringExpr("5 + 5.7")).should.be.a('number');
			(parser.evaluateStringExpr("5 + \"teste\"")).should.be.a('string');
			(parser.evaluateStringExpr("'a' + 1")).should.be.a('string');
			(parser.evaluateStringExpr("4.5 + 4.5")).should.be.a('number');
			(parser.evaluateStringExpr("13.9 + \"teste\"")).should.be.a('string');
			(parser.evaluateStringExpr("'đ' + 'ğ'")).should.be.a('string');
			(parser.evaluateStringExpr("'Ń' + \"t3st3\"")).should.be.a('string');
			(parser.evaluateStringExpr("\"t3st\" + \"arº*ß\"")).should.be.a('string');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluateStringExpr("5 + TRUE"); }).should.throw('parse error [column 5]: Não e esperado um boolean');
			(function() {return parser.evaluateStringExpr("3.6 + TRUE"); }).should.throw('parse error [column 7]: Não e esperado um boolean');
			(function() {return parser.evaluateStringExpr("34.3 + 'Ƨ'"); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("TRUE + FALSE"); }).should.throw('parse error [column 6]: Nao e esperado um operador aritmetico');
			(function() {return parser.evaluateStringExpr("TRUE + \"teste\""); }).should.throw('parse error [column 6]: Nao e esperado um operador aritmetico');
			(function() {return parser.evaluateStringExpr("FALSE + 'უ'"); }).should.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
		})

	})

})

describe(' Subtracção (-) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(2, parser.evaluateStringExpr("5 - 3"), 'Esperado valor 2 da subtracção (subtracção de inteiros)');
	    	assert.strictEqual(1.3, parser.evaluateStringExpr("5 - 3.7"), 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)');
	    	assert.strictEqual('a', parser.evaluateStringExpr("'b' - 1"), 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)');
	    	assert.strictEqual(4.29, parser.evaluateStringExpr("6.87 - 2.58"), 'Esperado valor 4.29 da subtracção (subtracção de reais)');  																//3196
	    	assert.strictEqual('3',parser.evaluateStringExpr("'ಯ' - '౼'"), 'Esperado caracter 3 da subtracção (subtracção de caracteres)');
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluateStringExpr("5 - 3"), 'number', 'Esperado number da subtracção (subtracção de inteiros)');
	    	assert.typeOf( parser.evaluateStringExpr("5 - 5.7"), 'number', 'Esperado number da subtracção (subtracção de inteiro com real)');
	    	assert.typeOf( parser.evaluateStringExpr("'a' - 1"), 'string' , 'Esperado string da subtracção (subtracção de caracter com inteiro)');
	    	assert.typeOf( parser.evaluateStringExpr("6.87 - 2.58"), 'number' ,'Esperado number da subtracção (subtracção de reais)');
	    	assert.typeOf( parser.evaluateStringExpr("'ಯ' - '౼'"), 'string' , 'Esperado string da subtracção (subtracção de caracteres)');   	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluateStringExpr("5 - TRUE"); },'parse error [column 5]: Não e esperado um boolean');
    		assert.throws(function() {return parser.evaluateStringExpr("5 - \"ಠಡ嬛ၧkd\""); },'EVALUATOR ERROR:Operacao entre tipos incompativeis')
    		assert.throws(function() {return parser.evaluateStringExpr("3.623 - TRUE"); },'parse error [column 9]: Não e esperado um boolean');
    		assert.throws(function() {return parser.evaluateStringExpr("32.90 - \"t柹鵛瞣éट\""); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("34.3 - '吃'"); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("FALSE - FALSE"); },'parse error [column 7]: Nao e esperado um operador aritmetico');
    		assert.throws(function() {return parser.evaluateStringExpr("FALSE - \"p02姚ń级\""); },'parse error [column 7]: Nao e esperado um operador aritmetico');
    		assert.throws(function() {return parser.evaluateStringExpr("FALSE - 'უ'"); },'parse error [column 7]: Nao e esperado um operador aritmetico');
    		assert.throws(function() {return parser.evaluateStringExpr("'ᐤ' - \"t3쥯꾟3\""); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" - \"ኺ0~cᶎओ\""); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluateStringExpr("5 - 3"), 'Esperado valor 2 da subtracção (subtracção de inteiros)').to.equal(2);
	    	expect(parser.evaluateStringExpr("5 - 3.7"), 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)').to.equal(1.3);;
	    	expect(parser.evaluateStringExpr("'b' - 1"), 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)').to.equal('a');
	    	expect(parser.evaluateStringExpr("6.87 - 2.58"), 'Esperado valor 4.29 da subtracção (subtracção de reais)').to.equal(4.29);
	    	expect(parser.evaluateStringExpr("'ಯ' - '౼'"), 'Esperado caracter 3 da subtracção (subtracção de caracteres)').to.equal('3');
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluateStringExpr("5 - 3")).to.be.a('number');
  			expect(parser.evaluateStringExpr("5 - 5.7")).to.be.a('number');
  			expect(parser.evaluateStringExpr("'b' - 1")).to.be.a('string');
  			expect(parser.evaluateStringExpr("6.87 - 2.58")).to.be.a('number');
  			expect(parser.evaluateStringExpr("'ಯ' - '౼'")).to.be.a('string');  			
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluateStringExpr("5 - TRUE"); }).to.throw('parse error [column 5]: Não e esperado um boolean');
  			expect(function() {return parser.evaluateStringExpr("5 - \"ಠಡ嬛ၧkd\""); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
  			expect(function() {return parser.evaluateStringExpr("3.623 - TRUE"); }).to.throw('parse error [column 9]: Não e esperado um boolean');
  			expect(function() {return parser.evaluateStringExpr("32.90 - \"t柹鵛瞣éट\""); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
  			expect(function() {return parser.evaluateStringExpr("34.3 - '吃'"); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
  			expect(function() {return parser.evaluateStringExpr("FALSE - FALSE"); }).to.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
  			expect(function() {return parser.evaluateStringExpr("FALSE - \"p02姚ń级\""); }).to.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
  			expect(function() {return parser.evaluateStringExpr("FALSE - 'უ'"); }).to.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
			expect(function() {return parser.evaluateStringExpr("'ᐤ' - \"t3쥯꾟3\""); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			expect(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" - \"ኺ0~cᶎओ\""); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluateStringExpr("5 - 3").should.equal(2, 'Esperado valor 2 da subtracção (subtracção de inteiros)');
		 	parser.evaluateStringExpr("5 - 3.7").should.equal(1.3, 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)');
		 	parser.evaluateStringExpr("'b' - 1").should.equal('a', 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)');
		 	parser.evaluateStringExpr("6.87 - 2.58").should.equal(4.29, 'Esperado valor 4.29 da subtracção (subtracção de reais)');
		 	parser.evaluateStringExpr("'ಯ' - '౼'").should.equal('3', 'Esperado caracter 3 da subtracção (subtracção de caracteres)');
	    })

		it('.typeOf()', function (){	
			(parser.evaluateStringExpr("5 - 3")).should.be.a('number');
			(parser.evaluateStringExpr("5 - 3.7")).should.be.a('number');
			(parser.evaluateStringExpr("'b' - 1")).should.be.a('string');
			(parser.evaluateStringExpr("6.87 - 2.58")).should.be.a('number');
			(parser.evaluateStringExpr("'ಯ' - '౼'")).should.be.a('string');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluateStringExpr("5 - TRUE"); }).should.throw('parse error [column 5]: Não e esperado um boolean');	
			(function() {return parser.evaluateStringExpr("5 - \"ಠಡ嬛ၧkd\""); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("3.623 - TRUE"); }).should.throw('parse error [column 9]: Não e esperado um boolean');
			(function() {return parser.evaluateStringExpr("32.90 - \"t柹鵛瞣éट\""); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("34.3 - '吃'"); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("FALSE - FALSE"); }).should.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
			(function() {return parser.evaluateStringExpr("FALSE - \"p02姚ń级\""); }).should.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
			(function() {return parser.evaluateStringExpr("FALSE - 'უ'"); }).should.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
			(function() {return parser.evaluateStringExpr("'ᐤ' - \"t3쥯꾟3\""); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" - \"ኺ0~cᶎओ\""); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');

		})

	})

})

describe(' Multiplicação (*) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(21, parser.evaluateStringExpr("7 * 3"), 'Esperado valor 21 da multiplicação (multiplicação de inteiros)');
	    	assert.strictEqual(199.81, parser.evaluateStringExpr("29 * 6.89"), 'Esperado valor 199.81 da multiplicação (multiplicação de inteiro com real)');
	    	assert.strictEqual(583.9209669999999, parser.evaluateStringExpr("24.923 * 23.429"), 'Esperado valor 583.9209669999999 da multiplicação (multiplicação de reais)');
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluateStringExpr("7 * 3"), 'number', 'Esperado number da multiplicação (multiplicação de inteiros)');
	    	assert.typeOf( parser.evaluateStringExpr("29 * 6.89"), 'number', 'Esperado number da multiplicação (multiplicação de inteiro com real)');
	    	assert.typeOf( parser.evaluateStringExpr("24.923 * 23.429"), 'number' ,'Esperado number da multiplicação (multiplicação de reais)');  	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluateStringExpr("897 * TRUE"); },'parse error [column 7]: Não e esperado um boolean');
    		assert.throws(function() {return parser.evaluateStringExpr("5 * \"ಠಡ嬛ၧkd\""); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("'c' * 3"); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("32.42 * TRUE"); },'parse error [column 9]: Não e esperado um boolean');
    		assert.throws(function() {return parser.evaluateStringExpr("32.90 * \"t柹鵛瞣éट\""); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("332.34 * '吃'"); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("TRUE * FALSE"); },'parse error [column 6]: Nao e esperado um operador aritmetico');
    		assert.throws(function() {return parser.evaluateStringExpr("FALSE * \"p02姚ń级\""); },'parse error [column 7]: Nao e esperado um operador aritmetico');
    	    assert.throws(function() {return parser.evaluateStringExpr("FALSE * 'უ'"); },'parse error [column 7]: Nao e esperado um operador aritmetico');
    	    assert.throws(function() {return parser.evaluateStringExpr("'ಯ' * '౼'"); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("'ᐤ' * \"t3쥯꾟3\""); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
    		assert.throws(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" * \"ኺ0~cᶎओ\""); },'EVALUATOR ERROR:Operacao entre tipos incompativeis');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluateStringExpr("7 * 3"), 'Esperado valor 21 da multiplicação (multiplicação de inteiros)').to.equal(21);
	    	expect(parser.evaluateStringExpr("29 * 6.89"), 'Esperado valor 199.81 da multiplicação (multiplicação de inteiro com real)').to.equal(199.81);;
	    	expect(parser.evaluateStringExpr("24.923 * 23.429"), 'Esperado valor 583.9209669999999 da multiplicação (multiplicação de reais)').to.equal(583.9209669999999);
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluateStringExpr("7 * 3")).to.be.a('number');
  			expect(parser.evaluateStringExpr("29 * 6.89")).to.be.a('number');
  			expect(parser.evaluateStringExpr("24.923 * 23.429")).to.be.a('number');		
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluateStringExpr("897 * TRUE"); }).to.throw('parse error [column 7]: Não e esperado um boolean');
  			expect(function() {return parser.evaluateStringExpr("5 * \"ಠಡ嬛ၧkd\""); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');	
  			expect(function() {return parser.evaluateStringExpr("'c' * 3"); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
  			expect(function() {return parser.evaluateStringExpr("32.42 * TRUE"); }).to.throw('parse error [column 9]: Não e esperado um boolean');
  			expect(function() {return parser.evaluateStringExpr("32.90 * \"t柹鵛瞣éट\""); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
  			expect(function() {return parser.evaluateStringExpr("332.34 * '吃'"); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
  			expect(function() {return parser.evaluateStringExpr("TRUE * FALSE"); }).to.throw('parse error [column 6]: Nao e esperado um operador aritmetico');
  			expect(function() {return parser.evaluateStringExpr("FALSE * \"p02姚ń级\""); }).to.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
			expect(function() {return parser.evaluateStringExpr("FALSE * 'უ'"); }).to.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
			expect(function() {return parser.evaluateStringExpr("'ಯ' * '౼'"); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');  			
			expect(function() {return parser.evaluateStringExpr("'ᐤ' * \"t3쥯꾟3\""); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			expect(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" * \"ኺ0~cᶎओ\""); }).to.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');	
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluateStringExpr("7 * 3").should.equal(21, 'Esperado valor 21 da multiplicação (multiplicação de inteiros)');
		 	parser.evaluateStringExpr("29 * 6.89").should.equal(199.81, 'Esperado valor 199.81 da multiplicação (multiplicação de inteiro com real)');
		 	parser.evaluateStringExpr("24.923 * 23.429").should.equal(583.9209669999999, 'Esperado valor 583.9209669999999 da multiplicação (multiplicação de reais)');
	    })

		it('.typeOf()', function (){	
			(parser.evaluateStringExpr("7 * 3")).should.be.a('number');
			(parser.evaluateStringExpr("5 * 3.7")).should.be.a('number');
			(parser.evaluateStringExpr("24.923 * 23.429")).should.be.a('number');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluateStringExpr("897 * TRUE"); }).should.throw('parse error [column 7]: Não e esperado um boolean');	
			(function() {return parser.evaluateStringExpr("5 * \"ಠಡ嬛ၧkd\""); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("'c' * 3"); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');	
			(function() {return parser.evaluateStringExpr("32.42 * TRUE"); }).should.throw('parse error [column 9]: Não e esperado um boolean');
			(function() {return parser.evaluateStringExpr("32.90 * \"t柹鵛瞣éट\""); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("332.34 * '吃'"); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("TRUE * FALSE"); }).should.throw('parse error [column 6]: Nao e esperado um operador aritmetico');
			(function() {return parser.evaluateStringExpr("FALSE * \"p02姚ń级\""); }).should.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
			(function() {return parser.evaluateStringExpr("FALSE * 'უ'"); }).should.throw('parse error [column 7]: Nao e esperado um operador aritmetico');
			(function() {return parser.evaluateStringExpr("'ಯ' * '౼'"); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("'ᐤ' * \"t3쥯꾟3\""); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');
			(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" * \"ኺ0~cᶎओ\""); }).should.throw('EVALUATOR ERROR:Operacao entre tipos incompativeis');	
		})

	})

})

// describe(' Divisão (/) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	assert.strictEqual(2, parser.evaluateStringExpr("732 / 342"), 'Esperado valor 2 da divisão (divisão de inteiros)');
// 	    	assert.strictEqual(0.9062229370283311, parser.evaluateStringExpr("293 / 323.32"), 'Esperado valor 0.9062229370283311 da divisão (divisão de inteiro com real)');
// 	    	assert.strictEqual(0.025997904613609214, parser.evaluateStringExpr("243.92332 / 9382.4223"), 'Esperado valor 0.025997904613609214 da divisão (divisão de reais)');  																//3196
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){
// 	    	assert.typeOf( parser.evaluateStringExpr("732 / 342"), 'number', 'Esperado number da divisão (divisão de inteiros)');
// 	    	assert.typeOf( parser.evaluateStringExpr("293 / 323.32"), 'number', 'Esperado number da divisão (divisão de inteiro com real)');
// 	    	assert.typeOf( parser.evaluateStringExpr("243.92332 / 9382.4223"), 'number' ,'Esperado number da divisão (divisão de reais)');  	
// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("89723 / TRUE"); },'Símbolos incompatíveis (divisão de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("5293 / \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (divisão de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'c' / 3292"); },'Símbolos incompatíveis (divisão de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3229.4209 / TRUE"); },'Símbolos incompatíveis (divisão de real com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("32879.90 / \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (divisão de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3322.34029 / '吃'"); },'Símbolos incompatíveis (divisão de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("TRUE / FALSE"); },'Símbolos incompatíveis (divisão de lógicos)');
//     		assert.throws(function() {return parser.evaluateStringExpr("TRUE / \"p02姚ń级\""); },'Símbolos incompatíveis (divisão de lógico com texto)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("TRUE / 'უ'"); },'Símbolos incompatíveis (divisão de lógico com caracter)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("'ಯ' / '౼'"); },'Símbolos incompatíveis (divisão de caracter com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'ᐤ' / \"t3쥯꾟3\""); },'Símbolos incompatíveis (divisão de caracter com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" / \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (divisão de textos)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 / ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){
// 	    	expect(parser.evaluateStringExpr("732 / 342"), 'Esperado valor 2 da divisão (divisão de inteiros)').to.equal(2);
// 	    	expect(parser.evaluateStringExpr("293 / 323.32"), 'Esperado valor 0.9062229370283311 da divisão (divisão de inteiro com real)').to.equal(0.9062229370283311);;
// 	    	expect(parser.evaluateStringExpr("243.92332 / 9382.4223"), 'Esperado valor 0.025997904613609214 da divisão (divisão de reais)').to.equal(0.025997904613609214);
// 	    })

//   		it('.typeOf()', function (){
//   			expect(parser.evaluateStringExpr("732 / 342")).to.be.a('number');
//   			expect(parser.evaluateStringExpr("293 / 323.32")).to.be.a('number');
//   			expect(parser.evaluateStringExpr("243.92332 / 9382.4223")).to.be.a('number');		
//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("89723 / TRUE"); }).to.throw('Símbolos incompatíveis (divisão de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("5293 / \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (divisão de inteiro com texto)');	
//   			expect(function() {return parser.evaluateStringExpr("'c' / 3292"); }).to.throw('Símbolos incompatíveis (divisão de caracter com inteiro)');
//   			expect(function() {return parser.evaluateStringExpr("3229.4209 / TRUE"); }).to.throw('Símbolos incompatíveis (divisão de real com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("32879.90 / \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (divisão de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("3322.34029 / '吃'"); }).to.throw('Símbolos incompatíveis (divisão de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE / FALSE"); }).to.throw('Símbolos incompatíveis (divisão de lógicos)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE / \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (divisão de lógico com texto)');
// 			expect(function() {return parser.evaluateStringExpr("TRUE / 'უ'"); }).to.throw('Símbolos incompatíveis (divisão de lógico com caracter)');
// 			expect(function() {return parser.evaluateStringExpr("'ಯ' / '౼'"); }).to.throw('Símbolos incompatíveis (divisão de caracter com caracter)');  			
// 			expect(function() {return parser.evaluateStringExpr("'ᐤ' / \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (divisão de caracter com texto)');
// 			expect(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" / \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (divisão de textos)');
//     		//expect(function() {return parser.evaluateStringExpr('5 / ('); }).to.throw();    		
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){
// 		 	parser.evaluateStringExpr("732 / 342").should.equal(2, 'Esperado valor 2 da divisão (divisão de inteiros)');
// 		 	parser.evaluateStringExpr("293 / 323.32").should.equal(0.9062229370283311, 'Esperado valor 0.9062229370283311 da divisão (divisão de inteiro com real)');
// 		 	parser.evaluateStringExpr("243.92332 / 9382.4223").should.equal(583.9209669999999, 'Esperado valor 583.9209669999999 da divisão (divisão de reais)');
// 	    })

// 		it('.typeOf()', function (){	
// 			(parser.evaluateStringExpr("732 / 342")).should.be.a('number');
// 			(parser.evaluateStringExpr("293 / 323.32")).should.be.a('number');
// 			(parser.evaluateStringExpr("243.92332 / 9382.4223")).should.be.a('number');
// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("89723 / TRUE"); }).should.throw('Símbolos incompatíveis (divisão de inteiro com lógico)');	
// 			(function() {return parser.evaluateStringExpr("5293 / \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (divisão de inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("'c' / 3292"); }).should.throw('Símbolos incompatíveis (divisão de caracter com inteiro)');	
// 			(function() {return parser.evaluateStringExpr("3229.4209 / TRUE"); }).should.throw('Símbolos incompatíveis (divisão de real com lógico)');
// 			(function() {return parser.evaluateStringExpr("32879.90 / \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (divisão de real com texto)');
// 			(function() {return parser.evaluateStringExpr("3322.34029 / '吃'"); }).should.throw('Símbolos incompatíveis (divisão de real com caracter)');
// 			(function() {return parser.evaluateStringExpr("TRUE / FALSE"); }).should.throw('Símbolos incompatíveis (divisão de lógicos)');
// 			(function() {return parser.evaluateStringExpr("TRUE / \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (divisão de lógico com texto)');
// 			(function() {return parser.evaluateStringExpr("TRUE / 'უ'"); }).should.throw('Símbolos incompatíveis (divisão de lógico com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ಯ' / '౼'"); }).should.throw('Símbolos incompatíveis (divisão de caracter com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ᐤ' / \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (divisão de caracter com texto)');
// 			(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" / \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (divisão de textos)');
// 			//(function() {return parser.evaluateStringExpr('5 * ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 * (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');	
// 		})

// 	})

// })

// describe(' Resto da Divisão (%) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	assert.strictEqual(0, parser.evaluateStringExpr("7232 % 34232"), 'Esperado valor 7232 da resto da divisão (resto da divisão de inteiros)');  										
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){
// 	    	assert.typeOf( parser.evaluateStringExpr("7232 % 34232"), 'number', 'Esperado number da resto da divisão (resto da divisão de inteiros)');	
// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("2933 % 3231.32"); },'Símbolos incompatíveis (resto da divisão de inteiro com real)');
//     		assert.throws(function() {return parser.evaluateStringExpr("2432.332 % 938242.23"); },'Símbolos incompatíveis (resto da divisão de reais)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89723 % TRUE"); },'Símbolos incompatíveis (resto da divisão de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("5293 % \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (resto da divisão de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'c' % 3292"); },'Símbolos incompatíveis (resto da divisão de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3229.4209 % TRUE"); },'Símbolos incompatíveis (resto da divisão de real com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("32879.90 % \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (resto da divisão de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3322.34029 % '吃'"); },'Símbolos incompatíveis (resto da divisão de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("TRUE % FALSE"); },'Símbolos incompatíveis (resto da divisão de lógicos)');
//     		assert.throws(function() {return parser.evaluateStringExpr("TRUE % \"p02姚ń级\""); },'Símbolos incompatíveis (resto da divisão de lógico com texto)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("TRUE % 'უ'"); },'Símbolos incompatíveis (resto da divisão de lógico com caracter)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("'ಯ' % '౼'"); },'Símbolos incompatíveis (resto da divisão de caracter com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'ᐤ' % \"t3쥯꾟3\""); },'Símbolos incompatíveis (resto da divisão de caracter com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" % \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (resto da divisão de textos)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 % ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){
// 	    	expect(parser.evaluateStringExpr("7232 % 34232"), 'Esperado valor 7232 da resto da divisão (resto da divisão de inteiros)').to.equal(7232);
// 	    })

//   		it('.typeOf()', function (){
//   			expect(parser.evaluateStringExpr("7232 % 34232")).to.be.a('number');
//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("2933 % 3231.32"); }).to.throw('Símbolos incompatíveis (resto da divisão de inteiro com real)');
//   			expect(function() {return parser.evaluateStringExpr("2432.332 % 938242.23"); }).to.throw('Símbolos incompatíveis (resto da divisão de reais)');
//   			expect(function() {return parser.evaluateStringExpr("89723 % TRUE"); }).to.throw('Símbolos incompatíveis (resto da divisão de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("5293 % \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (resto da divisão de inteiro com texto)');	
//   			expect(function() {return parser.evaluateStringExpr("'c' % 3292"); }).to.throw('Símbolos incompatíveis (resto da divisão de caracter com inteiro)');
//   			expect(function() {return parser.evaluateStringExpr("3229.4209 % TRUE"); }).to.throw('Símbolos incompatíveis (resto da divisão de real com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("32879.90 % \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (resto da divisão de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("3322.34029 % '吃'"); }).to.throw('Símbolos incompatíveis (resto da divisão de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE % FALSE"); }).to.throw('Símbolos incompatíveis (resto da divisão de lógicos)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE % \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (resto da divisão de lógico com texto)');
// 			expect(function() {return parser.evaluateStringExpr("TRUE % 'უ'"); }).to.throw('Símbolos incompatíveis (resto da divisão de lógico com caracter)');
// 			expect(function() {return parser.evaluateStringExpr("'ಯ' % '౼'"); }).to.throw('Símbolos incompatíveis (resto da divisão de caracter com caracter)');  			
// 			expect(function() {return parser.evaluateStringExpr("'ᐤ' % \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (resto da divisão de caracter com texto)');
// 			expect(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" % \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (resto da divisão de textos)');
//     		//expect(function() {return parser.evaluateStringExpr('5 % ('); }).to.throw();    		
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){
// 		 	parser.evaluateStringExpr("7232 % 34232").should.equal(7232, 'Esperado valor 7232 da resto da divisão (resto da divisão de inteiros)');
// 	    })

// 		it('.typeOf()', function (){	
// 			(parser.evaluateStringExpr("7232 % 34232")).should.be.a('number');
// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("2933 % 3231.32"); }).should.throw('Símbolos incompatíveis (resto da divisão de inteiro com real)');
// 			(function() {return parser.evaluateStringExpr("2432.332 % 938242.23"); }).should.throw('Símbolos incompatíveis (resto da divisão de reais)');
// 			(function() {return parser.evaluateStringExpr("89723 % TRUE"); }).should.throw('Símbolos incompatíveis (resto da divisão de inteiro com lógico)');	
// 			(function() {return parser.evaluateStringExpr("5293 % \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (resto da divisão de inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("'c' % 3292"); }).should.throw('Símbolos incompatíveis (resto da divisão de caracter com inteiro)');	
// 			(function() {return parser.evaluateStringExpr("3229.4209 % TRUE"); }).should.throw('Símbolos incompatíveis (resto da divisão de real com lógico)');
// 			(function() {return parser.evaluateStringExpr("32879.90 % \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (resto da divisão de real com texto)');
// 			(function() {return parser.evaluateStringExpr("3322.34029 % '吃'"); }).should.throw('Símbolos incompatíveis (resto da divisão de real com caracter)');
// 			(function() {return parser.evaluateStringExpr("TRUE % FALSE"); }).should.throw('Símbolos incompatíveis (resto da divisão de lógicos)');
// 			(function() {return parser.evaluateStringExpr("TRUE % \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (resto da divisão de lógico com texto)');
// 			(function() {return parser.evaluateStringExpr("TRUE % 'უ'"); }).should.throw('Símbolos incompatíveis (resto da divisão de lógico com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ಯ' % '౼'"); }).should.throw('Símbolos incompatíveis (resto da divisão de caracter com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ᐤ' % \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (resto da divisão de caracter com texto)');
// 			(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" % \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (resto da divisão de textos)');
// 			//(function() {return parser.evaluateStringExpr('5 * ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 * (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');	
// 		})

// 	})

// })


// /*describe(' Potenciação (&&) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	assert.strictEqual(256, parser.evaluateStringExpr("2&&8"), 'Esperado valor 256 da potenciação (potenciação de inteiros)');
// 	    	assert.strictEqual(0.9062229370283311, parser.evaluateStringExpr("293 && 323.32"), 'Esperado valor 0.9062229370283311 da potenciação (potenciação de inteiro com real)');
// 	    	assert.strictEqual(0.025997904613609214, parser.evaluateStringExpr("243.92332 && 9382.4223"), 'Esperado valor 0.025997904613609214 da potenciação (potenciação de reais)');
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){
// 	    	assert.typeOf( parser.evaluateStringExpr("732 && 342"), 'number', 'Esperado number da potenciação (potenciação de inteiros)');
// 	    	assert.typeOf( parser.evaluateStringExpr("293 && 323.32"), 'number', 'Esperado number da potenciação (potenciação de inteiro com real)');
// 	    	assert.typeOf( parser.evaluateStringExpr("243.92332 && 9382.4223"), 'number' ,'Esperado number da potenciação (potenciação de reais)');  	
// 	    })
//     	//    		235&&87 erro?
//     	it('.throw()', function (){
//     		2358&&877 erro
//     		assert.throws(function() {return parser.evaluateStringExpr("89723 && TRUE"); },'Símbolos incompatíveis (potenciação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("5293 && \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (potenciação de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'c' && 3292"); },'Símbolos incompatíveis (potenciação de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3229.4209 && TRUE"); },'Símbolos incompatíveis (potenciação de real com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("32879.90 && \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (potenciação de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3322.34029 && '吃'"); },'Símbolos incompatíveis (potenciação de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("TRUE && FALSE"); },'Símbolos incompatíveis (potenciação de lógicos)');
//     		assert.throws(function() {return parser.evaluateStringExpr("TRUE && \"p02姚ń级\""); },'Símbolos incompatíveis (potenciação de lógico com texto)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("TRUE && 'უ'"); },'Símbolos incompatíveis (potenciação de lógico com caracter)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("'ಯ' && '౼'"); },'Símbolos incompatíveis (potenciação de caracter com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'ᐤ' && \"t3쥯꾟3\""); },'Símbolos incompatíveis (potenciação de caracter com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" && \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (potenciação de textos)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 && ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){
// 	    	expect(parser.evaluateStringExpr("732 && 342"), 'Esperado valor 2 da potenciação (potenciação de inteiros)').to.equal(2);
// 	    	expect(parser.evaluateStringExpr("293 && 323.32"), 'Esperado valor 0.9062229370283311 da potenciação (potenciação de inteiro com real)').to.equal(0.9062229370283311);;
// 	    	expect(parser.evaluateStringExpr("243.92332 && 9382.4223"), 'Esperado valor 0.025997904613609214 da potenciação (potenciação de reais)').to.equal(0.025997904613609214);
// 	    })

//   		it('.typeOf()', function (){
//   			expect(parser.evaluateStringExpr("732 && 342")).to.be.a('number');
//   			expect(parser.evaluateStringExpr("293 && 323.32")).to.be.a('number');
//   			expect(parser.evaluateStringExpr("243.92332 && 9382.4223")).to.be.a('number');		
//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("89723 && TRUE"); }).to.throw('Símbolos incompatíveis (potenciação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("5293 && \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (potenciação de inteiro com texto)');	
//   			expect(function() {return parser.evaluateStringExpr("'c' && 3292"); }).to.throw('Símbolos incompatíveis (potenciação de caracter com inteiro)');
//   			expect(function() {return parser.evaluateStringExpr("3229.4209 && TRUE"); }).to.throw('Símbolos incompatíveis (potenciação de real com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("32879.90 && \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (potenciação de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("3322.34029 && '吃'"); }).to.throw('Símbolos incompatíveis (potenciação de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE && FALSE"); }).to.throw('Símbolos incompatíveis (potenciação de lógicos)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE && \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (potenciação de lógico com texto)');
// 			expect(function() {return parser.evaluateStringExpr("TRUE && 'უ'"); }).to.throw('Símbolos incompatíveis (potenciação de lógico com caracter)');
// 			expect(function() {return parser.evaluateStringExpr("'ಯ' && '౼'"); }).to.throw('Símbolos incompatíveis (potenciação de caracter com caracter)');  			
// 			expect(function() {return parser.evaluateStringExpr("'ᐤ' && \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (potenciação de caracter com texto)');
// 			expect(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" && \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (potenciação de textos)');
//     		//expect(function() {return parser.evaluateStringExpr('5 && ('); }).to.throw();    		
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){
// 		 	parser.evaluateStringExpr("732 && 342").should.equal(2, 'Esperado valor 2 da potenciação (potenciação de inteiros)');
// 		 	parser.evaluateStringExpr("293 && 323.32").should.equal(0.9062229370283311, 'Esperado valor 0.9062229370283311 da potenciação (potenciação de inteiro com real)');
// 		 	parser.evaluateStringExpr("243.92332 && 9382.4223").should.equal(583.9209669999999, 'Esperado valor 583.9209669999999 da potenciação (potenciação de reais)');
// 	    })

// 		it('.typeOf()', function (){	
// 			(parser.evaluateStringExpr("732 && 342")).should.be.a('number');
// 			(parser.evaluateStringExpr("293 && 323.32")).should.be.a('number');
// 			(parser.evaluateStringExpr("243.92332 && 9382.4223")).should.be.a('number');
// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("89723 && TRUE"); }).should.throw('Símbolos incompatíveis (potenciação de inteiro com lógico)');	
// 			(function() {return parser.evaluateStringExpr("5293 && \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (potenciação de inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("'c' && 3292"); }).should.throw('Símbolos incompatíveis (potenciação de caracter com inteiro)');	
// 			(function() {return parser.evaluateStringExpr("3229.4209 && TRUE"); }).should.throw('Símbolos incompatíveis (potenciação de real com lógico)');
// 			(function() {return parser.evaluateStringExpr("32879.90 && \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (potenciação de real com texto)');
// 			(function() {return parser.evaluateStringExpr("3322.34029 && '吃'"); }).should.throw('Símbolos incompatíveis (potenciação de real com caracter)');
// 			(function() {return parser.evaluateStringExpr("TRUE && FALSE"); }).should.throw('Símbolos incompatíveis (potenciação de lógicos)');
// 			(function() {return parser.evaluateStringExpr("TRUE && \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (potenciação de lógico com texto)');
// 			(function() {return parser.evaluateStringExpr("TRUE && 'უ'"); }).should.throw('Símbolos incompatíveis (potenciação de lógico com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ಯ' && '౼'"); }).should.throw('Símbolos incompatíveis (potenciação de caracter com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ᐤ' && \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (potenciação de caracter com texto)');
// 			(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" && \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (potenciação de textos)');
// 			//(function() {return parser.evaluateStringExpr('5 * ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 * (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');	
// 		})

// 	})

// })*/

// describe(' Operador Lógico && (&&) ', function (){
// 	describe(' assert ', function (){
// 	    it('.strictEqual()', function () {
// 	    	assert.strictEqual(FALSE, parser.evaluateStringExpr("FALSE && FALSE"), 'Esperado valor FALSE do && lógico (&& lógico de lógicos)');
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){
// 	    	assert.typeOf( parser.evaluateStringExpr("FALSE && FALSE"), 'boolean', 'Esperado number da && lógico (&& lógico de inteiros)');	
// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("893 && 8998"); },'Símbolos incompatíveis (&& lógico de inteiros)');    		
//     		assert.throws(function() {return parser.evaluateStringExpr("8972 && 895.784"); },'Símbolos incompatíveis (&& lógico de inteiro com real)');    		
//     		assert.throws(function() {return parser.evaluateStringExpr("89723 && TRUE"); },'Símbolos incompatíveis (&& lógico de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("5293 && \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (&& lógico de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'c' && 3292"); },'Símbolos incompatíveis (&& lógico de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("8973.23 && 55987.54"); },'Símbolos incompatíveis (&& lógico de reais)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3229.4209 && TRUE"); },'Símbolos incompatíveis (&& lógico de real com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("32879.90 && \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (&& lógico de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3322.34029 && '吃'"); },'Símbolos incompatíveis (&& lógico de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("TRUE && \"p02姚ń级\""); },'Símbolos incompatíveis (&& lógico de lógico com texto)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("TRUE && 'უ'"); },'Símbolos incompatíveis (&& lógico de lógico com caracter)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("'ಯ' && '౼'"); },'Símbolos incompatíveis (&& lógico de caracter com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'ᐤ' && \"t3쥯꾟3\""); },'Símbolos incompatíveis (&& lógico de caracter com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" && \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (&& lógico de textos)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 && ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){
// 	    	expect(parser.evaluateStringExpr("FALSE && FALSE"), 'Esperado valor FALSE do && lógico (&& lógico de lógicos').to.equal(FALSE);
// 	    })

//   		it('.typeOf()', function (){
//   			expect(parser.evaluateStringExpr("FALSE && FALSE")).to.be.a('boolean');		
//   		})


//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("893 && 8998"); }).to.throw('Símbolos incompatíveis (&& lógico de inteiros)');
//   			expect(function() {return parser.evaluateStringExpr("8972 && 895.784"); }).to.throw('Símbolos incompatíveis (&& lógico de inteiro com real)');
//   			expect(function() {return parser.evaluateStringExpr("89723 && TRUE"); }).to.throw('Símbolos incompatíveis (&& lógico de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("5293 && \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (&& lógico de inteiro com texto)');	
//   			expect(function() {return parser.evaluateStringExpr("'c' && 3292"); }).to.throw('Símbolos incompatíveis (&& lógico de caracter com inteiro)');
// 			expect(function() {return parser.evaluateStringExpr("8973.23 && 55987.54"); }).to.throw('Símbolos incompatíveis (&& lógico de reais)');
//   			expect(function() {return parser.evaluateStringExpr("3229.4209 && TRUE"); }).to.throw('Símbolos incompatíveis (&& lógico de real com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("32879.90 && \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (&& lógico de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("3322.34029 && '吃'"); }).to.throw('Símbolos incompatíveis (&& lógico de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE && FALSE"); }).to.throw('Símbolos incompatíveis (&& lógico de lógicos)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE && \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (&& lógico de lógico com texto)');
// 			expect(function() {return parser.evaluateStringExpr("TRUE && 'უ'"); }).to.throw('Símbolos incompatíveis (&& lógico de lógico com caracter)');
// 			expect(function() {return parser.evaluateStringExpr("'ಯ' && '౼'"); }).to.throw('Símbolos incompatíveis (&& lógico de caracter com caracter)');  			
// 			expect(function() {return parser.evaluateStringExpr("'ᐤ' && \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (&& lógico de caracter com texto)');
// 			expect(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" && \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (&& lógico de textos)');
//     		//expect(function() {return parser.evaluateStringExpr('5 && ('); }).to.throw();    		
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){
// 		 	parser.evaluateStringExpr("FALSE && FALSE").should.equal(FALSE, 'Esperado valor FALSE do && lógico (&& lógico de lógicos');
// 	    })

// 		it('.typeOf()', function (){	
// 			(parser.evaluateStringExpr("FALSE && FALSE")).should.be.a('boolean');
// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("893 && 8998"); }).should.throw('Símbolos incompatíveis (&& lógico de inteiros)');
// 			(function() {return parser.evaluateStringExpr("8972 && 895.784"); }).should.throw('Símbolos incompatíveis (&& lógico de inteiro com real)');
// 			(function() {return parser.evaluateStringExpr("89723 && TRUE"); }).should.throw('Símbolos incompatíveis (&& lógico de inteiro com lógico)');	
// 			(function() {return parser.evaluateStringExpr("5293 && \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (&& lógico de inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("'c' && 3292"); }).should.throw('Símbolos incompatíveis (&& lógico de caracter com inteiro)');	
// 			(function() {return parser.evaluateStringExpr("8973.23 && 55987.54"); }).should.throw('Símbolos incompatíveis (&& lógico de reais)');
// 			(function() {return parser.evaluateStringExpr("3229.4209 && TRUE"); }).should.throw('Símbolos incompatíveis (&& lógico de real com lógico)');
// 			(function() {return parser.evaluateStringExpr("32879.90 && \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (&& lógico de real com texto)');
// 			(function() {return parser.evaluateStringExpr("3322.34029 && '吃'"); }).should.throw('Símbolos incompatíveis (&& lógico de real com caracter)');
// 			(function() {return parser.evaluateStringExpr("TRUE && FALSE"); }).should.throw('Símbolos incompatíveis (&& lógico de lógicos)');
// 			(function() {return parser.evaluateStringExpr("TRUE && \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (&& lógico de lógico com texto)');
// 			(function() {return parser.evaluateStringExpr("TRUE && 'უ'"); }).should.throw('Símbolos incompatíveis (&& lógico de lógico com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ಯ' && '౼'"); }).should.throw('Símbolos incompatíveis (&& lógico de caracter com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ᐤ' && \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (&& lógico de caracter com texto)');
// 			(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" && \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (&& lógico de textos)');
// 			//(function() {return parser.evaluateStringExpr('5 * ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 * (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');	
// 		})

// 	})

// })

// describe(' Operador Lógico || (||) ', function (){
// 	describe(' assert ', function (){
// 	    it('.strictEqual()', function () {
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("FALSE || FALSE"), 'Esperado valor TRUE do || lógico (|| lógico de lógicos)');
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){
// 	    	assert.typeOf( parser.evaluateStringExpr("FALSE || FALSE"), 'boolean', 'Esperado number da || lógico (|| lógico de inteiros)');	
// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("893 || 8998"); },'Símbolos incompatíveis (|| lógico de inteiros)');    		
//     		assert.throws(function() {return parser.evaluateStringExpr("8972 || 895.784"); },'Símbolos incompatíveis (|| lógico de inteiro com real)');    		
//     		assert.throws(function() {return parser.evaluateStringExpr("89723 || TRUE"); },'Símbolos incompatíveis (|| lógico de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("5293 || \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (|| lógico de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'c' || 3292"); },'Símbolos incompatíveis (|| lógico de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("8973.23 || 55987.54"); },'Símbolos incompatíveis (|| lógico de reais)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3229.4209 || TRUE"); },'Símbolos incompatíveis (|| lógico de real com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("32879.90 || \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (|| lógico de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("3322.34029 || '吃'"); },'Símbolos incompatíveis (|| lógico de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("TRUE || \"p02姚ń级\""); },'Símbolos incompatíveis (|| lógico de lógico com texto)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("TRUE || 'უ'"); },'Símbolos incompatíveis (|| lógico de lógico com caracter)');
//     	    assert.throws(function() {return parser.evaluateStringExpr("'ಯ' || '౼'"); },'Símbolos incompatíveis (|| lógico de caracter com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'ᐤ' || \"t3쥯꾟3\""); },'Símbolos incompatíveis (|| lógico de caracter com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" || \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (|| lógico de textos)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 || ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){
// 	    	expect(parser.evaluateStringExpr("FALSE || FALSE"), 'Esperado valor TRUE do || lógico (|| lógico de lógicos').to.equal(TRUE);
// 	    })

//   		it('.typeOf()', function (){
//   			expect(parser.evaluateStringExpr("FALSE || FALSE")).to.be.a('boolean');		
//   		})


//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("893 || 8998"); }).to.throw('Símbolos incompatíveis (|| lógico de inteiros)');
//   			expect(function() {return parser.evaluateStringExpr("8972 || 895.784"); }).to.throw('Símbolos incompatíveis (|| lógico de inteiro com real)');
//   			expect(function() {return parser.evaluateStringExpr("89723 || TRUE"); }).to.throw('Símbolos incompatíveis (|| lógico de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("5293 || \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (|| lógico de inteiro com texto)');	
//   			expect(function() {return parser.evaluateStringExpr("'c' || 3292"); }).to.throw('Símbolos incompatíveis (|| lógico de caracter com inteiro)');
// 			expect(function() {return parser.evaluateStringExpr("8973.23 || 55987.54"); }).to.throw('Símbolos incompatíveis (|| lógico de reais)');
//   			expect(function() {return parser.evaluateStringExpr("3229.4209 || TRUE"); }).to.throw('Símbolos incompatíveis (|| lógico de real com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("32879.90 || \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (|| lógico de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("3322.34029 || '吃'"); }).to.throw('Símbolos incompatíveis (|| lógico de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE || FALSE"); }).to.throw('Símbolos incompatíveis (|| lógico de lógicos)');
//   			expect(function() {return parser.evaluateStringExpr("TRUE || \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (|| lógico de lógico com texto)');
// 			expect(function() {return parser.evaluateStringExpr("TRUE || 'უ'"); }).to.throw('Símbolos incompatíveis (|| lógico de lógico com caracter)');
// 			expect(function() {return parser.evaluateStringExpr("'ಯ' || '౼'"); }).to.throw('Símbolos incompatíveis (|| lógico de caracter com caracter)');  			
// 			expect(function() {return parser.evaluateStringExpr("'ᐤ' || \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (|| lógico de caracter com texto)');
// 			expect(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" || \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (|| lógico de textos)');
//     		//expect(function() {return parser.evaluateStringExpr('5 || ('); }).to.throw();    		
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){
// 		 	parser.evaluateStringExpr("FALSE || FALSE").should.equal(TRUE, 'Esperado valor TRUE do || lógico (|| lógico de lógicos');
// 	    })

// 		it('.typeOf()', function (){	
// 			(parser.evaluateStringExpr("FALSE || FALSE")).should.be.a('boolean');
// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("893 || 8998"); }).should.throw('Símbolos incompatíveis (|| lógico de inteiros)');
// 			(function() {return parser.evaluateStringExpr("8972 || 895.784"); }).should.throw('Símbolos incompatíveis (|| lógico de inteiro com real)');
// 			(function() {return parser.evaluateStringExpr("89723 || TRUE"); }).should.throw('Símbolos incompatíveis (|| lógico de inteiro com lógico)');	
// 			(function() {return parser.evaluateStringExpr("5293 || \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (|| lógico de inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("'c' || 3292"); }).should.throw('Símbolos incompatíveis (|| lógico de caracter com inteiro)');	
// 			(function() {return parser.evaluateStringExpr("8973.23 || 55987.54"); }).should.throw('Símbolos incompatíveis (|| lógico de reais)');
// 			(function() {return parser.evaluateStringExpr("3229.4209 || TRUE"); }).should.throw('Símbolos incompatíveis (|| lógico de real com lógico)');
// 			(function() {return parser.evaluateStringExpr("32879.90 || \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (|| lógico de real com texto)');
// 			(function() {return parser.evaluateStringExpr("3322.34029 || '吃'"); }).should.throw('Símbolos incompatíveis (|| lógico de real com caracter)');
// 			(function() {return parser.evaluateStringExpr("TRUE || FALSE"); }).should.throw('Símbolos incompatíveis (|| lógico de lógicos)');
// 			(function() {return parser.evaluateStringExpr("TRUE || \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (|| lógico de lógico com texto)');
// 			(function() {return parser.evaluateStringExpr("TRUE || 'უ'"); }).should.throw('Símbolos incompatíveis (|| lógico de lógico com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ಯ' || '౼'"); }).should.throw('Símbolos incompatíveis (|| lógico de caracter com caracter)');
// 			(function() {return parser.evaluateStringExpr("'ᐤ' || \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (|| lógico de caracter com texto)');
// 			(function() {return parser.evaluateStringExpr("\"t3嵊୴s犏t\" || \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (|| lógico de textos)');
// 			//(function() {return parser.evaluateStringExpr('5 * ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 * (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');	
// 		})

// 	})

// })

// describe(' Operadores Relacionais entre inteiros (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	assert.strictEqual(FALSE, parser.evaluateStringExpr("87 < 50"), 'Esperado valor FALSE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("546 <= 5023"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("5462 > 53"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(FALSE, parser.evaluateStringExpr("54622 >= 8844684"), 'Esperado valor FALSE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("546 == 546"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(FALSE, parser.evaluateStringExpr("546 != 546"), 'Esperado valor FALSE da operação');
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){
// 	    	assert.typeOf( parser.evaluateStringExpr("87 < 50"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("546 <= 5023"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("5462 > 53"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("54622 >= 8844684"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("546 == 546"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("546 != 546"), 'boolean', 'Esperado boolean da operação');
// 	    })

//     	it('.throw()', function (){
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){
// 	    	expect(parser.evaluateStringExpr("87 < 50"), 'Esperado valor FALSE da operação').to.equal(FALSE);
// 	    	expect(parser.evaluateStringExpr("546 <= 5023"), 'Esperado valor TRUE da operação').to.equal(TRUE);
// 	    	expect(parser.evaluateStringExpr("5462 > 53"), 'Esperado valor TRUE da operação').to.equal(TRUE);
// 	    	expect(parser.evaluateStringExpr("54622 >= 8844684"), 'Esperado valor FALSE da operação').to.equal(FALSE);
// 	    	expect(parser.evaluateStringExpr("546 == 546"), 'Esperado valor TRUE da operação').to.equal(TRUE);
// 	    	expect(parser.evaluateStringExpr("546 != 546"), 'Esperado valor FALSE da operação').to.equal(FALSE);
// 	    })

//   		it('.typeOf()', function (){
//   			expect(parser.evaluateStringExpr("87 < 50")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("546 <= 5023")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("5462 > 53")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("54622 >= 8844684")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("546 == 546")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("546 != 546")).to.be.a('boolean');
//   		})

//   		it('.throw()', function (){
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){
// 		 	parser.evaluateStringExpr("87 < 50").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 		 	parser.evaluateStringExpr("546 <= 5023").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 		 	parser.evaluateStringExpr("5462 > 53").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 		 	parser.evaluateStringExpr("54622 >= 8844684").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 		 	parser.evaluateStringExpr("546 == 546").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 		 	parser.evaluateStringExpr("546 != 546").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 	    })


// 		it('.typeOf()', function (){	
// 			(parser.evaluateStringExpr("87 < 50")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("546 <= 5023")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("5462 > 53")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("54622 >= 8844684")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("546 == 546")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("546 != 546")).should.be.a('boolean');

// 		})

// 		it('.throw()', function (){	
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })

// describe(' Operadores Relacionais entre inteiro e real (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	assert.strictEqual(FALSE, parser.evaluateStringExpr("87 < 50.55877"), 'Esperado valor FALSE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("546 <= 5023.487266"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("5462 > 53.48726623"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(FALSE, parser.evaluateStringExpr("54622 >= 8844684.47855"), 'Esperado valor FALSE da operação');
// 	    	assert.strictEqual(FALSE, parser.evaluateStringExpr("546 == 546.44998"), 'Esperado valor FALSE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("546 != 546.44998"), 'Esperado valor TRUE da operação');
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){
// 	    	assert.typeOf( parser.evaluateStringExpr("87 < 50.55877"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("546 <= 5023.487266"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("5462 > 53.48726623"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("54622 >= 8844684.47855"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("546 == 546.44998"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("546 != 546.44998"), 'boolean', 'Esperado boolean da operação');
// 	    })

//     	it('.throw()', function (){
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){
// 	    	expect(parser.evaluateStringExpr("87 < 50.55877"), 'Esperado valor FALSE da operação').to.equal(FALSE);
// 	    	expect(parser.evaluateStringExpr("546 <= 5023.487266"), 'Esperado valor TRUE da operação').to.equal(TRUE);
// 	    	expect(parser.evaluateStringExpr("5462 > 53.48726623"), 'Esperado valor TRUE da operação').to.equal(TRUE);
// 	    	expect(parser.evaluateStringExpr("54622 >= 8844684.47855"), 'Esperado valor FALSE da operação').to.equal(FALSE);
// 	    	expect(parser.evaluateStringExpr("546 == 546.44998"), 'Esperado valor TRUE da operação').to.equal(FALSE);
// 	    	expect(parser.evaluateStringExpr("546 != 546.44998"), 'Esperado valor FALSE da operação').to.equal(TRUE);
// 	    })

//   		it('.typeOf()', function (){
//   			expect(parser.evaluateStringExpr("87 < 50.55877")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("546 <= 5023.487266")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("5462 > 53.48726623")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("54622 >= 8844684.47855")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("546 == 546.44998")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("546 != 546.44998")).to.be.a('boolean');
//   		})

//   		it('.throw()', function (){
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){
// 		 	parser.evaluateStringExpr("87 < 50.55877").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 		 	parser.evaluateStringExpr("546 <= 5023.487266").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 		 	parser.evaluateStringExpr("5462 > 53.48726623").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 		 	parser.evaluateStringExpr("54622 >= 8844684.47855").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 		 	parser.evaluateStringExpr("546 == 546.44998").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 		 	parser.evaluateStringExpr("546 != 546.44998").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 	    })


// 		it('.typeOf()', function (){	
// 			(parser.evaluateStringExpr("87 < 50.55877")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("546 <= 5023.487266.487266")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("5462 > 53.48726623")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("54622 >= 8844684.47855")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("546 == 546.44998")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("546 != 546.44998")).should.be.a('boolean');

// 		})

// 		it('.throw()', function (){	
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })

// describe(' Operadores Relacionais entre inteiro e lógico (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){

// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("893574 < FALSE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89357423 <= TRUE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89014 > FALSE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("8910 >= FALSE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89882 == TRUE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("800125 != TRUE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){

// 	    })

//   		it('.typeOf()', function (){

//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("893574 < FALSE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("89357423 <= TRUE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("89014 > FALSE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("8910 >= FALSE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("89882 == TRUE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("800125 != TRUE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){

// 	    })


// 		it('.typeOf()', function (){	

// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("893574 < FALSE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("89357423 <= TRUE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("89014 > FALSE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("8910 >= FALSE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("89882 == TRUE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("800125 != TRUE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })

// describe(' Operadores Relacionais entre inteiro e texto (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){

// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("893574 < \"ᖥ�Ȧ훢᎖쏜쎴\""); },'Símbolos incompatíveis (operação de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89357423 <= \"ᖥ�Ȧ훢᎖쏜쎴\""); },'Símbolos incompatíveis (operação de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89014 > \"ᖥ�Ȧ훢᎖쏜쎴\""); },'Símbolos incompatíveis (operação de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("8910 >= \"ᖥ�Ȧ훢᎖쏜쎴\""); },'Símbolos incompatíveis (operação de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89882 == \"ᖥ�Ȧ훢᎖쏜쎴\""); },'Símbolos incompatíveis (operação de inteiro com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("800125 != \"ᖥ�Ȧ훢᎖쏜쎴\""); },'Símbolos incompatíveis (operação de inteiro com texto)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){

// 	    })

//   		it('.typeOf()', function (){

//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("893574 < \"ᖥ�Ȧ훢᎖쏜쎴\""); }).to.throw('Símbolos incompatíveis (operação de inteiro com texto)');
//   			expect(function() {return parser.evaluateStringExpr("89357423 <= \"ᖥ�Ȧ훢᎖쏜쎴\""); }).to.throw('Símbolos incompatíveis (operação de inteiro com texto)');
//   			expect(function() {return parser.evaluateStringExpr("89014 > \"ᖥ�Ȧ훢᎖쏜쎴\""); }).to.throw('Símbolos incompatíveis (operação de inteiro com texto)');
//   			expect(function() {return parser.evaluateStringExpr("8910 >= \"ᖥ�Ȧ훢᎖쏜쎴\""); }).to.throw('Símbolos incompatíveis (operação de inteiro com texto)');
//   			expect(function() {return parser.evaluateStringExpr("89882 == \"ᖥ�Ȧ훢᎖쏜쎴\""); }).to.throw('Símbolos incompatíveis (operação de inteiro com texto)');
//   			expect(function() {return parser.evaluateStringExpr("800125 != \"ᖥ�Ȧ훢᎖쏜쎴\""); }).to.throw('Símbolos incompatíveis (operação de inteiro com texto)');
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){

// 	    })


// 		it('.typeOf()', function (){	

// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("893574 < \"ᖥ�Ȧ훢᎖쏜쎴\""); }).should.throw('Símbolos incompatíveis (operação inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("89357423 <= \"ᖥ�Ȧ훢᎖쏜쎴\""); }).should.throw('Símbolos incompatíveis (operação inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("89014 > \"ᖥ�Ȧ훢᎖쏜쎴\""); }).should.throw('Símbolos incompatíveis (operação inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("8910 >= \"ᖥ�Ȧ훢᎖쏜쎴\""); }).should.throw('Símbolos incompatíveis (operação inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("89882 == \"ᖥ�Ȧ훢᎖쏜쎴\""); }).should.throw('Símbolos incompatíveis (operação inteiro com texto)');
// 			(function() {return parser.evaluateStringExpr("800125 != \"ᖥ�Ȧ훢᎖쏜쎴\""); }).should.throw('Símbolos incompatíveis (operação inteiro com texto)');
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })

// describe(' Operadores Relacionais entre caracter e inteiro (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){

// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("'쎽' < 54668"); },'Símbolos incompatíveis (operação de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'쎆' <= 5997411"); },'Símbolos incompatíveis (operação de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'쎋' > 1110"); },'Símbolos incompatíveis (operação de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'쎎' >= 1100668"); },'Símbolos incompatíveis (operação de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'쎑' == 11006578"); },'Símbolos incompatíveis (operação de caracter com inteiro)');
//     		assert.throws(function() {return parser.evaluateStringExpr("'쎕' != 1105598"); },'Símbolos incompatíveis (operação de caracter com inteiro)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){

// 	    })

//   		it('.typeOf()', function (){

//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("'쎽' < 54668"); }).to.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
//   			expect(function() {return parser.evaluateStringExpr("'쎆' <= 5997411"); }).to.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
//   			expect(function() {return parser.evaluateStringExpr("'쎋' > 1110"); }).to.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
//   			expect(function() {return parser.evaluateStringExpr("'쎎' >= 1100668"); }).to.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
//   			expect(function() {return parser.evaluateStringExpr("'쎑' == 11006578"); }).to.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
//   			expect(function() {return parser.evaluateStringExpr("'쎕' != 1105598"); }).to.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){

// 	    })


// 		it('.typeOf()', function (){	

// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("'쎽' < 54668"); }).should.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
// 			(function() {return parser.evaluateStringExpr("'쎆' <= 5997411"); }).should.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
// 			(function() {return parser.evaluateStringExpr("'쎋' > 1110"); }).should.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
// 			(function() {return parser.evaluateStringExpr("'쎎' >= 1100668"); }).should.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
// 			(function() {return parser.evaluateStringExpr("'쎑' == 11006578"); }).should.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
// 			(function() {return parser.evaluateStringExpr("'쎕' != 1105598"); }).should.throw('Símbolos incompatíveis (operação de caracter com inteiro)');
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })

// describe(' Operadores Relacionais entre reais (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("26698.11201 < 54632.25544"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(FALSE, parser.evaluateStringExpr("2558.588 <= 00000.24412"), 'Esperado valor FALSE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("000.00054786321 > 0.0000001155"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("0.555447639 >= -2552.255"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("025.477 == 025.477"), 'Esperado valor TRUE da operação');
// 	    	assert.strictEqual(TRUE, parser.evaluateStringExpr("2411.0144 != 00.554400"), 'Esperado valor TRUE da operação');
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){
// 	    	assert.typeOf( parser.evaluateStringExpr("26698.11201 < 54632.25544"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("2558.588 <= 00000.24412"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("000.00054786321 > 0.0000001155"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("0.555447639 >= -2552.255"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("025.477 == 025.477"), 'boolean', 'Esperado boolean da operação');
// 	    	assert.typeOf( parser.evaluateStringExpr("2411.0144 != 00.554400"), 'boolean', 'Esperado boolean da operação');
// 	    })

//     	it('.throw()', function (){
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){
// 	    	expect(parser.evaluateStringExpr("26698.11201 < 54632.25544"), 'Esperado valor FALSE da operação').to.equal(FALSE);
// 	    	expect(parser.evaluateStringExpr("2558.588 <= 00000.24412"), 'Esperado valor TRUE da operação').to.equal(TRUE);
// 	    	expect(parser.evaluateStringExpr("000.00054786321 > 0.0000001155"), 'Esperado valor TRUE da operação').to.equal(TRUE);
// 	    	expect(parser.evaluateStringExpr("0.555447639 >= -2552.255"), 'Esperado valor FALSE da operação').to.equal(FALSE);
// 	    	expect(parser.evaluateStringExpr("025.477 == 025.477"), 'Esperado valor TRUE da operação').to.equal(FALSE);
// 	    	expect(parser.evaluateStringExpr("2411.0144 != 00.554400"), 'Esperado valor FALSE da operação').to.equal(TRUE);
// 	    })

//   		it('.typeOf()', function (){
//   			expect(parser.evaluateStringExpr("26698.11201 < 54632.25544")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("2558.588 <= 00000.24412")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("000.00054786321 > 0.0000001155")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("0.555447639 >= -2552.255")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("025.477 == 025.477")).to.be.a('boolean');
//   			expect(parser.evaluateStringExpr("2411.0144 != 00.554400")).to.be.a('boolean');
//   		})

//   		it('.throw()', function (){
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){
// 		 	parser.evaluateStringExpr("26698.11201 < 54632.25544").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 		 	parser.evaluateStringExpr("2558.588 <= 00000.24412").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 		 	parser.evaluateStringExpr("000.00054786321 > 0.0000001155").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 		 	parser.evaluateStringExpr("0.555447639 >= -2552.255").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 		 	parser.evaluateStringExpr("025.477 == 025.477").should.equal(FALSE, 'Esperado valor FALSE da operação');
// 		 	parser.evaluateStringExpr("2411.0144 != 00.554400").should.equal(TRUE, 'Esperado valor TRUE da operação');
// 	    })


// 		it('.typeOf()', function (){	
// 			(parser.evaluateStringExpr("26698.11201 < 54632.25544")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("2558.588 <= 00000.24412.487266")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("5462 > 53.48726623")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("0.555447639 >= -2552.255")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("025.477 == 025.477")).should.be.a('boolean');
// 			(parser.evaluateStringExpr("2411.0144 != 00.554400")).should.be.a('boolean');

// 		})

// 		it('.throw()', function (){	
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })

// describe(' Operadores Relacionais entre inteiro e lógico (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){

// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("823.23374 < FALSE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("893.57234233 <= TRUE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("112555.10001 > FALSE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("8001.55787 >= FALSE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89229.54100 == TRUE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		assert.throws(function() {return parser.evaluateStringExpr("82.00125 != TRUE"); },'Símbolos incompatíveis (operação de inteiro com lógico)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){

// 	    })

//   		it('.typeOf()', function (){

//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("823.23374 < FALSE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("893.57234233 <= TRUE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("112555.10001 > FALSE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("8001.55787 >= FALSE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("89229.54100 == TRUE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//   			expect(function() {return parser.evaluateStringExpr("82.00125 != TRUE"); }).to.throw('Símbolos incompatíveis (operação de inteiro com lógico)');
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){

// 	    })


// 		it('.typeOf()', function (){	

// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("823.23374 < FALSE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("893.57234233 <= TRUE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("112555.10001 > FALSE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("8001.55787 >= FALSE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("889229.54100 == TRUE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			(function() {return parser.evaluateStringExpr("82.00125 != TRUE"); }).should.throw('Símbolos incompatíveis (operação inteiro com lógico)');
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })

// describe(' Operadores Relacionais entre real e texto (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){

// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("823.23374 < \"ॷূ״״םמנעףפר\""); },'Símbolos incompatíveis (operação de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("893.57234233 <= \"ॷূ״״םמנעףפר\""); },'Símbolos incompatíveis (operação de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("112555.10001 > \"ॷূ״״םמנעףפר\""); },'Símbolos incompatíveis (operação de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("8001.55787 >= \"ॷূ״״םמנעףפר\""); },'Símbolos incompatíveis (operação de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89229.54100 == \"ॷূ״״םמנעףפר\""); },'Símbolos incompatíveis (operação de real com texto)');
//     		assert.throws(function() {return parser.evaluateStringExpr("82.00125 != \"ॷূ״״םמנעףפר\""); },'Símbolos incompatíveis (operação de real com texto)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){

// 	    })

//   		it('.typeOf()', function (){

//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("823.23374 < \"ॷূ״״םמנעףפר\""); }).to.throw('Símbolos incompatíveis (operação de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("893.57234233 <= \"ॷূ״״םמנעףפר\""); }).to.throw('Símbolos incompatíveis (operação de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("112555.10001 > \"ॷূ״״םמנעףפר\""); }).to.throw('Símbolos incompatíveis (operação de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("8001.55787 >= \"ॷূ״״םמנעףפר\""); }).to.throw('Símbolos incompatíveis (operação de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("89229.54100 == \"ॷূ״״םמנעףפר\""); }).to.throw('Símbolos incompatíveis (operação de real com texto)');
//   			expect(function() {return parser.evaluateStringExpr("82.00125 != \"ॷূ״״םמנעףפר\""); }).to.throw('Símbolos incompatíveis (operação de real com texto)');
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){

// 	    })


// 		it('.typeOf()', function (){	

// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("823.23374 < \"ॷূ״״םמנעףפר\""); }).should.throw('Símbolos incompatíveis (operação real com texto)');
// 			(function() {return parser.evaluateStringExpr("893.57234233 <= \"ॷূ״״םמנעףפר\""); }).should.throw('Símbolos incompatíveis (operação real com texto)');
// 			(function() {return parser.evaluateStringExpr("112555.10001 > \"ॷূ״״םמנעףפר\""); }).should.throw('Símbolos incompatíveis (operação real com texto)');
// 			(function() {return parser.evaluateStringExpr("8001.55787 >= \"ॷূ״״םמנעףפר\""); }).should.throw('Símbolos incompatíveis (operação real com texto)');
// 			(function() {return parser.evaluateStringExpr("889229.54100 == \"ॷূ״״םמנעףפר\""); }).should.throw('Símbolos incompatíveis (operação real com texto)');
// 			(function() {return parser.evaluateStringExpr("82.00125 != \"ॷূ״״םמנעףפר\""); }).should.throw('Símbolos incompatíveis (operação real com texto)');
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })


// describe(' Operadores Relacionais entre real e caracter (<, <=, >, >=, ==, !=) ', function (){
// 	describe(' assert ', function (){

// 	    it('.strictEqual()', function () {
// 	    	//assert.strictEqual(actual, expected, message);
// 	    })

// 	    it('.typeOf()', function (){

// 	    })

//     	it('.throw()', function (){
//     		assert.throws(function() {return parser.evaluateStringExpr("823.23374 < 'ᆨ'"); },'Símbolos incompatíveis (operação de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("893.57234233 <= 'ᆨ'"); },'Símbolos incompatíveis (operação de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("112555.10001 > 'ᆨ'"); },'Símbolos incompatíveis (operação de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("8001.55787 >= 'ᆨ'"); },'Símbolos incompatíveis (operação de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("89229.54100 == 'ᆨ'"); },'Símbolos incompatíveis (operação de real com caracter)');
//     		assert.throws(function() {return parser.evaluateStringExpr("82.00125 != 'ᆨ'"); },'Símbolos incompatíveis (operação de real com caracter)');
//     		//assert.throws(function() {return parser.evaluateStringExpr('5 + ('); },'parse error [column 5]: unmatched "()"');
// 	    })

// 	})

// 	describe(' expect ', function (){
//   		it('.equal()', function (){

// 	    })

//   		it('.typeOf()', function (){

//   		})

//   		it('.throw()', function (){
//   			expect(function() {return parser.evaluateStringExpr("823.23374 < 'ᆨ'"); }).to.throw('Símbolos incompatíveis (operação de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("893.57234233 <= 'ᆨ'"); }).to.throw('Símbolos incompatíveis (operação de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("112555.10001 > 'ᆨ'"); }).to.throw('Símbolos incompatíveis (operação de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("8001.55787 >= 'ᆨ'"); }).to.throw('Símbolos incompatíveis (operação de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("89229.54100 == 'ᆨ'"); }).to.throw('Símbolos incompatíveis (operação de real com caracter)');
//   			expect(function() {return parser.evaluateStringExpr("82.00125 != 'ᆨ'"); }).to.throw('Símbolos incompatíveis (operação de real com caracter)');
//     		//expect(function() {return parser.evaluateStringExpr('5 + ('); }).to.throw();
//   		})
// 	})

// 	describe(' should ', function (){
// 		 it('.equal()', function (){

// 	    })


// 		it('.typeOf()', function (){	

// 		})

// 		it('.throw()', function (){	
// 			(function() {return parser.evaluateStringExpr("823.23374 < 'ᆨ'"); }).should.throw('Símbolos incompatíveis (operação real com caracter)');
// 			(function() {return parser.evaluateStringExpr("893.57234233 <= 'ᆨ'"); }).should.throw('Símbolos incompatíveis (operação real com caracter)');
// 			(function() {return parser.evaluateStringExpr("112555.10001 > 'ᆨ'"); }).should.throw('Símbolos incompatíveis (operação real com caracter)');
// 			(function() {return parser.evaluateStringExpr("8001.55787 >= 'ᆨ'"); }).should.throw('Símbolos incompatíveis (operação real com caracter)');
// 			(function() {return parser.evaluateStringExpr("889229.54100 == 'ᆨ'"); }).should.throw('Símbolos incompatíveis (operação real com caracter)');
// 			(function() {return parser.evaluateStringExpr("82.00125 != 'ᆨ'"); }).should.throw('Símbolos incompatíveis (operação real com caracter)');
// 			//(function() {return parser.evaluateStringExpr('5 + ('); }).should.throw();
// 			//erro(function() {(parser.evaluateStringExpr('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
// 		})

// 	})

// })


 
// describe(' Multiplos sinais ', function(){
// 	describe(' assert ', function(){
// 		it(' .strictEqual() ', function(){
// 			assert.strictEqual();
// 		})

// 		it(' .typeOf() ', function(){

// 		})

// 		it(' throw() ', function(){

// 		})

// 		})
// })
