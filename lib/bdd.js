var assert = require('assert'),
    FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT = /,/,
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function lookup(regexp, object) {
    "use strict";

    for(var property in object) {
        if(object.hasOwnProperty(property) && regexp.test(property)) {
            return object[property];
        }
    }
}

function bddify(object) {
    "use strict";

    return {
        get before() {
            return lookup(/^([b|B]efore).*/, object);
        },
        get given() {
            return lookup(/^([g|G]iven).*/, object);
        },
        get when() {
            return lookup(/^([w|W]hen).*/, object);
        },
        get then() {
            return lookup(/^([t|T]hen).*/, object);
        },
        get where() {
            return lookup(/^([w|W]here).*/, object);
        }
    }
}

/**
 * Call fn and inject dependencies matching in arguments.
 *
 * @param fn is the function called
 * @param scope is the 'this' pass through to fn
 * @param args contains values injected as dependencies to fn
 */
function di(fn, scope, args) {
    var dependencies = [];
    if (!fn) {
        return;
    }
    fn.toString().replace(STRIP_COMMENTS, '').match(FN_ARGS)[1].split(FN_ARG_SPLIT).forEach(function (arg) {
        dependencies.push(args[arg.trim()]);
    });
    fn.apply(scope, dependencies);
}

/**
 * Describe your test with a fluent DSL.
 *
 * e.g
 *  khan({
 *      given:  [object],
 *      when:   [function],
 *      then:   [function],
 *      where:  [list of object]
 *  });
 *
 * @param bdd describe the expected behaviour.
 */
function khan(context) {
    return function () {
        var bdd = bddify(context);
        assert(!bdd.given || !bdd.where, "given & when shouldn't be defined for a test as they are semantically identical");
        var where = bdd.where || [];
        if (bdd.given) {
            where.splice(0, 0, bdd.given);
        }
        where.forEach(function (given) {
            var scope = {};
            di(bdd.before, scope, given);
            di(bdd.when, scope, given);
            di(bdd.then, scope, given);
        });
    };
}

exports.khan = khan;