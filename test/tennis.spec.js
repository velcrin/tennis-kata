'use strict';

var chai = require('chai'),
    khan = require('../lib/bdd.js').khan,
    tennis = require('../lib/tennis.js');
chai.Should();

describe('Game', function () {

    it('should initialize a match', khan({
        given: {
            game: tennis.game
        },
        when: function (game) {
            this.match = game.start("Federer", "Nadal");
        },
        then: function () {
            this.match.score().should.eql([0, 0]);
            this.match.should.have.property("Federer");
            this.match.should.have.property("Nadal");
        }
    }));
});

describe('Match', function () {

    it('should follow the rules of tennis scores', khan({
        before: function (initial) {
            this.match = tennis.game.start("Federer", "Nadal", initial);
        },
        when: function (scorer) {
            this.match[scorer].score();
        },
        then: function (result) {
            this.match.score().should.eql(result);
        },
        where: [
            { initial: [0, 0],    scorer: "Federer",  result: [15, 0] },
            { initial: [0, 0],    scorer: "Nadal",    result: [0, 15] },
            { initial: [30, 30],  scorer: "Federer",  result: [40, 30] },
            { initial: [40, 40],  scorer: "Nadal",    result: [40, "A"] },
            { initial: [40, 30],  scorer: "Federer",  result: ["Winner", 30] },
            { initial: ["A", 40], scorer: "Federer",  result: ["Winner", 40] },
            { initial: ["A", 40], scorer: "Nadal",    result: "Deuce" }
        ]

    }));
});