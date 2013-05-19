var vartypeCodes=require('../compatibility/vartype_codes'),
tokenTypes=require('./token_types'),
comp=require('../compatibility/binary_comp').binComp,
prio= require('./priorities'),
Token=require('../token');

var ops={
	"==": equals,
	"!=": isDif,
	"<=": isMinEqual,
	"<": isMin,
	">": isMaj,
	">=": isMajEqual,
	"||": logicOr,
	"&&": logicAnd
};
//converter o código tokenType em código binário de tipo de variável
var typeToCode ={};
typeToCode[tokenTypes.INTEGER]=vartypeCodes.INTEGER;
typeToCode[tokenTypes.REAL]=vartypeCodes.REAL;
typeToCode[tokenTypes.STRING]=vartypeCodes.STRING;
typeToCode[tokenTypes.CHAR]=vartypeCodes.CHAR;
typeToCode[tokenTypes.BOOLEAN]=vartypeCodes.BOOLEAN;

var finalType={};

module.exports.logicalOps ={
	calculate: function(token1, token2, operatorToken){
		if(!(checkCompatibility(token1, token2, operatorToken))){
			throw "Operacao entre tipos incompativeis";
		}
		//guarda a função javascript que faz a operação (de acordo com o símbolo operatório)
		var func=ops[operatorToken.value_];
		if(func===undefined){
			throw "Operador nao definido";
		}
		//converte símbolos para valores
		var value1 = token1.value_;
		var value2 = token2.value_;
		//guarda o resultado da operação
		var result =func(value1,value2);
		return new Token(tokenTypes.BOOLEAN, result);
	}
};



//Converte o código do tokenType em código binário do tipo de variável
function tokenTypeToVarType(tokenType){
	return typeToCode[tokenType];
}

function getFinalType(token1, token2){
	var type1 = tokenTypeToVarType(token1.type_);
	var type2 = tokenTypeToVarType(token2.type_);
	return comp.getFinalType(type1, type2);
}

function checkCompatibility(token1, token2, operatorToken){
	return comp.checkCompatibility(token1.type_, token2.type_, operatorToken.value_);
}

function equals(value1,value2){
	return (value1==value2);
}

function isMinEqual(value1,value2){
	return (value1<=value2);
}

function isMajEqual(value1,value2){
	return (value1>=value2);
}

function isMaj(value1,value2){
	return (value1>value2);
}

function isMin(value1,value2){
	return (value1<value2);
}

function isDif(value1,value2){
	return (value1!=value2);
}

function logicOr(value1,value2){
	return (value1 || value2);
}

function logicAnd(value1,value2){
	return (value1 && value2);
}