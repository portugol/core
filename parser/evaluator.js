var Parser= require('./expression'),
	tokenTypes=require('./definitions/token_types'),
	vartypeCodes=require('./compatibility/vartype_codes'),
	comp=require('./compatibility/compatibility');

var Evaluator = function(){

};

//guardar códigos binários dos tipos de variável
var INTEGER = vartypeCodes.INTEGER;
var	REAL    = vartypeCodes.REAL;
var	STRING  = vartypeCodes.STRING;
var	CHAR    = vartypeCodes.CHAR;
var	BOOLEAN = vartypeCodes.BOOLEAN;
var	NULL    = vartypeCodes.NULL;
var	ALL     = vartypeCodes.ALL;
var	NUMBER  = vartypeCodes.NUMBER;

//converter o código tokenType em código binário de tipo de variável
var typeToCode ={};
typeToCode[tokenTypes.INTEGER]=INTEGER;
typeToCode[tokenTypes.REAL]=REAL;
typeToCode[tokenTypes.STRING]=STRING;
typeToCode[tokenTypes.CHAR]=CHAR;
typeToCode[tokenTypes.BOOLEAN]=BOOLEAN;

//Converte o código do tokenType em código binário do tipo de variável
Evaluator.prototype.tokenTypeToVarType = function(tokenType){
	return typeToCode[tokenType];
};

Evaluator.prototype.evaluate = function(postfixstack){
	this.tempstack=[];
	this.postfixstack=postfixstack;
	var item;
	while(postfixstack.length>0){
		item=postfixstack.pop();
		//carregar operaandos para a pilha
		while(item.type_!=tokenTypes.BINARYOP && item.type_!=tokenTypes.UNARYOP && this.postfixstack.length>0){
			this.tempstack.push(item);
			item=postfixstack.pop();
		}
		if(item.type_==tokenTypes.BINARYOP){
			var token1=tempstack.pop();
			var token2=tempstack.pop();
			if(this.checkCompatibility(token1,item,token2)){

			}
			else{
				//EXCEPTION
			}

		}
		else if(item.type_==tokenTypes.UNARYOP){

		}
	}
};

Evaluator.prototype.checkCompatibility = function(token1, operatorSymbol, token2){
	return comp.checkCompatibility(token.type_, operatorSymbol, token2.type_);
};

Evaluator.prototype.getFinalType = function(token1, token2){

};


this.opFunc = {
	"+": add,
	"-": sub,
	"*": mul,
	"/": div
};

function add(a, b) {
	return parseFloat((a+b).toPrecision(12));
}
function sub(a, b) {
	return parseFloat((a-b).toPrecision(12));
}
function mul(a, b) {
	return parseFloat((a*b).toPrecision(12));
}
function div(a, b) {
	return a / b;
}
function pow(base, exp) {
	return parseFloat((Math.pow(base,exp).toPrecision(12)));
}
function mod(a, b) {
	return a % b;
}

module.exports=Evaluator;
