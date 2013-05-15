////////////////////////////////////////////////////
//////////         PARSER TESTING         //////////
////////////////////////////////////////////////////

// mocha testes_parser.js

//Requires do parser
var Expression = require('./expression_v0');
var Token = require('./token');
var types = require('./token_types');

//Biblioteca de asserts
var chai = require("./chai")

var assert = chai.assert,
	expect = chai.expect,
	should = chai.should(); //Should tem de ser executado

//var parser = new Parser();

describe(' Soma (+) ', function (){
	describe(' assert ', function (){

	    it('.strictEqual()', function (){
	    	assert.strictEqual(8, parser.evaluate("x + y", { x: 3,y: 5 }), 'Esperado valor 8 da soma (soma de inteiros)');
	    	assert.strictEqual(10.7, parser.evaluate("x + y", { x: 5,y: 5.7 }), 'Esperado valor 10.7 da soma (soma de inteiro com real)');
	    	assert.strictEqual("5teste", parser.evaluate("x + y", { x: 5,y: "teste" }), 'Esperado texto 5teste da soma (soma de inteiro com texto)');
	    	assert.strictEqual('b', parser.evaluate("x + y", { x: 'a',y: 1}), 'Esperado caracter b da soma (soma de caracter com inteiro)');
	    	assert.strictEqual(9.0, parser.evaluate("x + y", {x: 4.5,y: 4.5}), 'Esperado valor 9.0 da soma (soma de real com real)');
	    	assert.strictEqual("13.9teste", parser.evaluate("x + y", {x: 13.9,y: "teste"}), 'Esperado texto 13.9teste da soma (soma de real com texto)');
	    	assert.strictEqual('ǹ',parser.evaluate("x + y", { x: '²',y: '³'}), 'Esperado caracter ǹ da soma (soma de caracter com caracter)');
	    	assert.strictEqual("Ńt3st3", parser.evaluate("x + y", { x: 'Ń',y: "t3st3"}), 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)');
	    	assert.strictEqual("t3starº*ß", parser.evaluate("x + y", { x: "t3st",y: "arº*ß"}), 'Esperado texto t3starº*ß da soma (soma de texto com texto)');
	    	//assert.strictEqual(actual, expected, message);
	    })

	    it('.typeOf()', function (){
	    	assert.typeOf( parser.evaluate("x + y", { x: 5,y: 3 }), 'number', 'Esperado number 8 (soma de inteiros)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 5,y: 5.7 }), 'number', 'Esperado number 10.7 (soma de inteiro com real)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 5, y: 'teste' }), 'string','Esperado string 5teste da soma (soma de inteiro com texto)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 'a',y: 1}), 'string' , 'Esperado string b da soma (soma de caracter com inteiro)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 4.5,y: 4.5}), 'number' ,'Esperado number 9.0 da soma (soma de real com real)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 13.9,y: "teste"}), 'string' , 'Esperado string 13.9teste da soma (soma de real com texto)');
	    	assert.typeOf( parser.evaluate("x + y", { x: '²',y: '³'}), 'string' , 'Esperado string ǹ da soma (soma de caracter com caracter)');
	    	assert.typeOf( parser.evaluate("x + y", { x: 'Ń',y: "t3st3"}), 'string' ,'Esperado string Ńt3st3 da soma (soma de caracter com texto)');
	    	assert.typeOf( parser.evaluate("x + y", { x: "t3st",y: "arº*ß"}), 'string' , 'Esperado string t3starº*ß da soma (soma de texto com texto)');    	
	    })

    	it('.throw()', function (){
    		assert.throws(function() {return parser.evaluate("x + y", { x: 5, y: true}); },'Símbolos incompatíveis (soma de inteiro com lógico)');
    		assert.throws(function() {return parser.evaluate("x + y", { x: 3.6, y: true}); },'Símbolos incompatíveis (soma de real com lógico)');
    		assert.throws(function() {return parser.evaluate("x + y", { x: 34.3, y: 'Ƨ'}); },'Símbolos incompatíveis (soma de real com caracter)');
    		assert.throws(function() {return parser.evaluate("x + y", { x: true, y: false}); },'Símbolos incompatíveis (soma de lógico com lógico)');
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
	    	expect(parser.evaluate("x + y", {x: 4.5,y: 4.5}), 'Esperado valor 9.0 da soma (soma de real com real)').to.equal(9.0);
	    	expect(parser.evaluate("x + y", {x: 13.9,y: "teste"}), 'Esperado texto 13.9teste da soma (soma de real com texto)').to.equal("13.9teste");
	    	expect(parser.evaluate("x + y", { x: '²',y: '³'}), 'Esperado caracter ǹ da soma (soma de caracter com caracter)').to.equal('ǹ');
	    	expect(parser.evaluate("x + y", { x: 'Ń',y: "t3st3"}), 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)').to.equal("Ńt3st3");
	    	expect(parser.evaluate("x + y", { x: "t3st",y: "arº*ß"}), 'Esperado texto t3starº*ß da soma (soma de texto com texto)').to.equal("t3starº*ß");
	    })

  		it('.typeOf()', function (){
  			expect(parser.evaluate("x + y", { x: 5,y: 3 })).to.be.a('number');
  			expect(parser.evaluate("x + y", { x: 5,y: 5.7 })).to.be.a('number');
  			expect(parser.evaluate("x + y", { x: 5, y: 'teste' })).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: 'a',y: 1})).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: 4.5,y: 4.5})).to.be.a('number');
  			expect(parser.evaluate("x + y", { x: 13.9,y: "teste"})).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: '²',y: '³'})).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: 'Ń',y: "t3st3"})).to.be.a('string');
  			expect(parser.evaluate("x + y", { x: "t3st",y: "arº*ß"})).to.be.a('string');
  		})

  		it('.throw()', function (){
  			expect(function() {return parser.evaluate("x + y", { x: 5, y: true}); }).to.throw('Símbolos incompatíveis (soma de inteiro com lógico)');
  			expect(function() {return parser.evaluate("x + y", { x: 3.6, y: true}); }).to.throw('Símbolos incompatíveis (soma de real com lógico)');
  			expect(function() {return parser.evaluate("x + y", { x: 34.3, y: 'Ƨ'}); }).to.throw('Símbolos incompatíveis (soma de real com caracter)');
  			expect(function() {return parser.evaluate("x + y", { x: true, y: false}); }).to.throw('Símbolos incompatíveis (soma de lógico com lógico)');
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
		 	parser.evaluate("x + y", {x: 4.5,y: 4.5}).should.equal(9.0, 'Esperado valor 9.0 da soma (soma de real com real)');
		 	parser.evaluate("x + y", {x: 13.9,y: "teste"}).should.equal("13.9teste", 'Esperado texto 13.9teste da soma (soma de real com texto)');
		 	parser.evaluate("x + y", { x: '²',y: '³'}).should.equal('ǹ', 'Esperado caracter ǹ da soma (soma de caracter com caracter)');
		 	parser.evaluate("x + y", { x: 'Ń',y: "t3st3"}).should.equal("Ńt3st3", 'Esperado texto Ńt3st3 da soma (soma de caracter com texto)');
		 	parser.evaluate("x + y", { x: "t3st",y: "arº*ß"}).should.equal("t3starº*ß", 'Esperado texto t3starº*ß da soma (soma de texto com texto)');	    	
	    })

		it('.typeOf()', function (){	
			(parser.evaluate("x + y", { x: 5,y: 3 })).should.be.a('number');
			(parser.evaluate("x + y", { x: 5,y: 5.7 })).should.be.a('number');
			(parser.evaluate("x + y", { x: 5, y: 'teste' })).should.be.a('string');
			(parser.evaluate("x + y", { x: 'a',y: 1})).should.be.a('string');
			(parser.evaluate("x + y", { x: 4.5,y: 4.5})).should.be.a('number');
			(parser.evaluate("x + y", { x: 13.9,y: "teste"})).should.be.a('string');
			(parser.evaluate("x + y", { x: '²',y: '³'})).should.be.a('string');
			(parser.evaluate("x + y", { x: 'Ń',y: "t3st3"})).should.be.a('string');
			(parser.evaluate("x + y", { x: "t3st",y: "arº*ß"})).should.be.a('string');
		})

		it('.throw()', function (){	
			(function() {return parser.evaluate("x + y", { x: 5, y: true}); }).should.throw('Símbolos incompatíveis (soma de inteiro com lógico)');
			(function() {return parser.evaluate("x + y", { x: 3.6, y: true}); }).should.throw('Símbolos incompatíveis (soma de real com lógico)');
			(function() {return parser.evaluate("x + y", { x: 34.3, y: 'Ƨ'}); }).should.throw('Símbolos incompatíveis (soma de real com caracter)');
			(function() {return parser.evaluate("x + y", { x: true, y: false}); }).should.throw('Símbolos incompatíveis (soma de lógico com lógico)');
			(function() {return parser.evaluate("x + y", { x: true, y: "teste"}); }).should.throw('Símbolos incompatíveis (soma de lógico com texto)');
			(function() {return parser.evaluate("x + y", { x: false, y: 'უ'}); }).should.throw('Símbolos incompatíveis (soma de lógico com caracter)');
			//(function() {return parser.evaluate('5 + ('); }).should.throw();
			//erro(function() {(parser.evaluate('5 + (').should.throw('parse error [column 5]: unmatched "()"');}, 'Esperado');
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
