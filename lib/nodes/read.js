var Node = require('../node'),
        sys = require('sys'),
        prompt = require('prompt'),
        events = require('events'),
        Definition = require('./definition');

var Read = function(name) {
    this.name = name;
    this.data = {};
    this.type = Definition.READ;
};

sys.inherits(Read, Node);

Read.prototype.execute = function() {
    //O self está associado ao "this" deste bloco
    var self = this;
    prompt.start();
    prompt.get(['data'], function(err, result) {
        //self.data[self.name] = result.data;
        self.emit('done', {'memory': true, 'data': result.data});
    });
};

module.exports = Read;