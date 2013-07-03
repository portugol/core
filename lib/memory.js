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

Memory.prototype.setValue = function(name, value){
	this.getVar(name).value_=value;
};

module.exports=Memory;
