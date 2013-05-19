var Parser= require('./expression'),
	tokenTypes=require('./definitions/token_types'),
	vartypeCodes=require('./compatibility/vartype_codes'),
	comp=require('./compatibility/binary_comp').binComp,
	binLogicOps=require('./definitions/binary_logical_operators').logicalOps,
	binOps=require('./definitions/binary_operators').binaryOps,
	leftUnaryOps=require('./definitions/left_unary_operators').leftUnaryOps,
	Debug = require('./debug/debug'); 


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
	this.item={};
	this.resultToken={};
	this.token1={};
	this.token2={};

	while(this.postfixstack.length>0){
		//o shift remove o primeiro elemento da pilha
		this.item=this.postfixstack.shift();
		//carregar operandos para a pilha
		while(this.isntOperator() && (this.postfixstack.length>0)){
			//o unshift adiciona elementos no inicio da pilha
			//passa o token para a pilha temporaria
			this.tempstack.push(this.item);
			//retira um novo item da stack pos fixa
			this.item=this.postfixstack.shift();
		}
		//se o token for um operador binario
		if(this.item.type_==tokenTypes.BINARYOP){
			this.token2=this.tempstack.pop();
			this.token1=this.tempstack.pop();

			if(this.token1===undefined || this.token2===undefined){
				this.throwError("Erro de paridade");
			}
			try{
				this.resultToken=binOps.calculate(this.token1, this.token2, this.item);
			}
			catch(err){
				this.throwError(err);
			}
			this.tempstack.push(this.resultToken);
			//console.log(this.tempstack);
		}
		else if(this.item.type_==tokenTypes.UNARY_LEFT_OP){
			this.token1=this.tempstack.shift();
			if(this.token1===undefined){
				this.throwError("Erro de paridade");
			}
			try{
				this.resultToken=leftUnaryOps.calculate(this.token1, this.item);
			}
			catch(err){
				this.throwError(err);
			}
			this.tempstack.push(this.resultToken);
		}
		else if(this.item.type_==tokenTypes.BINARY_LOGIC_OP){
			this.token2=this.tempstack.shift();
			this.token1=this.tempstack.shift();
			
			if(this.token1===undefined || this.token2===undefined){
				this.throwError("Erro de paridade");
			}
			try{
				this.resultToken=binLogicOps.calculate(this.token1, this.token2, this.item);
			}
			catch(err){
				this.throwError(err);
			}
			this.tempstack.push(this.resultToken);
		}
	}
	if(this.resultToken.type_==tokenTypes.INTEGER){
		return parseInt(this.resultToken.value_);
	}
	if(this.resultToken.type_==tokenTypes.REAL){
		return parseFloat(this.resultToken.value_);
	}
	if(this.resultToken.type_==tokenTypes.CHAR){
		return this.resultToken.value_;
	}
	if(this.resultToken.type_==tokenTypes.STRING){
		return this.resultToken.value_;
	}
	if(this.resultToken.type_==tokenTypes.BOOLEAN){
		return this.resultToken.value_;
	}
};

Evaluator.prototype.isntOperator= function(){
	var t=this.item.type_;
	return (t!=tokenTypes.BINARYOP) && (t!=tokenTypes.UNARY_LEFT_OP) &&  (t!=tokenTypes.UNARY_RIGHT_OP) &&(t!=tokenTypes.BINARY_LOGIC_OP);
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

module.exports=Evaluator;
