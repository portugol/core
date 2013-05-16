////////////////////////////////////////////////////
//////////         PARSER TESTING         //////////
////////////////////////////////////////////////////

// mocha testes_parser.js

//Requires do parser
//var Expression = require('./expression_v0');
//var Token = require('./token');
//var types = require('./token_types');

//Biblioteca de asserts
//var chai = require("./chai")

var assert = chai.assert,
	expect = chai.expect,
	should = chai.should(); //Should tem de ser executado

//var parser = new Parser();

//////////////////////////////////////Testar outros caracteres
describe(' Soma (+) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	assert.strictEqual(8, parser.evaluate("x + y", { x: 3,y: 5 }), 'Esperado valor 8 da soma (soma de inteiros)');
	    	assert.strictEqual(10.7, parser.evaluate("x + y", { x: 5,y: 5.7 }), 'Esperado valor 10.7 da soma (soma de inteiro com real)');
	    	assert.strictEqual("5teste", parser.evaluate("x + y", { x: 5,y: "teste" }), 'Esperado texto 5teste da soma (soma de inteiro com texto)');
	    	assert.strictEqual('b', parser.evaluate("x + y", { x: 'a',y: 1}), 'Esperado caracter b da soma (soma de caracter com inteiro)');
	    	assert.strictEqual(9.0, parser.evaluate("x + y", {x: 4.5,y: 4.5}), 'Esperado valor 9.0 da soma (soma de reais)');
	    	assert.strictEqual("13.9teste", parser.evaluate("x + y", {x: 13.9,y: "teste"}), 'Esperado texto 13.9teste da soma (soma de real com texto)');
	    	assert.strictEqual('Ȱ',parser.evaluate("x + y", { x: 'đ',y: 'ğ'}), 'Esperado caracter Ȱ ͗da soma (soma de caracteres)');
	    	assert.strictEqual("Ńt3st3", parser.evaluate("x + y", { x: 'Ń',y: "t3st3"}), 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)');
	    	assert.strictEqual("t3starº*ß", parser.evaluate("x + y", { x: "t3st",y: "arº*ß"}), 'Esperado texto t3starº*ß da soma (soma de textos)');
	    	//assert.strictEqual(actual, expected, message);
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluate("x + y", { x: 3,y: 5 }), 'number', 'Esperado number da soma (soma de inteiros)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 5,y: 5.7 }), 'number', 'Esperado number da soma (soma de inteiro com real)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 5, y: "teste" }), 'string','Esperado string da soma (soma de inteiro com texto)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 'a',y: 1}), 'string' , 'Esperado string da soma (soma de caracter com inteiro)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 4.5,y: 4.5}), 'number' ,'Esperado number da soma (soma de reais)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 13.9,y: "teste"}), 'string' , 'Esperado string da soma (soma de real com texto)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 'đ',y: 'ğ'}), 'string' , 'Esperado string da soma (soma de caracteres)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 'Ń',y: "t3st3"}), 'string' ,'Esperado string da soma (soma de caracter com texto)');
	    	assert.typeOf( parser.evaluate("x + y", { x: "t3st",y: "arº*ß"}), 'string' , 'Esperado string da soma (soma de textos)');    	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluate("x + y", { x: 5, y: true}); },'Símbolos incompatíveis (soma de inteiro com lógico)');
    		assert.throws(function() {return parser.evaluate("x + y", { x: 3.6, y: true}); },'Símbolos incompatíveis (soma de real com lógico)');
    		assert.throws(function() {return parser.evaluate("x + y", { x: 34.3, y: 'Ƨ'}); },'Símbolos incompatíveis (soma de real com caracter)');
    		assert.throws(function() {return parser.evaluate("x + y", { x: true, y: false}); },'Símbolos incompatíveis (soma de lógicos)');
    		assert.throws(function() {return parser.evaluate("x + y", { x: true, y: "teste"}); },'Símbolos incompatíveis (soma de lógico com texto)');
    		assert.throws(function() {return parser.evaluate("x + y", { x: false, y: 'უ'}); },'Símbolos incompatíveis (soma de lógico com caracter)');
    		//assert.throws(function() {return parser.evaluate('5 + ('); },'parse error [column 5]: unmatched "()"');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluate("x + y", { x: 3,y: 5 }), 'Esperado valor 8 da soma (soma de inteiros)').to.equal(8);
	    	expect(parser.evaluate("x + y", { x: 5,y: 5.7 }), 'Esperado valor 10.7 da soma (soma de inteiro com real)').to.equal(10.7);
	    	expect(parser.evaluate("x + y", { x: 5,y: "teste" }),  'Esperado string 5teste da soma (soma de inteiro com texto)').to.equal("5teste");
	    	expect(parser.evaluate("x + y", { x: 'a',y: 1}), 'Esperado caracter b da soma (soma de caracter com inteiro)').to.equal('b');
	    	expect(parser.evaluate("x + y", {x: 4.5,y: 4.5}), 'Esperado valor 9.0 da soma (soma de reais)').to.equal(9.0);
	    	expect(parser.evaluate("x + y", {x: 13.9,y: "teste"}), 'Esperado texto 13.9teste da soma (soma de real com texto)').to.equal("13.9teste");
	    	expect(parser.evaluate("x + y", { x: 'đ',y: 'ğ'}), 'Esperado caracter Ȱ da soma (soma de caracteres)').to.equal('Ȱ');
	    	expect(parser.evaluate("x + y", { x: 'Ń',y: "t3st3"}), 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)').to.equal("Ńt3st3");
	    	expect(parser.evaluate("x + y", { x: "t3st",y: "arº*ß"}), 'Esperado texto t3starº*ß da soma (soma de textos)').to.equal("t3starº*ß");
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluate("x + y", { x: 3,y: 5 })).to.be.a('number');
  			expect(parser.evaluate("x + y", { x: 5,y: 5.7 })).to.be.a('number');
  			expect(parser.evaluate("x + y", { x: 5, y: 'teste' })).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: 'a',y: 1})).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: 4.5,y: 4.5})).to.be.a('number');
  			expect(parser.evaluate("x + y", { x: 13.9,y: "teste"})).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: 'đ',y: 'ğ'})).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: 'Ń',y: "t3st3"})).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: "t3st",y: "arº*ß"})).to.be.a('string');
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluate("x + y", { x: 5, y: true}); }).to.throw('Símbolos incompatíveis (soma de inteiro com lógico)');
  			expect(function() {return parser.evaluate("x + y", { x: 3.6, y: true}); }).to.throw('Símbolos incompatíveis (soma de real com lógico)');
  			expect(function() {return parser.evaluate("x + y", { x: 34.3, y: 'Ƨ'}); }).to.throw('Símbolos incompatíveis (soma de real com caracter)');
  			expect(function() {return parser.evaluate("x + y", { x: true, y: false}); }).to.throw('Símbolos incompatíveis (soma de lógicos)');
  			expect(function() {return parser.evaluate("x + y", { x: true, y: "teste"}); }).to.throw('Símbolos incompatíveis (soma de lógico com texto)');
			expect(function() {return parser.evaluate("x + y", { x: false, y: 'უ'}); }).to.throw('Símbolos incompatíveis (soma de lógico com caracter)');
    		//expect(function() {return parser.evaluate('5 + ('); }).to.throw();
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluate("x + y", { x: 3,y: 5 }).should.equal(8, 'Esperado valor 8 da soma (soma de inteiros)');
		 	parser.evaluate("x + y", { x: 5,y: 5.7 }).should.equal(10.7, 'Esperado valor 10.7 da soma (soma de inteiro com real)');
		 	parser.evaluate("x + y", { x: 5,y: "teste" }).should.equal("5teste", 'Esperado string 5teste da soma (soma de inteiro com texto)');
		 	parser.evaluate("x + y", { x: 'a',y: 1}).should.equal('b', 'Esperado caracter b da soma (soma de caracter com inteiro)');
		 	parser.evaluate("x + y", {x: 4.5,y: 4.5}).should.equal(9.0, 'Esperado valor 9.0 da soma (soma de reais)');
		 	parser.evaluate("x + y", {x: 13.9,y: "teste"}).should.equal("13.9teste", 'Esperado texto 13.9teste da soma (soma de real com texto)');
		 	parser.evaluate("x + y", { x: 'đ',y: 'ğ'}).should.equal('', 'Esperado caracter Ȱ da soma (soma de caracteres)');
		 	parser.evaluate("x + y", { x: 'Ń',y: "t3st3"}).should.equal("Ńt3st3", 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)');
		 	parser.evaluate("x + y", { x: "t3st",y: "arº*ß"}).should.equal("t3starº*ß", 'Esperado texto t3starº*ß da soma (soma de textos)');	    	
	    })

		it('.typeOf()', function (){	
			(parser.evaluate("x + y", { x: 5,y: 3 })).should.be.a('number');
			(parser.evaluate("x + y", { x: 5,y: 5.7 })).should.be.a('number');
			(parser.evaluate("x + y", { x: 5, y: "teste" })).should.be.a('string');
			(parser.evaluate("x + y", { x: 'a',y: 1})).should.be.a('string');
			(parser.evaluate("x + y", { x: 4.5,y: 4.5})).should.be.a('number');
			(parser.evaluate("x + y", { x: 13.9,y: "teste"})).should.be.a('string');
			(parser.evaluate("x + y", { x: 'đ',y: 'ğ'})).should.be.a('string');
			(parser.evaluate("x + y", { x: 'Ń',y: "t3st3"})).should.be.a('string');
			(parser.evaluate("x + y", { x: "t3st",y: "arº*ß"})).should.be.a('string');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluate("x + y", { x: 5, y: true}); }).should.throw('Símbolos incompatíveis (soma de inteiro com lógico)');
			(function() {return parser.evaluate("x + y", { x: 3.6, y: true}); }).should.throw('Símbolos incompatíveis (soma de real com lógico)');
			(function() {return parser.evaluate("x + y", { x: 34.3, y: 'Ƨ'}); }).should.throw('Símbolos incompatíveis (soma de real com caracter)');
			(function() {return parser.evaluate("x + y", { x: true, y: false}); }).should.throw('Símbolos incompatíveis (soma de lógicos)');
			(function() {return parser.evaluate("x + y", { x: true, y: "teste"}); }).should.throw('Símbolos incompatíveis (soma de lógico com texto)');
			(function() {return parser.evaluate("x + y", { x: false, y: 'უ'}); }).should.throw('Símbolos incompatíveis (soma de lógico com caracter)');
			//(function() {return parser.evaluate('5 + ('); }).should.throw();
			//erro(function() {(parser.evaluate('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
		})

	})

})

describe(' Subtracção (-) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function () {
	    	///////////////////////////////////////////Testar subtracção com resultados negativos
	    	assert.strictEqual(2, parser.evaluate("x - y", { x: 5,y: 3 }), 'Esperado valor 2 da subtracção (subtracção de inteiros)');
	    	assert.strictEqual(1.3, parser.evaluate("x - y", { x: 5,y: 3.7 }), 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)');
	    	assert.strictEqual('a', parser.evaluate("x - y", { x: 'b',y: 1}), 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)');
	    	assert.strictEqual(4.29, parser.evaluate("x - y", { x: 6.87,y: 2.58}), 'Esperado valor 4.29 da subtracção (subtracção de reais)');  																//3196
	    	assert.strictEqual('3',parser.evaluate("x - y", { x: 'ಯ',y: '౼'}), 'Esperado caracter 3 da subtracção (subtracção de caracteres)');
	    	//assert.strictEqual(actual, expected, message);
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluate("x - y", { x: 5,y: 3 }), 'number', 'Esperado number da subtracção (subtracção de inteiros)');
	    	assert.typeOf( parser.evaluate("x - y", { x: 5,y: 5.7 }), 'number', 'Esperado number da subtracção (subtracção de inteiro com real)');
	    	assert.typeOf( parser.evaluate("x - y", { x: 'a',y: 1}), 'string' , 'Esperado string da subtracção (subtracção de caracter com inteiro)');
	    	assert.typeOf( parser.evaluate("x - y", { x: 6.87,y: 2.58}), 'number' ,'Esperado number da subtracção (subtracção de reais)');
	    	assert.typeOf( parser.evaluate("x - y", { x: 'ಯ',y: '౼'}), 'string' , 'Esperado string da subtracção (subtracção de caracteres)');   	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluate("x - y", { x: 5, y: true}); },'Símbolos incompatíveis (subtracção de inteiro com lógico)');
    		assert.throws(function() {return parser.evaluate("x - y", { x: 5, y: "ಠಡ嬛ၧkd"}); },'Símbolos incompatíveis (subtracção de inteiro com texto)')
    		assert.throws(function() {return parser.evaluate("x - y", { x: 3.623, y: true}); },'Símbolos incompatíveis (subtracção de real com lógico)');
    		assert.throws(function() {return parser.evaluate("x - y", { x: 32.90, y: "t柹鵛瞣éट"}); },'Símbolos incompatíveis (subtracção de real com texto)');
    		assert.throws(function() {return parser.evaluate("x - y", { x: 34.3, y: '吃'}); },'Símbolos incompatíveis (subtracção de real com caracter)');
    		assert.throws(function() {return parser.evaluate("x - y", { x: false, y: false}); },'Símbolos incompatíveis (subtracção de lógicos)');
    		assert.throws(function() {return parser.evaluate("x - y", { x: false, y: "p02姚ń级"}); },'Símbolos incompatíveis (subtracção de lógico com texto)');
    		assert.throws(function() {return parser.evaluate("x - y", { x: 'ᐤ', y: "t3쥯꾟3"}); },'Símbolos incompatíveis (subtracção de caracter com texto)');
    		assert.throws(function() {return parser.evaluate("x - y", { x: false, y: 'უ'}); },'Símbolos incompatíveis (subtracção de lógico com caracter)');
    		assert.throws(function() {return parser.evaluate("x - y", { x: "t3嵊୴s犏t", y: "ኺ0~cᶎओ"}); },'Símbolos incompatíveis (subtracção de textos)');
    		//assert.throws(function() {return parser.evaluate('5 - ('); },'parse error [column 5]: unmatched "()"');
	    })

	})

	describe(' expect ', function (){
  		it('.equal()', function (){
	    	expect(parser.evaluate("x - y", { x: 5,y: 3 }), 'Esperado valor 2 da subtracção (subtracção de inteiros)').to.equal(2);
	    	expect(parser.evaluate("x - y", { x: 5,y: 3.7 }), 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)').to.equal(1.3);;
	    	expect(parser.evaluate("x - y", { x: 'b',y: 1}), 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)').to.equal('a');
	    	expect(parser.evaluate("x - y", {x: 6.87,y: 2.58}), 'Esperado valor 4.29 da subtracção (subtracção de reais)').to.equal(4.29);
	    	expect(parser.evaluate("x - y", { x: 'ಯ',y: '౼'}), 'Esperado caracter 3 da subtracção (subtracção de caracteres)').to.equal('3');
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluate("x - y", { x: 5,y: 3 })).to.be.a('number');
  			expect(parser.evaluate("x - y", { x: 5,y: 5.7 })).to.be.a('number');
  			expect(parser.evaluate("x - y", { x: 'a',y: 1})).to.be.a('string');
  			expect(parser.evaluate("x - y", { x: 6.87,y: 2.58})).to.be.a('number');
  			expect(parser.evaluate("x - y", { x: 'ಯ',y: '౼'})).to.be.a('string');  			
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluate("x - y", { x: 5, y: true}); }).to.throw('Símbolos incompatíveis (subtracção de inteiro com lógico)');
  			expect(function() {return parser.evaluate("x - y", { x: 5, y: "ಠಡ嬛ၧkd"}); }).to.throw('Símbolos incompatíveis (subtracção de inteiro com texto)');
  			expect(function() {return parser.evaluate("x - y", { x: 3.623, y: true}); }).to.throw('Símbolos incompatíveis (subtracção de real com lógico)');
  			expect(function() {return parser.evaluate("x - y", { x: 32.90, y: "t柹鵛瞣éट"}); }).to.throw('Símbolos incompatíveis (subtracção de real com texto)');
  			expect(function() {return parser.evaluate("x - y", { x: 34.3, y: '吃'}); }).to.throw('Símbolos incompatíveis (subtracção de real com caracter)');
  			expect(function() {return parser.evaluate("x - y", { x: false, y: false}); }).to.throw('Símbolos incompatíveis (subtracção de lógicos)');
  			expect(function() {return parser.evaluate("x - y", { x: true, y: "p02姚ń级"}); }).to.throw('Símbolos incompatíveis (subtracção de lógico com texto)');
			expect(function() {return parser.evaluate("x - y", { x: 'ᐤ', y: "t3쥯꾟3"}); }).to.throw('Símbolos incompatíveis (subtracção de caracter com texto)');
			expect(function() {return parser.evaluate("x - y", { x: false, y: 'უ'}); }).to.throw('Símbolos incompatíveis (subtracção de lógico com caracter)');
			expect(function() {return parser.evaluate("x - y", { x: "t3嵊୴s犏t", y: "ኺ0~cᶎओ"}); }).to.throw('Símbolos incompatíveis (subtracção de textos)');
    		//expect(function() {return parser.evaluate('5 - ('); }).to.throw();
  		})
	})

	describe(' should ', function (){
		 it('.equal()', function (){
		 	parser.evaluate("x - y", { x: 5,y: 3 }).should.equal(2, 'Esperado valor 2 da subtracção (subtracção de inteiros)');
		 	parser.evaluate("x - y", { x: 5,y: 3.7 }).should.equal(1.3, 'Esperado valor 1.3 da subtracção (subtracção de inteiro com real)');
		 	parser.evaluate("x - y", { x: 5,y: "teste" }).should.equal("5teste", 'Esperado string 5teste da subtracção (subtracção de inteiro com texto)');
		 	parser.evaluate("x - y", { x: 'b',y: 1}).should.equal('a', 'Esperado caracter a da subtracção (subtracção de caracter com inteiro)');
		 	parser.evaluate("x - y", { x: 6.87,y: 2.58}).should.equal(4.29, 'Esperado valor 4.29 da subtracção (subtracção de reais)');
		 	parser.evaluate("x - y", { x: 'ಯ',y: '౼'}).should.equal('3', 'Esperado caracter 3 da subtracção (subtracção de caracteres)');
	    })

		it('.typeOf()', function (){	
			(parser.evaluate("x - y", { x: 5,y: 3 })).should.be.a('number');
			(parser.evaluate("x - y", { x: 5,y: 3.7 })).should.be.a('number');
			(parser.evaluate("x - y", { x: 5, y: "teste" })).should.be.a('string');
			(parser.evaluate("x - y", { x: 'b',y: 1})).should.be.a('string');
			(parser.evaluate("x - y", { x: 6.87,y: 2.58})).should.be.a('number');
			(parser.evaluate("x - y", { x: 'ಯ',y: '౼'})).should.be.a('string');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluate("x - y", { x: 5, y: true}); }).should.throw('Símbolos incompatíveis (subtracção de inteiro com lógico)');	
			(function() {return parser.evaluate("x - y", { x: 5, y: "ಠಡ嬛ၧkd"}); }).should.throw('Símbolos incompatíveis (subtracção de inteiro com texto)');
			(function() {return parser.evaluate("x - y", { x: 3.623, y: true}); }).should.throw('Símbolos incompatíveis (subtracção de real com lógico)');
			(function() {return parser.evaluate("x - y", { x: 32.90, y: "t柹鵛瞣éट"}); }).should.throw('Símbolos incompatíveis (subtracção de real com texto)');
			(function() {return parser.evaluate("x - y", { x: 34.3, y: '吃'}); }).should.throw('Símbolos incompatíveis (subtracção de real com caracter)');
			(function() {return parser.evaluate("x - y", { x: false, y: false}); }).should.throw('Símbolos incompatíveis (subtracção de lógicos)');
			(function() {return parser.evaluate("x - y", { x: true, y: "p02姚ń级"}); }).should.throw('Símbolos incompatíveis (subtracção de lógico com texto)');
			(function() {return parser.evaluate("x - y", { x: 'ᐤ', y: "t3쥯꾟3"}); }).should.throw('Símbolos incompatíveis (subtracção de caracter com texto)');
			(function() {return parser.evaluate("x - y", { x: false, y: 'უ'}); }).should.throw('Símbolos incompatíveis (subtracção de lógico com caracter)');
			(function() {return parser.evaluate("x - y", { x: "t3嵊୴s犏t", y: "ኺ0~cᶎओ"}); }).should.throw('Símbolos incompatíveis (subtracção de textos)');
			//(function() {return parser.evaluate('5 - ('); }).should.throw();
			//erro(function() {(parser.evaluate('5 - (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
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
