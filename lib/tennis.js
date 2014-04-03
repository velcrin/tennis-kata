/*
 * tennis-kata
 * 
 *
 * Copyright (c) 2014 Vincent Elcrin
 * Licensed under the MIT license.
 */

'use strict';

var points = [0, 15, 30, 40, "A", "Winner"];

function Player(score) {

    this.score = function () {
        var increment = 1;
        if (score.adversary.index < points.indexOf(40) && score.player.index === points.indexOf(40)) {
            increment = 2;
        }
        if (points[score.adversary.index] === "A") {
            score.adversary.index -= 1;
            increment = 0;
        }
        score.player.index += increment;
    };

    this.points = function () {
        return points[score.player.index];
    };
}

exports.game = {

    start: function (player1, player2, score) {
        score = score || [0, 0];
        var match = {},
            left = {
                index: points.indexOf(score[0])
            },
            right = {
                index: points.indexOf(score[1])
            };
        match[player1] = new Player({
            player: left,
            adversary: right
        });
        match[player2] = new Player({
            player: right,
            adversary: left
        });
        match.score = function () {
            if (match[player1].points() === 40 && match[player1].points() === match[player2].points()) {
                return "Deuce";
            }
            return [match[player1].points(), match[player2].points()];
        };

        return match;
    }
};