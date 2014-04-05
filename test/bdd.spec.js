var chai = require('chai'),
    khan = require('../lib/bdd.js').khan;
chai.Should();


describe('Khan', function () {

    it('should inject variable defined in given clause where requested', khan({
        "Given 3 numbers a, b & c": {a: 6, b: 4, c: 10},
        "When we add a to b": function (a, b) {
            this.result = a + b;
        },
        "Then the result should be c": function (c) {
            this.result.should.equal(c);
        }
    }));

    it('should iter on where clause and inject values where requested', khan({
        "when we multiply a & b": function (a, b) {
            this.result = a * b;
        },
        "then the result should be c": function (c) {
            this.result.should.equal(c);
        },
        "where a, b & c get the following values": [
            {a: 3, b: 4, c: 12},
            {a: 4, b: 2, c: 8}
        ]
    }));
});