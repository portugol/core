var sys = require('sys'),
  prio  = require('./definitions/priorities'),
  types = require('./definitions/token_types'),
  util  = require('util');

var Token = function (type_, value_, prio_, number_, parameterStack) {
  this.type_ = type_;
  this.value_ = value_ || 0;
  this.prio_ = prio_ || 0;
  //faz parse float do value se o token for do tipo NUMBER
  this.number_ = (this.type_ === types.REAL || this.type_ === types.INTEGER) ? parseFloat(this.value_) : number_;
  this.parameterStack = parameterStack;
};

Token.prototype.setPrio = function (prio) {
  this.prio_ = prio;
};

Token.prototype.setType = function (type) {
  this.type_ = type;
};

Token.prototype.toString = function () {
  switch (this.type_) {
  case types.REAL:
  case types.INTEGER:
    return "{" + this.number_ + "}";
  case types.NULL:
    return "{NULL}";
  case types.MATHFUNC:
  case types.UNARYOP:
  case types.BINARYOP:
  case types.VAR:
  case types.BOOLEAN:
  case types.FUNC:
  case types.CONST:
  case types.STRING:
  case types.PARENT:
  case types.ARGUMENT:
  case types.PARAMETER:
  case types.ASSIGN:
    return "{" + this.value_ + "}";
  case types.COMMA:
    return "{,}";
  default:
    return "Invalid Token";
  }
};
module.exports = Token;