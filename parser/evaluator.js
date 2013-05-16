var Parser= require('./expression'),
	tokenTypes=require('./definitions/token_types'),
	vartypeCodes=require('./compatibility/vartype_codes'),
	comp=require('./compatibility/compatibility').compatibility;

var Evaluator = function(){
	this.opFunc = {
		"+": add,
		"-": sub,
		"*": mul,
		"/": div
	};
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
	this.item={};

	while(this.postfixstack.length>0){
		//o shift remove o primeiro elemento da pilha
		this.item=this.postfixstack.shift();
		//carregar operandos para a pilha
		while((this.item.type_!=tokenTypes.BINARYOP) && (this.item.type_!=tokenTypes.UNARYOP) && (this.postfixstack.length>0)){
			//o unshift adiciona elementos no inicio da pilha
			//passa o token para a pilha temporaria
			this.tempstack.unshift(this.item);
			//retira um novo item da stack pos fixa
			this.item=this.postfixstack.shift();
		}
		//se o token for um operador binario
		if(this.item.type_==tokenTypes.BINARYOP){
			var token1=this.tempstack.shift();
			var token2=this.tempstack.shift();
			if(token1===undefined || token2===undefined){
				this.throwError("Erro de paridade");
			}
			if(this.checkCompatibility(token1,this.item,token2)){
				//guarda o tipo de dados final
				var dataType=this.getFinalType(token1,token2);
				//guarda a função javascript correspondente ao operador
				var func=this.opFunc[this.item.value_];
				if(func===undefined){
					this.throwError("A funcao referente ao simbolo operatorio nao esta definida");
				}
				this.tempstack.unshift(func(token1.value_,token2.value_));
				console.log(this.tempstack);
			}
			else{
				this.throwError("Tipos de dados incompativeis");
			}

		}
		else if(this.item.type_==tokenTypes.UNARYOP){

		}
	}
};

Evaluator.prototype.checkCompatibility = function(token1, operator, token2){
	return comp.checkCompatibility(token1.type_, operator.value_, token2.type_);
};

Evaluator.prototype.getFinalType = function(token1, token2){
	var type1 = this.tokenTypeToVarType(token1.type_);
	var type2 = this.tokenTypeToVarType(token2.type_);
	return comp.getFinalType(type1, type2);
};

Evaluator.prototype.throwError = function(msg){
	throw new Error("EVALUATOR ERROR:" + msg);
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
