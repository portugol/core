////////////////////////////////////////////////////
//////////         PARSER TESTING         //////////
////////////////////////////////////////////////////

// mocha testes_parser.js

//Requires do parser
var Expression = require('./expression');
var Token = require('./token');
var tokenTypes= require('./definitions/token_types');
var comp=require('./compatibility/binary_comp');
var binops=require('./definitions/binary_operators');
var operandCodes=require('./compatibility/vartype_codes');
var Evaluator = require('./evaluator');
var unaryLeftComp=require('./compatibility/unary_left_comp');

//Biblioteca de asserts
var chai = require("./chai");

var assert = chai.assert,
	expect = chai.expect,
	should = chai.should(); //Should tem de ser executado

var parser = new Evaluator();
//var parser = new Parser();

//////////////////////////////////////Testar outros caracteres
///////////////////////////////////////////Testar subtracção com resultados negativos
///////////////////////////////////////////Testar soma de caracteres com + 1 caracter
///////////////////////////////////////////Testar os vários .
///////////////////////////////////////////-funções matemáticas (diz se tens parâmetros errados)
///////////////////////////////////////////-constantes
///////////////////////////////////////////-factorial
describe(' Soma (+) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(8, parser.evaluate("3 + 5"), 'Esperado valor 8 da soma (soma de inteiros)');
	    	assert.strictEqual(10.7, parser.evaluate("5 + 5.7"), 'Esperado valor 10.7 da soma (soma de inteiro com real)');
	    	assert.strictEqual("5teste", parser.evaluate("5 + \"teste\""), 'Esperado texto 5teste da soma (soma de inteiro com texto)');
	    	assert.strictEqual('b', parser.evaluate("'a' + 1"), 'Esperado caracter b da soma (soma de caracter com inteiro)');
	    	assert.strictEqual(9.0, parser.evaluate("4.5 + 4.5"), 'Esperado valor 9.0 da soma (soma de reais)');
	    	assert.strictEqual("13.9teste", parser.evaluate("13.9 + \"teste\""), 'Esperado texto 13.9teste da soma (soma de real com texto)');
	    	assert.strictEqual('Ȱ',parser.evaluate("'đ' + 'ğ'"), 'Esperado caracter Ȱ ͗da soma (soma de caracteres)');
	    	assert.strictEqual("Ńt3st3", parser.evaluate("'Ń' + \"t3st3\""), 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)');
	    	assert.strictEqual("t3starº*ß", parser.evaluate("\"t3st\" + \"arº*ß\""), 'Esperado texto t3starº*ß da soma (soma de textos)');
	    	//assert.strictEqual(actual, expected, message);
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluate("3 + 5"), 'number', 'Esperado number da soma (soma de inteiros)');
	    	assert.typeOf( parser.evaluate("5 + 5.7"), 'number', 'Esperado number da soma (soma de inteiro com real)');
	    	assert.typeOf( parser.evaluate("5 + \"teste\""), 'string','Esperado string da soma (soma de inteiro com texto)');
	    	assert.typeOf( parser.evaluate("'a' + 1"), 'string' , 'Esperado string da soma (soma de caracter com inteiro)');
	    	assert.typeOf( parser.evaluate("4.5 + 4.5"), 'number' ,'Esperado number da soma (soma de reais)');
	    	assert.typeOf( parser.evaluate("13.9 + \"teste\""), 'string' , 'Esperado string da soma (soma de real com texto)');
	    	assert.typeOf( parser.evaluate("'đ' + 'ğ'"), 'string' , 'Esperado string da soma (soma de caracteres)');
	    	assert.typeOf( parser.evaluate("'Ń' + \"t3st3\""), 'string' ,'Esperado string da soma (soma de caracter com texto)');
	    	assert.typeOf( parser.evaluate("\"t3st\" + \"arº*ß\""), 'string' , 'Esperado string da soma (soma de textos)');    	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluate("5 + true"); },'Símbolos incompatíveis (soma de inteiro com lógico)');
    		assert.throws(function() {return parser.evaluate("3.6 + true"); },'Símbolos incompatíveis (soma de real com lógico)');
    		assert.throws(function() {return parser.evaluate("34.3 + 'Ƨ'"); },'Símbolos incompatíveis (soma de real com caracter)');
    		assert.throws(function() {return parser.evaluate("true + false"); },'Símbolos incompatíveis (soma de lógicos)');
    		assert.throws(function() {return parser.evaluate("true + \"teste\""); },'Símbolos incompatíveis (soma de lógico com texto)');
    		assert.throws(function() {return parser.evaluate("false + 'უ'"); },'Símbolos incompatíveis (soma de lógico com caracter)');
    		//assert.throws(function() {return parser.evaluate('5 + ('); },'parse error [column 5]: unmatched "()"');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluate("3 + 5"), 'Esperado valor 8 da soma (soma de inteiros)').to.equal(8);
	    	expect(parser.evaluate("5 + 5.7"), 'Esperado valor 10.7 da soma (soma de inteiro com real)').to.equal(10.7);
	    	expect(parser.evaluate("5 + \"teste\""),  'Esperado string 5teste da soma (soma de inteiro com texto)').to.equal("5teste");
	    	expect(parser.evaluate("'a' + 1"), 'Esperado caracter b da soma (soma de caracter com inteiro)').to.equal('b');
	    	expect(parser.evaluate("4.5 + 4.5"), 'Esperado valor 9.0 da soma (soma de reais)').to.equal(9.0);
	    	expect(parser.evaluate("13.9 + \"teste\""), 'Esperado texto 13.9teste da soma (soma de real com texto)').to.equal("13.9teste");
	    	expect(parser.evaluate("'đ' + 'ğ'"), 'Esperado caracter Ȱ da soma (soma de caracteres)').to.equal('Ȱ');
	    	expect(parser.evaluate("'Ń' + \"t3st3\""), 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)').to.equal("Ńt3st3");
	    	expect(parser.evaluate("\"t3st\" + \"arº*ß\""), 'Esperado texto t3starº*ß da soma (soma de textos)').to.equal("t3starº*ß");
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluate("3 + 5")).to.be.a('number');
  			expect(parser.evaluate("5 + 5.7")).to.be.a('number');
  			expect(parser.evaluate("5 + \"teste\"")).to.be.a('string');
  			expect(parser.evaluate("'a' + 1")).to.be.a('string');
  			expect(parser.evaluate("4.5 + 4.5")).to.be.a('number');
  			expect(parser.evaluate("13.9 + \"teste\"")).to.be.a('string');
  			expect(parser.evaluate("'đ' + 'ğ'")).to.be.a('string');
  			expect(parser.evaluate("'Ń' + \"t3st3\"")).to.be.a('string');
  			expect(parser.evaluate("\"t3st\" + \"arº*ß\"")).to.be.a('string');
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluate("5 + true"); }).to.throw('Símbolos incompatíveis (soma de inteiro com lógico)');
  			expect(function() {return parser.evaluate("3.6 + true"); }).to.throw('Símbolos incompatíveis (soma de real com lógico)');
  			expect(function() {return parser.evaluate("34.3 + 'Ƨ'"); }).to.throw('Símbolos incompatíveis (soma de real com caracter)');
  			expect(function() {return parser.evaluate("true + false"); }).to.throw('Símbolos incompatíveis (soma de lógicos)');
  			expect(function() {return parser.evaluate("true + \"teste\""); }).to.throw('Símbolos incompatíveis (soma de lógico com texto)');
			expect(function() {return parser.evaluate("false + 'უ'"); }).to.throw('Símbolos incompatíveis (soma de lógico com caracter)');
    		//expect(function() {return parser.evaluate('5 + ('); }).to.throw();
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluate("3.5 + 5").should.equal(8, 'Esperado valor 8 da soma (soma de inteiros)');
		 	parser.evaluate("5 + 5.7").should.equal(10.7, 'Esperado valor 10.7 da soma (soma de inteiro com real)');
		 	parser.evaluate("5 + \"teste\"").should.equal("5teste", 'Esperado string 5teste da soma (soma de inteiro com texto)');
		 	parser.evaluate("'a' + 1").should.equal('b', 'Esperado caracter b da soma (soma de caracter com inteiro)');
		 	parser.evaluate("4.5 + 4.5").should.equal(9.0, 'Esperado valor 9.0 da soma (soma de reais)');
		 	parser.evaluate("13.9 + \"teste\"").should.equal("13.9teste", 'Esperado texto 13.9teste da soma (soma de real com texto)');
		 	parser.evaluate("'đ' + 'ğ'").should.equal('', 'Esperado caracter Ȱ da soma (soma de caracteres)');
		 	parser.evaluate("'Ń' + \"t3st3\"").should.equal("Ńt3st3", 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)');
		 	parser.evaluate("\"t3st\" + \"arº*ß\"").should.equal("t3starº*ß", 'Esperado texto t3starº*ß da soma (soma de textos)');	    	
	    })


		it('.typeOf()', function (){	
			(parser.evaluate("5 + 3")).should.be.a('number');
			(parser.evaluate("5 + 5.7")).should.be.a('number');
			(parser.evaluate("5 + \"teste\"")).should.be.a('string');
			(parser.evaluate("'a' + 1")).should.be.a('string');
			(parser.evaluate("4.5 + 4.5")).should.be.a('number');
			(parser.evaluate("13.9 + \"teste\"")).should.be.a('string');
			(parser.evaluate("'đ' + 'ğ'")).should.be.a('string');
			(parser.evaluate("'Ń' + \"t3st3\"")).should.be.a('string');
			(parser.evaluate("\"t3st\" + \"arº*ß\"")).should.be.a('string');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluate("5 + true"); }).should.throw('Símbolos incompatíveis (soma de inteiro com lógico)');
			(function() {return parser.evaluate("3.6 + true"); }).should.throw('Símbolos incompatíveis (soma de real com lógico)');
			(function() {return parser.evaluate("34.3 + 'Ƨ'"); }).should.throw('Símbolos incompatíveis (soma de real com caracter)');
			(function() {return parser.evaluate("true + false"); }).should.throw('Símbolos incompatíveis (soma de lógicos)');
			(function() {return parser.evaluate("true + \"teste\""); }).should.throw('Símbolos incompatíveis (soma de lógico com texto)');
			(function() {return parser.evaluate("false + 'უ'"); }).should.throw('Símbolos incompatíveis (soma de lógico com caracter)');
			//(function() {return parser.evaluate('5 + ('); }).should.throw();
			//erro(function() {(parser.evaluate('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
		})

	})

})

describe(' Subtracção (-) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(2, parser.evaluate("5 - 3"), 'Esperado valor 2 da subtracção (subtracção de inteiros)');
	    	assert.strictEqual(1.3, parser.evaluate("5 - 3.7"), 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)');
	    	assert.strictEqual('a', parser.evaluate("'b' - 1"), 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)');
	    	assert.strictEqual(4.29, parser.evaluate("6.87 - 2.58"), 'Esperado valor 4.29 da subtracção (subtracção de reais)');  																//3196
	    	assert.strictEqual('3',parser.evaluate("'ಯ' - '౼'"), 'Esperado caracter 3 da subtracção (subtracção de caracteres)');
	    	//assert.strictEqual(actual, expected, message);
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluate("5 - 3"), 'number', 'Esperado number da subtracção (subtracção de inteiros)');
	    	assert.typeOf( parser.evaluate("5 - 5.7"), 'number', 'Esperado number da subtracção (subtracção de inteiro com real)');
	    	assert.typeOf( parser.evaluate("'a' - 1"), 'string' , 'Esperado string da subtracção (subtracção de caracter com inteiro)');
	    	assert.typeOf( parser.evaluate("6.87 - 2.58"), 'number' ,'Esperado number da subtracção (subtracção de reais)');
	    	assert.typeOf( parser.evaluate("'ಯ' - '౼'"), 'string' , 'Esperado string da subtracção (subtracção de caracteres)');   	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluate("5 - true"); },'Símbolos incompatíveis (subtracção de inteiro com lógico)');
    		assert.throws(function() {return parser.evaluate("5 - \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (subtracção de inteiro com texto)')
    		assert.throws(function() {return parser.evaluate("3.623 - true"); },'Símbolos incompatíveis (subtracção de real com lógico)');
    		assert.throws(function() {return parser.evaluate("32.90 - \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (subtracção de real com texto)');
    		assert.throws(function() {return parser.evaluate("34.3 - '吃'"); },'Símbolos incompatíveis (subtracção de real com caracter)');
    		assert.throws(function() {return parser.evaluate("false - false"); },'Símbolos incompatíveis (subtracção de lógicos)');
    		assert.throws(function() {return parser.evaluate("false - \"p02姚ń级\""); },'Símbolos incompatíveis (subtracção de lógico com texto)');
    		assert.throws(function() {return parser.evaluate("false - 'უ'"); },'Símbolos incompatíveis (subtracção de lógico com caracter)');
    		assert.throws(function() {return parser.evaluate("'ᐤ' - \"t3쥯꾟3\""); },'Símbolos incompatíveis (subtracção de caracter com texto)');
    		assert.throws(function() {return parser.evaluate("\"t3嵊୴s犏t\" - \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (subtracção de textos)');
    		//assert.throws(function() {return parser.evaluate('5 - ('); },'parse error [column 5]: unmatched "()"');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluate("5 - 3"), 'Esperado valor 2 da subtracção (subtracção de inteiros)').to.equal(2);
	    	expect(parser.evaluate("5 - 3.7"), 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)').to.equal(1.3);;
	    	expect(parser.evaluate("'b' - 1"), 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)').to.equal('a');
	    	expect(parser.evaluate("6.87 - 2.58"), 'Esperado valor 4.29 da subtracção (subtracção de reais)').to.equal(4.29);
	    	expect(parser.evaluate("'ಯ' - '౼'"), 'Esperado caracter 3 da subtracção (subtracção de caracteres)').to.equal('3');
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluate("5 - 3")).to.be.a('number');
  			expect(parser.evaluate("5 - 5.7")).to.be.a('number');
  			expect(parser.evaluate("'b' - 1")).to.be.a('string');
  			expect(parser.evaluate("6.87 - 2.58")).to.be.a('number');
  			expect(parser.evaluate("'ಯ' - '౼'")).to.be.a('string');  			
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluate("5 - true"); }).to.throw('Símbolos incompatíveis (subtracção de inteiro com lógico)');
  			expect(function() {return parser.evaluate("5 - \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (subtracção de inteiro com texto)');
  			expect(function() {return parser.evaluate("3.623 - true"); }).to.throw('Símbolos incompatíveis (subtracção de real com lógico)');
  			expect(function() {return parser.evaluate("32.90 - \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (subtracção de real com texto)');
  			expect(function() {return parser.evaluate("34.3 - '吃'"); }).to.throw('Símbolos incompatíveis (subtracção de real com caracter)');
  			expect(function() {return parser.evaluate("false - false"); }).to.throw('Símbolos incompatíveis (subtracção de lógicos)');
  			expect(function() {return parser.evaluate("false - \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (subtracção de lógico com texto)');
  			expect(function() {return parser.evaluate("false - 'უ'"); }).to.throw('Símbolos incompatíveis (subtracção de lógico com caracter)');
			expect(function() {return parser.evaluate("'ᐤ' - \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (subtracção de caracter com texto)');
			expect(function() {return parser.evaluate("\"t3嵊୴s犏t\" - \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (subtracção de textos)');
    		//expect(function() {return parser.evaluate('5 - ('); }).to.throw();
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluate("5 - 3").should.equal(2, 'Esperado valor 2 da subtracção (subtracção de inteiros)');
		 	parser.evaluate("5 - 3.7").should.equal(1.3, 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)');
		 	parser.evaluate("'b' - 1").should.equal('a', 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)');
		 	parser.evaluate("6.87 - 2.58").should.equal(4.29, 'Esperado valor 4.29 da subtracção (subtracção de reais)');
		 	parser.evaluate("'ಯ' - '౼'").should.equal('3', 'Esperado caracter 3 da subtracção (subtracção de caracteres)');
	    })

		it('.typeOf()', function (){	
			(parser.evaluate("5 - 3")).should.be.a('number');
			(parser.evaluate("5 - 3.7")).should.be.a('number');
			(parser.evaluate("'b' - 1")).should.be.a('string');
			(parser.evaluate("6.87 - 2.58")).should.be.a('number');
			(parser.evaluate("'ಯ' - '౼'")).should.be.a('string');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluate("5 - true"); }).should.throw('Símbolos incompatíveis (subtracção de inteiro com lógico)');	
			(function() {return parser.evaluate("5 - \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (subtracção de inteiro com texto)');
			(function() {return parser.evaluate("3.623 - true"); }).should.throw('Símbolos incompatíveis (subtracção de real com lógico)');
			(function() {return parser.evaluate("32.90 - \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (subtracção de real com texto)');
			(function() {return parser.evaluate("34.3 - '吃'"); }).should.throw('Símbolos incompatíveis (subtracção de real com caracter)');
			(function() {return parser.evaluate("false - false"); }).should.throw('Símbolos incompatíveis (subtracção de lógicos)');
			(function() {return parser.evaluate("false - \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (subtracção de lógico com texto)');
			(function() {return parser.evaluate("false - 'უ'", { x: false, y: 'უ'}); }).should.throw('Símbolos incompatíveis (subtracção de lógico com caracter)');
			(function() {return parser.evaluate("'ᐤ' - \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (subtracção de caracter com texto)');
			(function() {return parser.evaluate("\"t3嵊୴s犏t\" - \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (subtracção de textos)');
			//(function() {return parser.evaluate('5 - ('); }).should.throw();
			//erro(function() {(parser.evaluate('5 - (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
		})

	})

})

describe(' Multiplicação (*) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(21, parser.evaluate("7 * 3"), 'Esperado valor 21 da multiplicação (multiplicação de inteiros)');
	    	assert.strictEqual(199.81, parser.evaluate("29 * 6.89"), 'Esperado valor 199.81 da multiplicação (multiplicação de inteiro com real)');
	    	assert.strictEqual(583.9209669999999, parser.evaluate("24.923 * 23.429"), 'Esperado valor 583.9209669999999 da multiplicação (multiplicação de reais)');  																//3196
	    	//assert.strictEqual(actual, expected, message);
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluate("7 * 3"), 'number', 'Esperado number da multiplicação (multiplicação de inteiros)');
	    	assert.typeOf( parser.evaluate("29 * 6.89"), 'number', 'Esperado number da multiplicação (multiplicação de inteiro com real)');
	    	assert.typeOf( parser.evaluate("24.923 * 23.429"), 'number' ,'Esperado number da multiplicação (multiplicação de reais)');  	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluate("897 * true"); },'Símbolos incompatíveis (multiplicação de inteiro com lógico)');
    		assert.throws(function() {return parser.evaluate("5 * \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (multiplicação de inteiro com texto)');
    		assert.throws(function() {return parser.evaluate("'c' * 3"); },'Símbolos incompatíveis (multiplicação de caracter com inteiro)');
    		assert.throws(function() {return parser.evaluate("32.42 * true"); },'Símbolos incompatíveis (multiplicação de real com lógico)');
    		assert.throws(function() {return parser.evaluate("32.90 * \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (multiplicação de real com texto)');
    		assert.throws(function() {return parser.evaluate("332.34 * '吃'"); },'Símbolos incompatíveis (multiplicação de real com caracter)');
    		assert.throws(function() {return parser.evaluate("true * false"); },'Símbolos incompatíveis (multiplicação de lógicos)');
    		assert.throws(function() {return parser.evaluate("false * \"p02姚ń级\""); },'Símbolos incompatíveis (multiplicação de lógico com texto)');
    	    assert.throws(function() {return parser.evaluate("false * 'უ'"); },'Símbolos incompatíveis (multiplicação de lógico com caracter)');
    	    assert.throws(function() {return parser.evaluate("'ಯ' * '౼'"); },'Símbolos incompatíveis (multiplicação de caracter com caracter)');
    		assert.throws(function() {return parser.evaluate("'ᐤ' * \"t3쥯꾟3\""); },'Símbolos incompatíveis (multiplicação de caracter com texto)');
    		assert.throws(function() {return parser.evaluate("\"t3嵊୴s犏t\" * \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (multiplicação de textos)');
    		//assert.throws(function() {return parser.evaluate('5 * ('); },'parse error [column 5]: unmatched "()"');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluate("7 * 3"), 'Esperado valor 21 da multiplicação (multiplicação de inteiros)').to.equal(21);
	    	expect(parser.evaluate("5 * 3.7"), 'Esperado valor 199.81 da multiplicação (multiplicação de inteiro com real)').to.equal(199.81);;
	    	expect(parser.evaluate("24.923 * 23.429"), 'Esperado valor 4.29 da multiplicação (multiplicação de reais)').to.equal(583.9209669999999);
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluate("7 * 3")).to.be.a('number');
  			expect(parser.evaluate("29 * 6.89")).to.be.a('number');
  			expect(parser.evaluate("24.923 * 23.429")).to.be.a('number');		
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluate("897 * true"); }).to.throw('Símbolos incompatíveis (multiplicação de inteiro com lógico)');
  			expect(function() {return parser.evaluate("5 * \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (multiplicação de inteiro com texto)');	
  			expect(function() {return parser.evaluate("'c' * 3"); }).to.throw('Símbolos incompatíveis (multiplicação de caracter com inteiro)');
  			expect(function() {return parser.evaluate("32.42 * true"); }).to.throw('Símbolos incompatíveis (multiplicação de real com lógico)');
  			expect(function() {return parser.evaluate("32.90 * \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (multiplicação de real com texto)');
  			expect(function() {return parser.evaluate("332.34 * '吃'"); }).to.throw('Símbolos incompatíveis (multiplicação de real com caracter)');
  			expect(function() {return parser.evaluate("true * false"); }).to.throw('Símbolos incompatíveis (multiplicação de lógicos)');
  			expect(function() {return parser.evaluate("false * \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (multiplicação de lógico com texto)');
			expect(function() {return parser.evaluate("false * 'უ'"); }).to.throw('Símbolos incompatíveis (multiplicação de lógico com caracter)');
			expect(function() {return parser.evaluate("'ಯ' * '౼'"); }).to.throw('Símbolos incompatíveis (multiplicação de caracter com caracter)');  			
			expect(function() {return parser.evaluate("'ᐤ' * \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (multiplicação de caracter com texto)');
			expect(function() {return parser.evaluate("\"t3嵊୴s犏t\" * \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (multiplicação de textos)');
    		//expect(function() {return parser.evaluate('5 * ('); }).to.throw();    		
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluate("7 * 3").should.equal(21, 'Esperado valor 21 da multiplicação (multiplicação de inteiros)');
		 	parser.evaluate("5 * 3.7").should.equal(199.81, 'Esperado valor 199.81 da multiplicação (multiplicação de inteiro com real)');
		 	parser.evaluate("24.923 * 23.429").should.equal(583.9209669999999, 'Esperado valor 583.9209669999999 da multiplicação (multiplicação de reais)');
	    })

		it('.typeOf()', function (){	
			(parser.evaluate("7 * 3")).should.be.a('number');
			(parser.evaluate("5 * 3.7")).should.be.a('number');
			(parser.evaluate("24.923 * 23.429")).should.be.a('number');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluate("897 * true"); }).should.throw('Símbolos incompatíveis (multiplicação de inteiro com lógico)');	
			(function() {return parser.evaluate("5 * \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (multiplicação de inteiro com texto)');
			(function() {return parser.evaluate("'c' * 3"); }).should.throw('Símbolos incompatíveis (multiplicação de caracter com inteiro)');	
			(function() {return parser.evaluate("32.42 * true"); }).should.throw('Símbolos incompatíveis (multiplicação de real com lógico)');
			(function() {return parser.evaluate("32.90 * \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (multiplicação de real com texto)');
			(function() {return parser.evaluate("332.34 * '吃'"); }).should.throw('Símbolos incompatíveis (multiplicação de real com caracter)');
			(function() {return parser.evaluate("true * false"); }).should.throw('Símbolos incompatíveis (multiplicação de lógicos)');
			(function() {return parser.evaluate("false * \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (multiplicação de lógico com texto)');
			(function() {return parser.evaluate("false * 'უ'"); }).should.throw('Símbolos incompatíveis (multiplicação de lógico com caracter)');
			(function() {return parser.evaluate("'ಯ' * '౼'"); }).should.throw('Símbolos incompatíveis (multiplicação de caracter com caracter)');
			(function() {return parser.evaluate("'ᐤ' * \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (multiplicação de caracter com texto)');
			(function() {return parser.evaluate("\"t3嵊୴s犏t\" * \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (multiplicação de textos)');
			//(function() {return parser.evaluate('5 * ('); }).should.throw();
			//erro(function() {(parser.evaluate('5 * (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');	
		})

	})

})

describe(' Divisão (/) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(2, parser.evaluate("732 / 342"), 'Esperado valor 2 da divisão (divisão de inteiros)');
	    	assert.strictEqual(0.9062229370283311, parser.evaluate("293 / 323.32"), 'Esperado valor 0.9062229370283311 da divisão (divisão de inteiro com real)');
	    	assert.strictEqual(0.025997904613609214, parser.evaluate("243.92332 / 9382.4223"), 'Esperado valor 0.025997904613609214 da divisão (divisão de reais)');  																//3196
	    	//assert.strictEqual(actual, expected, message);
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluate("732 / 342"), 'number', 'Esperado number da divisão (divisão de inteiros)');
	    	assert.typeOf( parser.evaluate("293 / 323.32"), 'number', 'Esperado number da divisão (divisão de inteiro com real)');
	    	assert.typeOf( parser.evaluate("243.92332 / 9382.4223"), 'number' ,'Esperado number da divisão (divisão de reais)');  	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluate("89723 / true"); },'Símbolos incompatíveis (divisão de inteiro com lógico)');
    		assert.throws(function() {return parser.evaluate("5293 / \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (divisão de inteiro com texto)');
    		assert.throws(function() {return parser.evaluate("'c' / 3292"); },'Símbolos incompatíveis (divisão de caracter com inteiro)');
    		assert.throws(function() {return parser.evaluate("3229.4209 / true"); },'Símbolos incompatíveis (divisão de real com lógico)');
    		assert.throws(function() {return parser.evaluate("32879.90 / \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (divisão de real com texto)');
    		assert.throws(function() {return parser.evaluate("3322.34029 / '吃'"); },'Símbolos incompatíveis (divisão de real com caracter)');
    		assert.throws(function() {return parser.evaluate("true / false"); },'Símbolos incompatíveis (divisão de lógicos)');
    		assert.throws(function() {return parser.evaluate("true / \"p02姚ń级\""); },'Símbolos incompatíveis (divisão de lógico com texto)');
    	    assert.throws(function() {return parser.evaluate("true / 'უ'"); },'Símbolos incompatíveis (divisão de lógico com caracter)');
    	    assert.throws(function() {return parser.evaluate("'ಯ' / '౼'"); },'Símbolos incompatíveis (divisão de caracter com caracter)');
    		assert.throws(function() {return parser.evaluate("'ᐤ' / \"t3쥯꾟3\""); },'Símbolos incompatíveis (divisão de caracter com texto)');
    		assert.throws(function() {return parser.evaluate("\"t3嵊୴s犏t\" / \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (divisão de textos)');
    		//assert.throws(function() {return parser.evaluate('5 / ('); },'parse error [column 5]: unmatched "()"');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluate("732 / 342"), 'Esperado valor 2 da divisão (divisão de inteiros)').to.equal(2);
	    	expect(parser.evaluate("293 / 323.32"), 'Esperado valor 0.9062229370283311 da divisão (divisão de inteiro com real)').to.equal(0.9062229370283311);;
	    	expect(parser.evaluate("243.92332 / 9382.4223"), 'Esperado valor 0.025997904613609214 da divisão (divisão de reais)').to.equal(0.025997904613609214);
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluate("732 / 342")).to.be.a('number');
  			expect(parser.evaluate("293 / 323.32")).to.be.a('number');
  			expect(parser.evaluate("243.92332 / 9382.4223")).to.be.a('number');		
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluate("89723 / true"); }).to.throw('Símbolos incompatíveis (divisão de inteiro com lógico)');
  			expect(function() {return parser.evaluate("5293 / \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (divisão de inteiro com texto)');	
  			expect(function() {return parser.evaluate("'c' / 3292"); }).to.throw('Símbolos incompatíveis (divisão de caracter com inteiro)');
  			expect(function() {return parser.evaluate("3229.4209 / true"); }).to.throw('Símbolos incompatíveis (divisão de real com lógico)');
  			expect(function() {return parser.evaluate("32879.90 / \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (divisão de real com texto)');
  			expect(function() {return parser.evaluate("3322.34029 / '吃'"); }).to.throw('Símbolos incompatíveis (divisão de real com caracter)');
  			expect(function() {return parser.evaluate("true / false"); }).to.throw('Símbolos incompatíveis (divisão de lógicos)');
  			expect(function() {return parser.evaluate("true / \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (divisão de lógico com texto)');
			expect(function() {return parser.evaluate("true / 'უ'"); }).to.throw('Símbolos incompatíveis (divisão de lógico com caracter)');
			expect(function() {return parser.evaluate("'ಯ' / '౼'"); }).to.throw('Símbolos incompatíveis (divisão de caracter com caracter)');  			
			expect(function() {return parser.evaluate("'ᐤ' / \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (divisão de caracter com texto)');
			expect(function() {return parser.evaluate("\"t3嵊୴s犏t\" / \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (divisão de textos)');
    		//expect(function() {return parser.evaluate('5 / ('); }).to.throw();    		
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluate("732 / 342").should.equal(2, 'Esperado valor 2 da divisão (divisão de inteiros)');
		 	parser.evaluate("293 / 323.32").should.equal(0.9062229370283311, 'Esperado valor 0.9062229370283311 da divisão (divisão de inteiro com real)');
		 	parser.evaluate("243.92332 / 9382.4223").should.equal(583.9209669999999, 'Esperado valor 583.9209669999999 da divisão (divisão de reais)');
	    })

		it('.typeOf()', function (){	
			(parser.evaluate("732 / 342")).should.be.a('number');
			(parser.evaluate("293 / 323.32")).should.be.a('number');
			(parser.evaluate("243.92332 / 9382.4223")).should.be.a('number');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluate("89723 / true"); }).should.throw('Símbolos incompatíveis (divisão de inteiro com lógico)');	
			(function() {return parser.evaluate("5293 / \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (divisão de inteiro com texto)');
			(function() {return parser.evaluate("'c' / 3292"); }).should.throw('Símbolos incompatíveis (divisão de caracter com inteiro)');	
			(function() {return parser.evaluate("3229.4209 / true"); }).should.throw('Símbolos incompatíveis (divisão de real com lógico)');
			(function() {return parser.evaluate("32879.90 / \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (divisão de real com texto)');
			(function() {return parser.evaluate("3322.34029 / '吃'"); }).should.throw('Símbolos incompatíveis (divisão de real com caracter)');
			(function() {return parser.evaluate("true / false"); }).should.throw('Símbolos incompatíveis (divisão de lógicos)');
			(function() {return parser.evaluate("true / \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (divisão de lógico com texto)');
			(function() {return parser.evaluate("true / 'უ'"); }).should.throw('Símbolos incompatíveis (divisão de lógico com caracter)');
			(function() {return parser.evaluate("'ಯ' / '౼'"); }).should.throw('Símbolos incompatíveis (divisão de caracter com caracter)');
			(function() {return parser.evaluate("'ᐤ' / \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (divisão de caracter com texto)');
			(function() {return parser.evaluate("\"t3嵊୴s犏t\" / \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (divisão de textos)');
			//(function() {return parser.evaluate('5 * ('); }).should.throw();
			//erro(function() {(parser.evaluate('5 * (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');	
		})

	})

})

describe(' Resto da Divisão (%) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(0, parser.evaluate("7232 % 34232"), 'Esperado valor 7232 da resto da divisão (resto da divisão de inteiros)');  										
	    	//assert.strictEqual(actual, expected, message);
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluate("7232 % 34232"), 'number', 'Esperado number da resto da divisão (resto da divisão de inteiros)');	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluate("2933 % 3231.32"); },'Símbolos incompatíveis (resto da divisão de inteiro com real)');
    		assert.throws(function() {return parser.evaluate("2432.332 % 938242.23"); },'Símbolos incompatíveis (resto da divisão de reais)');
    		assert.throws(function() {return parser.evaluate("89723 % true"); },'Símbolos incompatíveis (resto da divisão de inteiro com lógico)');
    		assert.throws(function() {return parser.evaluate("5293 % \"ಠಡ嬛ၧkd\""); },'Símbolos incompatíveis (resto da divisão de inteiro com texto)');
    		assert.throws(function() {return parser.evaluate("'c' % 3292"); },'Símbolos incompatíveis (resto da divisão de caracter com inteiro)');
    		assert.throws(function() {return parser.evaluate("3229.4209 % true"); },'Símbolos incompatíveis (resto da divisão de real com lógico)');
    		assert.throws(function() {return parser.evaluate("32879.90 % \"t柹鵛瞣éट\""); },'Símbolos incompatíveis (resto da divisão de real com texto)');
    		assert.throws(function() {return parser.evaluate("3322.34029 % '吃'"); },'Símbolos incompatíveis (resto da divisão de real com caracter)');
    		assert.throws(function() {return parser.evaluate("true % false"); },'Símbolos incompatíveis (resto da divisão de lógicos)');
    		assert.throws(function() {return parser.evaluate("true % \"p02姚ń级\""); },'Símbolos incompatíveis (resto da divisão de lógico com texto)');
    	    assert.throws(function() {return parser.evaluate("true % 'უ'"); },'Símbolos incompatíveis (resto da divisão de lógico com caracter)');
    	    assert.throws(function() {return parser.evaluate("'ಯ' % '౼'"); },'Símbolos incompatíveis (resto da divisão de caracter com caracter)');
    		assert.throws(function() {return parser.evaluate("'ᐤ' % \"t3쥯꾟3\""); },'Símbolos incompatíveis (resto da divisão de caracter com texto)');
    		assert.throws(function() {return parser.evaluate("\"t3嵊୴s犏t\" % \"ኺ0~cᶎओ\""); },'Símbolos incompatíveis (resto da divisão de textos)');
    		//assert.throws(function() {return parser.evaluate('5 % ('); },'parse error [column 5]: unmatched "()"');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluate("7232 % 34232"), 'Esperado valor 7232 da resto da divisão (resto da divisão de inteiros)').to.equal(7232);
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluate("7232 % 34232")).to.be.a('number');
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluate("2933 % 3231.32"); }).to.throw('Símbolos incompatíveis (resto da divisão de inteiro com real)');
  			expect(function() {return parser.evaluate("2432.332 % 938242.23"); }).to.throw('Símbolos incompatíveis (resto da divisão de reais)');
  			expect(function() {return parser.evaluate("89723 % true"); }).to.throw('Símbolos incompatíveis (resto da divisão de inteiro com lógico)');
  			expect(function() {return parser.evaluate("5293 % \"ಠಡ嬛ၧkd\""); }).to.throw('Símbolos incompatíveis (resto da divisão de inteiro com texto)');	
  			expect(function() {return parser.evaluate("'c' % 3292"); }).to.throw('Símbolos incompatíveis (resto da divisão de caracter com inteiro)');
  			expect(function() {return parser.evaluate("3229.4209 % true"); }).to.throw('Símbolos incompatíveis (resto da divisão de real com lógico)');
  			expect(function() {return parser.evaluate("32879.90 % \"t柹鵛瞣éट\""); }).to.throw('Símbolos incompatíveis (resto da divisão de real com texto)');
  			expect(function() {return parser.evaluate("3322.34029 % '吃'"); }).to.throw('Símbolos incompatíveis (resto da divisão de real com caracter)');
  			expect(function() {return parser.evaluate("true % false"); }).to.throw('Símbolos incompatíveis (resto da divisão de lógicos)');
  			expect(function() {return parser.evaluate("true % \"p02姚ń级\""); }).to.throw('Símbolos incompatíveis (resto da divisão de lógico com texto)');
			expect(function() {return parser.evaluate("true % 'უ'"); }).to.throw('Símbolos incompatíveis (resto da divisão de lógico com caracter)');
			expect(function() {return parser.evaluate("'ಯ' % '౼'"); }).to.throw('Símbolos incompatíveis (resto da divisão de caracter com caracter)');  			
			expect(function() {return parser.evaluate("'ᐤ' % \"t3쥯꾟3\""); }).to.throw('Símbolos incompatíveis (resto da divisão de caracter com texto)');
			expect(function() {return parser.evaluate("\"t3嵊୴s犏t\" % \"ኺ0~cᶎओ\""); }).to.throw('Símbolos incompatíveis (resto da divisão de textos)');
    		//expect(function() {return parser.evaluate('5 % ('); }).to.throw();    		
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluate("7232 % 34232").should.equal(7232, 'Esperado valor 7232 da resto da divisão (resto da divisão de inteiros)');
	    })

		it('.typeOf()', function (){	
			(parser.evaluate("7232 % 34232")).should.be.a('number');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluate("2933 % 3231.32"); }).should.throw('Símbolos incompatíveis (resto da divisão de inteiro com real)');
			(function() {return parser.evaluate("2432.332 % 938242.23"); }).should.throw('Símbolos incompatíveis (resto da divisão de reais)');
			(function() {return parser.evaluate("89723 % true"); }).should.throw('Símbolos incompatíveis (resto da divisão de inteiro com lógico)');	
			(function() {return parser.evaluate("5293 % \"ಠಡ嬛ၧkd\""); }).should.throw('Símbolos incompatíveis (resto da divisão de inteiro com texto)');
			(function() {return parser.evaluate("'c' % 3292"); }).should.throw('Símbolos incompatíveis (resto da divisão de caracter com inteiro)');	
			(function() {return parser.evaluate("3229.4209 % true"); }).should.throw('Símbolos incompatíveis (resto da divisão de real com lógico)');
			(function() {return parser.evaluate("32879.90 % \"t柹鵛瞣éट\""); }).should.throw('Símbolos incompatíveis (resto da divisão de real com texto)');
			(function() {return parser.evaluate("3322.34029 % '吃'"); }).should.throw('Símbolos incompatíveis (resto da divisão de real com caracter)');
			(function() {return parser.evaluate("true % false"); }).should.throw('Símbolos incompatíveis (resto da divisão de lógicos)');
			(function() {return parser.evaluate("true % \"p02姚ń级\""); }).should.throw('Símbolos incompatíveis (resto da divisão de lógico com texto)');
			(function() {return parser.evaluate("true % 'უ'"); }).should.throw('Símbolos incompatíveis (resto da divisão de lógico com caracter)');
			(function() {return parser.evaluate("'ಯ' % '౼'"); }).should.throw('Símbolos incompatíveis (resto da divisão de caracter com caracter)');
			(function() {return parser.evaluate("'ᐤ' % \"t3쥯꾟3\""); }).should.throw('Símbolos incompatíveis (resto da divisão de caracter com texto)');
			(function() {return parser.evaluate("\"t3嵊୴s犏t\" % \"ኺ0~cᶎओ\""); }).should.throw('Símbolos incompatíveis (resto da divisão de textos)');
			//(function() {return parser.evaluate('5 * ('); }).should.throw();
			//erro(function() {(parser.evaluate('5 * (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');	
		})

	})

})



// describe('Potenciação ', function(){
//   describe(' assert ', function(){
// 	    it('.equal()', function(){
// 	    	assert.equal(8, parser.evaluate("2 ^ x", { x: 3 }), 'Esperado valor 8');
// 	    })

// 	    it('.strictEqual()', function(){
// 	    	assert.strictEqual(8, parser.evaluate("2 ^ x", { x: 3 }), 'Esperado valor 8');
// 	    })
   

// 	    it('.deepEqual()', function(){
// 	    	assert.deepEqual(8, parser.evaluate("2 ^ x", { x: 3 }), 'Esperado valor 8');
// 	    })

// 	    it('.typeOf()', function(){
// 	    	assert.typeOf( parser.evaluate("2 ^ x", { x: 3 }), 'number', 'Esperado number 8');
// 	    })

// 	    it('.throw()', function(){
// 	    	assert.throws(function() {return parser.evaluate('2 ^ ('); },'parse error [column 5]: unmatched "()"');
// 	    })

//   	})

//   describe(' expect ', function(){
//   		it('.equal()', function(){
// 	    	expect(parser.evaluate("2 ^ x", { x: 3 }),  'Esperado valor 8').to.equal(8);
// 	    })
//   	})

//   describe(' should ', function(){
//   		 it('.equal()', function(){
// 	    	parser.evaluate("2 ^ x", { x: 3 }).should.equal(8, 'Esperado valor 8');
// 	    })
//   })

//   })

// })
// 
// 
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
