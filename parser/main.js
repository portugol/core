var Expression = require('./expression');
var Token = require('./token');
var tokenTypes= require('./definitions/token_types');
var comp=require('./compatibility/binary_comp').binComp;
var binops=require('./definitions/binary_operators').binops;
var operandCodes=require('./compatibility/vartype_codes');
var Evaluator = require('./evaluator');
var unaryLeftComp=require('./compatibility/unary_left_comp').unaryLeftComp;

//p.parse("2*(1+sin(0+0))/3"); OK 
//p.parse("a&&b||c&&d"); OK
//p.parse("!(a&&c||b&&a&&!c)"; OK
//p.parse("true&&false"); OK
//p.parse("!(true&&false||false&&true&&!true)"); OK
//p.parse("5*func((1+2),2,3)/4+8"); OK
//p.parse("func(((((((1)))))))"); OK
//p.parse("func(((((((1,2)))))))"); OK lança excepçao
//p.parse("func((),1)"; OK
//p.parse("1*-2"); OK
//p.parse("1--2"); OK
//p.parse("1/-2"); OK
//p.parse("1+-2"); OK
//p.parse("-(2*3/1+2)"); OK
//p.parse("-2*(-3--4)"); OK
//p.parse("1+2"); OK
//p.parse("1+2+3+4+5+6"); OK
//OPERAÇOES INVALIDAS:
//p.parse(")"); ERRO OK (parentesis não esperado)
//p.parse("("); ERRO OK (parentesis não fechado)
//p.parse("1+"); ERRO OK (falta operando)
//p.parse("~(3.0+4*5)"); OK


//TESTES DE OPERAçÕES
//var expr="'a'-'Ϩ'"; o caracter resultante é '\u0000' -> VER O QUE FAZER

 
try{
	var p = new Expression(false,true);
	var expr="-(1*23/46.3*20.5)*2/4**10";
	var stack = p.toPostfix(expr);
	
	var e = new Evaluator();
	console.log("RESULT:");
	console.log(e.evaluate(stack));
	console.log(-(1*23/46.3*20.5)*2/(Math.pow(4,10)));
}
catch(err){
	console.log(err.message);
}