var c=require('./compatibility').compatibility;
var operandCodes=require('./vartype_codes');
var tokenTypes= require('../definitions/token_types');
var Evaluator=require('../evaluator');



console.log("\n\nINTEGER - INTEGER COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.INTEGER,"+",tokenTypes.INTEGER));
console.log("- "+c.checkCompatibility(tokenTypes.INTEGER,"-",tokenTypes.INTEGER));
console.log("/ "+c.checkCompatibility(tokenTypes.INTEGER,"/",tokenTypes.INTEGER));
console.log("* "+c.checkCompatibility(tokenTypes.INTEGER,"*",tokenTypes.INTEGER));
console.log("** "+c.checkCompatibility(tokenTypes.INTEGER,"**",tokenTypes.INTEGER));
console.log("% "+c.checkCompatibility(tokenTypes.INTEGER,"%",tokenTypes.INTEGER));
console.log("== "+c.checkCompatibility(tokenTypes.INTEGER,"==",tokenTypes.INTEGER));
console.log("!= "+c.checkCompatibility(tokenTypes.INTEGER,"!=",tokenTypes.INTEGER));
console.log("<= "+c.checkCompatibility(tokenTypes.INTEGER,"<=",tokenTypes.INTEGER));
console.log("< "+c.checkCompatibility(tokenTypes.INTEGER,"<",tokenTypes.INTEGER));
console.log(">= "+c.checkCompatibility(tokenTypes.INTEGER,">=",tokenTypes.INTEGER));
console.log("> "+c.checkCompatibility(tokenTypes.INTEGER,">",tokenTypes.INTEGER));
console.log("&& "+c.checkCompatibility(tokenTypes.INTEGER,"&&",tokenTypes.INTEGER));
console.log("|| "+c.checkCompatibility(tokenTypes.INTEGER,"||",tokenTypes.INTEGER));
console.log("<< "+c.checkCompatibility(tokenTypes.INTEGER,"<<",tokenTypes.INTEGER));
console.log(">> "+c.checkCompatibility(tokenTypes.INTEGER,">>",tokenTypes.INTEGER));
console.log("| " +c.checkCompatibility(tokenTypes.INTEGER,"|",tokenTypes.INTEGER));
console.log("& "+c.checkCompatibility(tokenTypes.INTEGER,"&",tokenTypes.INTEGER));

console.log("\n\nINTEGER - REAL COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.REAL,"+",tokenTypes.REAL));
console.log("- "+c.checkCompatibility(tokenTypes.REAL,"-",tokenTypes.REAL));
console.log("/ "+c.checkCompatibility(tokenTypes.REAL,"/",tokenTypes.REAL));
console.log("* "+c.checkCompatibility(tokenTypes.REAL,"*",tokenTypes.REAL));
console.log("** "+c.checkCompatibility(tokenTypes.REAL,"**",tokenTypes.REAL));
console.log("% "+c.checkCompatibility(tokenTypes.REAL,"%",tokenTypes.REAL));
console.log("== "+c.checkCompatibility(tokenTypes.REAL,"==",tokenTypes.REAL));
console.log("!= "+c.checkCompatibility(tokenTypes.REAL,"!=",tokenTypes.REAL));
console.log("<= "+c.checkCompatibility(tokenTypes.REAL,"<=",tokenTypes.REAL));
console.log("< "+c.checkCompatibility(tokenTypes.REAL,"<",tokenTypes.REAL));
console.log(">= "+c.checkCompatibility(tokenTypes.REAL,">=",tokenTypes.REAL));
console.log("> "+c.checkCompatibility(tokenTypes.REAL,">",tokenTypes.REAL));
console.log("&& "+c.checkCompatibility(tokenTypes.REAL,"&&",tokenTypes.REAL));
console.log("|| "+c.checkCompatibility(tokenTypes.REAL,"||",tokenTypes.REAL));
console.log("<< "+c.checkCompatibility(tokenTypes.REAL,"<<",tokenTypes.REAL));
console.log(">> "+c.checkCompatibility(tokenTypes.REAL,">>",tokenTypes.REAL));
console.log("| " +c.checkCompatibility(tokenTypes.REAL,"|",tokenTypes.REAL));
console.log("& "+c.checkCompatibility(tokenTypes.REAL,"&",tokenTypes.REAL));

console.log("\n\nINTEGER - CHAR COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.CHAR,"+",tokenTypes.CHAR));
console.log("- "+c.checkCompatibility(tokenTypes.CHAR,"-",tokenTypes.CHAR));
console.log("/ "+c.checkCompatibility(tokenTypes.CHAR,"/",tokenTypes.CHAR));
console.log("* "+c.checkCompatibility(tokenTypes.CHAR,"*",tokenTypes.CHAR));
console.log("** "+c.checkCompatibility(tokenTypes.CHAR,"**",tokenTypes.CHAR));
console.log("% "+c.checkCompatibility(tokenTypes.CHAR,"%",tokenTypes.CHAR));
console.log("== "+c.checkCompatibility(tokenTypes.CHAR,"==",tokenTypes.CHAR));
console.log("!= "+c.checkCompatibility(tokenTypes.CHAR,"!=",tokenTypes.CHAR));
console.log("<= "+c.checkCompatibility(tokenTypes.CHAR,"<=",tokenTypes.CHAR));
console.log("< "+c.checkCompatibility(tokenTypes.CHAR,"<",tokenTypes.CHAR));
console.log(">= "+c.checkCompatibility(tokenTypes.CHAR,">=",tokenTypes.CHAR));
console.log("> "+c.checkCompatibility(tokenTypes.CHAR,">",tokenTypes.CHAR));
console.log("&& "+c.checkCompatibility(tokenTypes.CHAR,"&&",tokenTypes.CHAR));
console.log("|| "+c.checkCompatibility(tokenTypes.CHAR,"||",tokenTypes.CHAR));
console.log("<< "+c.checkCompatibility(tokenTypes.CHAR,"<<",tokenTypes.CHAR));
console.log(">> "+c.checkCompatibility(tokenTypes.CHAR,">>",tokenTypes.CHAR));
console.log("| " +c.checkCompatibility(tokenTypes.CHAR,"|",tokenTypes.CHAR));
console.log("& "+c.checkCompatibility(tokenTypes.CHAR,"&",tokenTypes.CHAR));

console.log("\n\nINTEGER - STRING COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.STRING,"+",tokenTypes.STRING));
console.log("- "+c.checkCompatibility(tokenTypes.STRING,"-",tokenTypes.STRING));
console.log("/ "+c.checkCompatibility(tokenTypes.STRING,"/",tokenTypes.STRING));
console.log("* "+c.checkCompatibility(tokenTypes.STRING,"*",tokenTypes.STRING));
console.log("** "+c.checkCompatibility(tokenTypes.STRING,"**",tokenTypes.STRING));
console.log("% "+c.checkCompatibility(tokenTypes.STRING,"%",tokenTypes.STRING));
console.log("== "+c.checkCompatibility(tokenTypes.STRING,"==",tokenTypes.STRING));
console.log("!= "+c.checkCompatibility(tokenTypes.STRING,"!=",tokenTypes.STRING));
console.log("<= "+c.checkCompatibility(tokenTypes.STRING,"<=",tokenTypes.STRING));
console.log("< "+c.checkCompatibility(tokenTypes.STRING,"<",tokenTypes.STRING));
console.log(">= "+c.checkCompatibility(tokenTypes.STRING,">=",tokenTypes.STRING));
console.log("> "+c.checkCompatibility(tokenTypes.STRING,">",tokenTypes.STRING));
console.log("&& "+c.checkCompatibility(tokenTypes.STRING,"&&",tokenTypes.STRING));
console.log("|| "+c.checkCompatibility(tokenTypes.STRING,"||",tokenTypes.STRING));
console.log("<< "+c.checkCompatibility(tokenTypes.STRING,"<<",tokenTypes.STRING));
console.log(">> "+c.checkCompatibility(tokenTypes.STRING,">>",tokenTypes.STRING));
console.log("| " +c.checkCompatibility(tokenTypes.STRING,"|",tokenTypes.STRING));
console.log("& "+c.checkCompatibility(tokenTypes.STRING,"&",tokenTypes.STRING));

console.log("\n\nINTEGER - BOOLEAN COMPATIBILITY");

console.log("+ "+c.checkCompatibility(tokenTypes.BOOLEAN,"+",tokenTypes.BOOLEAN));
console.log("- "+c.checkCompatibility(tokenTypes.BOOLEAN,"-",tokenTypes.BOOLEAN));
console.log("/ "+c.checkCompatibility(tokenTypes.BOOLEAN,"/",tokenTypes.BOOLEAN));
console.log("* "+c.checkCompatibility(tokenTypes.BOOLEAN,"*",tokenTypes.BOOLEAN));
console.log("** "+c.checkCompatibility(tokenTypes.BOOLEAN,"**",tokenTypes.BOOLEAN));
console.log("% "+c.checkCompatibility(tokenTypes.BOOLEAN,"%",tokenTypes.BOOLEAN));
console.log("== "+c.checkCompatibility(tokenTypes.BOOLEAN,"==",tokenTypes.BOOLEAN));
console.log("!= "+c.checkCompatibility(tokenTypes.BOOLEAN,"!=",tokenTypes.BOOLEAN));
console.log("<= "+c.checkCompatibility(tokenTypes.BOOLEAN,"<=",tokenTypes.BOOLEAN));
console.log("< "+c.checkCompatibility(tokenTypes.BOOLEAN,"<",tokenTypes.BOOLEAN));
console.log(">= "+c.checkCompatibility(tokenTypes.BOOLEAN,">=",tokenTypes.BOOLEAN));
console.log("> "+c.checkCompatibility(tokenTypes.BOOLEAN,">",tokenTypes.BOOLEAN));
console.log("&& "+c.checkCompatibility(tokenTypes.BOOLEAN,"&&",tokenTypes.BOOLEAN));
console.log("|| "+c.checkCompatibility(tokenTypes.BOOLEAN,"||",tokenTypes.BOOLEAN));
console.log("<< "+c.checkCompatibility(tokenTypes.BOOLEAN,"<<",tokenTypes.BOOLEAN));
console.log(">> "+c.checkCompatibility(tokenTypes.BOOLEAN,">>",tokenTypes.BOOLEAN));
console.log("| " +c.checkCompatibility(tokenTypes.BOOLEAN,"|",tokenTypes.BOOLEAN));
console.log("& "+c.checkCompatibility(tokenTypes.BOOLEAN,"&",tokenTypes.BOOLEAN));



var codes={
	1: "INTEGER",
	2: "REAL",
	4: "STRING",
	8: "CHAR",
	16: "BOOLEAN"
};


console.log("\n\n************************************************************");
console.log("INTEGER VARTYPES RESULT");
console.log("************************************************************");
console.log("INTEGER -> "+codes[c.getFinalType(operandCodes.INTEGER,operandCodes.INTEGER)]);
console.log("REAL -> "+codes[c.getFinalType(operandCodes.INTEGER,operandCodes.REAL)]);
console.log("STRING -> "+codes[c.getFinalType(operandCodes.INTEGER,operandCodes.STRING)]);
console.log("CHAR-> "+codes[c.getFinalType(operandCodes.INTEGER,operandCodes.CHAR)]);
console.log("\n\n************************************************************");
console.log("REAL VARTYPES RESULT");
console.log("************************************************************");
console.log("INTEGER -> "+codes[c.getFinalType(operandCodes.REAL,operandCodes.INTEGER)]);
console.log("REAL -> "+codes[c.getFinalType(operandCodes.REAL,operandCodes.REAL)]);
console.log("STRING -> "+codes[c.getFinalType(operandCodes.REAL,operandCodes.STRING)]);

console.log("\n\n************************************************************");
console.log("STRING VARTYPES RESULT");
console.log("************************************************************");
console.log("INTEGER -> "+codes[c.getFinalType(operandCodes.STRING,operandCodes.INTEGER)]);
console.log("REAL -> "+codes[c.getFinalType(operandCodes.STRING,operandCodes.REAL)]);
console.log("STRING -> "+codes[c.getFinalType(operandCodes.STRING,operandCodes.STRING)]);
console.log("CHAR-> "+codes[c.getFinalType(operandCodes.STRING,operandCodes.CHAR)]);

console.log("\n\n************************************************************");
console.log("CHAR VARTYPES RESULT");
console.log("************************************************************");

console.log("INTEGER -> "+codes[c.getFinalType(operandCodes.CHAR,operandCodes.INTEGER)]);
console.log("STRING -> "+codes[c.getFinalType(operandCodes.CHAR,operandCodes.STRING)]);
console.log("CHAR-> "+codes[c.getFinalType(operandCodes.CHAR,operandCodes.CHAR)]);

console.log("\n\n************************************************************");
console.log("BOOLEAN VARTYPES RESULT");
console.log("************************************************************");

console.log("INTEGER -> "+codes[c.getFinalType(operandCodes.BOOLEAN,operandCodes.BOOLEAN)]);

