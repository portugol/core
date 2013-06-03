var Memory = function(){
	this.vars=[];
};

Memory.prototype.addVar=function(var_){
	this.vars.push(var_);
};

Memory.prototype.getVar=function(name_){
	for(var i=0; i<this.vars.length; i++){
		if(this.vars[i].name_==name_){
			return this.vars[i];
		}
	}
};

/*var Memory = function(){
	this.vars={};
};

Memory.prototype.addVar=function(var_){
	this.vars[var_.name_] = var_;
};

Memory.prototype.getVar=function(name_){
	return this.vars[name_];
};*/



module.exports=Memory;
