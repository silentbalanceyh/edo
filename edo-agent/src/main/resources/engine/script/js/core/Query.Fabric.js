Import(['Type', 'Cond', 'MatchMode', 'Formula'])

Fabric = (function () {
    _build = function (record, key, value, reference) {
        // 生成表达式Formula
        var ret = new Formula(key).$();
        var column = record.column(ret.field);
        var expr = null;
        Log.info('---------> field = ' + ret.field + ', column = ' + column + ", value = " + value);
        if (ret.mode) {
            expr = ret.op(column, value, ret.mode);
        } else {
            expr = ret.op(column);
            reference.add(Type.Acquire(record._(), ret.field, value));
        }
        return expr;
    };
    _exec = function (record, data, params, and) {
        /* 构造查询条件 * */
        var expr = null;
        data.each(function (value, key) {
            if (record.contain(key)) {
                var rightExpr = _build(record, key, value, params);
                if (null == expr) {
                    expr = rightExpr;
                } else {
                    if (and) {
                        expr = Cond.AND(expr, rightExpr);
                    } else {
                        expr = Cond.OR(expr, rightExpr);
                    }
                }
            } else {
                Log.info('---------> Skip key in data, key = ' + key)
            }
        })
        return expr;
    };
    return {};
})();

(function () {
    Fabric = Fabric.prototype = {
        exec: _exec,
        build: _build
    }
})();
/*
 * 查询对象，添加高级查询信息
 * @param data
 * @param and
 * @constructor
 */
function Query(data, and) {
    this._expr = null;
    this._data = (data) ? data : (($data) ? $data : {});
    this._and = and;
}

Query.prototype = {
    init: function (record) {
        var params = record.args();
        this._expr = Fabric.exec(record, this._data, params, this._and);
        return this;
    },
    expr: function () {
        return this._expr;
    },
    attach: function (keys) {
        var filter = {}
        var ref = this._data;
        if (Array.is(keys)) {
            keys.each(function (key) {
                filter.set(key, ref[key]);
            })
        } else {
            filter.set(keys, ref[keys]);
        }
        return filter;
    }
}
