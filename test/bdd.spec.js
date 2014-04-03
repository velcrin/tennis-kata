require('should');
var khan = require('../lib/bdd.js').khan;


describe('Game', function () {

    it('when should add a & b to equal c', khan({

        given: {a: 6, b: 4, c: 10},

        when: function (a, b) {
            this.result = a + b;
        },

        then: function (c) {
            this.result.should.equal(c);
        }
    }));

    it('when should multiply a by b then equal c for each values given to a, b & c', khan({

        when: function (a, b) {
            this.result = a * b;
        },

        then: function (c) {
            this.result.should.equal(c);
        },

        where: [
            {a: 3, b: 4, c: 12},
            {a: 4, b: 2, c: 8}
        ]
    }));
});
