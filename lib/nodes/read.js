var Node = require('../node'),
        sys = require('sys'),
        prompt = require('prompt'),
        events = require('events');

var Read = function(name) {
    this.name = name;
    this.data = {};
};

sys.inherits(Read, Node);

Read.prototype.execute = function() {
    //O self está associado ao "this" deste bloco
    var self = this;
    prompt.start();
    prompt.get(['data'], function(err, result) {
        self.data[self.name] = result.data;
        self.emit("done", self.data);
    });
};

module.exports = Read;