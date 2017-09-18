Cond = (function(){
    /* 1.连接Java类 * */
    var __restrict = Java.type('com.vie.van.impl.Restrictions');
    /* 2.共享函数 * */
    var __single = function(fun, arguments) {
        var expr = null;
        try {
            if (arguments.length == 1) {
                expr = fun(arguments[0]);
            }
        } catch (error) {
            print(error);
        }
        return expr;
    };
    var __double = function(fun, arguments) {
        var expr = null;
        try {
            if (arguments.length == 2) {
                expr = fun(arguments[0], arguments[1]);
            }
        } catch (error) {
            print(error);
        }
        return expr;
    };
    var __tuple = function(fun, arguments) {
        var expr = null;
        try {
            if (arguments.length == 3) {
                expr = fun(arguments[0], arguments[1], arguments[2]);
            }
        } catch (error) {
            print(error);
        }
        return expr;
    };
    var __execute = function(fun, arguments) {
        var expr = null;
        switch (arguments.length) {
        case 1:
            expr = __single(fun, arguments);
            break;
        case 2:
            expr = __double(fun, arguments);
            break;
        case 3:
            expr = __tuple(fun, arguments);
            break;
        }
        return expr;
    };
    // ---- Api
    _eq = function() {
        return __execute(__restrict.eq, arguments);
    };
    _neq = function() {
        return __execute(__restrict.neq, arguments);
    };
    _lt = function() {
        return __execute(__restrict.lt, arguments);
    };
    _le = function() {
        return __execute(__restrict.le, arguments);
    };
    _gt = function() {
        return __execute(__restrict.gt, arguments);
    };
    _ge = function() {
        return __execute(__restrict.ge, arguments);
    };
    _nil = function() {
        return __execute(__restrict.isNull, arguments);
    };
    _nnl = function() {
        return __execute(__restrict.isNotNull, arguments);
    };
    _like = function() {
        return __execute(__restrict.like, arguments);
    };
    _in = function(){
        return __execute(__restrict['in'], arguments);
    };
    _and = function() {
        return __execute(__restrict.and, arguments);
    };
    _or = function() {
        return __execute(__restrict.or, arguments);
    };
    return {}
})();

(function(){
    Cond = Cond.prototype = {
        EQ : _eq,
        NEQ : _neq,
        LT : _lt,
        LE : _le,
        GT : _gt,
        GE : _ge,
        NIL : _nil,
        NNL : _nnl,
        IN : _in,
        LIKE : _like,
        OR : _or,
        AND : _and
    }
})();
