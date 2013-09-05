var Memory = function(){
	this.vars={};
};

Memory.prototype.addVar=function(var_){
	this.vars[var_.name_]=var_;
};

Memory.prototype.getVar=function(name_){
	return this.vars[name_];
};

Memory.prototype.setValue = function(name, value){
	this.getVar(name).value_=value;
};

Memory.prototype.setSymbol = function(name, symbol){
	this.getVar(name).symbol_=symbol;
};

Memory.prototype.clearMemory= function(name, symbol){
	this.vars={};
};

module.exports=Memory;
