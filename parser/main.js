var Expression = require('./expression');
var Token = require('./token');
var types= require('./definitions/token_types');
var comp=require('./compatibility/compatibility');
var operandCodes=require('./compatibility/vartype_codes');

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

try{
	var p = new Expression();
	var expr="a=2+func(2)";
	p.toPostfix(expr);
}
catch(err){
	console.log(err.message);
}