var tokenTypes= require('../definitions/token_types'),
operandCodes=require('./vartype_codes'),
util = require('util');

var ops={
	"!": operandCodes.INTEGER
};

var typeToCode ={};
typeToCode[tokenTypes.INTEGER]=operandCodes.INTEGER;
typeToCode[tokenTypes.NUMBER]=operandCodes.NUMBER;
typeToCode[tokenTypes.REAL]=operandCodes.REAL;
typeToCode[tokenTypes.STRING]=operandCodes.STRING;
typeToCode[tokenTypes.CHAR]=operandCodes.CHAR;
typeToCode[tokenTypes.BOOLEAN]=operandCodes.BOOLEAN;

module.exports.unaryRightComp={
	checkCompatibility: function(tokenType, operatorSymbol){
		if(operatorSymbol in ops){
			//se o tipo de dados é compatível com o operador
			if((ops[operatorSymbol] & typeToCode[tokenType])===0){
				return false;
			}
		}
		return true;
	}
};