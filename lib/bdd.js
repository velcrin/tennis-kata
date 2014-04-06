"use strict";

var assert = require('assert'),
    HtmlReport = require('./report.js').HtmlReport,

    FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
    FN_ARG_SPLIT = /,/,
    STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function introspect(object, closure) {

    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            closure.call(undefined, property);
        }
    }
}

function build(context, dependencies) {

    var message = "";
    introspect(context, function (clause) {
        message += contextualize(clause, dependencies) + "\n";
    });
    return message;
}

function contextualize(message, dependencies) {

    introspect(dependencies, function (variable) {
        message = message.replace(new RegExp("\\${" + variable + "}", "gi"), dependencies[variable]);
    });
    return message;
}

function lookup(regexp, object) {

    for (var property in object) {
        if (object.hasOwnProperty(property) && regexp.test(property)) {
            return object[property];
        }
    }
}

function bddify(object) {

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
    };
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
 * @param context describe the expected behaviour.
 */
function khan(context) {

    return function () {
        var bdd = bddify(context);
        assert(!bdd.given || !bdd.where, "given & when shouldn't be defined for a test as they are semantically identical");
        var where = bdd.where || [],
            report = new HtmlReport();
        if (bdd.given) {
            where.splice(0, 0, bdd.given);
        }
        where.forEach(function (variables) {
            try {
                var scope = {};
                di(bdd.before, scope, variables);
                di(bdd.when, scope, variables);
                di(bdd.then, scope, variables);
                report.dump(build(context, variables));
            } catch (assertion) {
                report.done();
                throw assertion;
            }
        });
        report.done();
    };
}

exports.khan = khan;