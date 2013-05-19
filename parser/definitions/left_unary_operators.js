var vartypeCodes=require('../compatibility/vartype_codes'),
tokenTypes=require('./token_types'),
binComp=require('../compatibility/binary_comp').binComp,
comp=require('../compatibility/unary_left_comp').unaryLeftComp,
Token=require('../token');

ops={
	"!": logicNot,
	"-": negative,
	"~": bitwiseNot
};
//converter o código tokenType em código binário de tipo de variável
var typeToCode ={};
typeToCode[tokenTypes.INTEGER]=vartypeCodes.INTEGER;
typeToCode[tokenTypes.REAL]=vartypeCodes.REAL;
typeToCode[tokenTypes.STRING]=vartypeCodes.STRING;
typeToCode[tokenTypes.CHAR]=vartypeCodes.CHAR;
typeToCode[tokenTypes.BOOLEAN]=vartypeCodes.BOOLEAN;

var finalType={};

module.exports.leftUnaryOps ={
	calculate: function(token1, operatorToken){
		if(!(checkCompatibility(token1, operatorToken))){
			throw "A operacao nao pode ser efectuada com dados deste tipo";
		}
		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		finalType=tokenTypeToVarType(token1.type_);
		if(func===undefined){
			throw "Operador nao definido";
		}
		//converte símbolo para valor
		var value1 =token1.value_;
		//guarda o resultado da operação
		var result =func(value1);

		if(finalType==vartypeCodes.INTEGER){
			result=parseInt(result);
			return new Token(tokenTypes.INTEGER, result);
		}
		if(finalType==vartypeCodes.REAL){
			result=parseFloat(result);
			return new Token(tokenTypes.REAL, result);
		}
		if(finalType==vartypeCodes.CHAR){
			result=String.fromCharCode(result);
			return new Token(tokenTypes.CHAR, result);
		}
		if(finalType==vartypeCodes.STRING){
			result =value1.toString();
			return new Token(tokenTypes.STRING, result);
		}
		if(finalType==vartypeCodes.BOOLEAN){
			return new Token(tokenTypes.BOOLEAN, result);
		}
	}
};

function checkCompatibility(token1, operatorToken){
	return comp.checkCompatibility(token1.type_, operatorToken.value_);
}

//Converte o código do tokenType em código binário do tipo de variável
function tokenTypeToVarType(tokenType){
	return typeToCode[tokenType];
}

function getIntValue(token){
	if(token.type_==tokenTypes.CHAR){
		return token.value_.charCodeAt(0);
	}
	return parseInt(token.value_);
}

function getRealValue(token){
	if(token.type_==tokenTypes.CHAR){
		return this.getCharCode(token.value_);
	}
	return parseFloat(token.value_);
}

function bitwiseNot(value){
	return (~value);
}

function negative(value){
	return value*(-1);
}

function logicNot(value){
	return !(value);
}

