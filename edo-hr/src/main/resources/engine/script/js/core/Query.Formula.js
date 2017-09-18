function Formula(field) {
    var _fnFlat = function(key, target) {
        return (target) ? target[key] : key;
    }
    var modes = {
        "~!" : _fnFlat("START"),
        "!~" : _fnFlat("END"),
        "~~" : _fnFlat("ANYWHERE")
    }
    var ops = {
        "!n" : _fnFlat("NIL"),
        "!e" : _fnFlat("NNL"),
        "~!" : _fnFlat("LIKE"),
        "!~" : _fnFlat("LIKE"),
        "~~" : _fnFlat("LIKE"),
        "<>" : _fnFlat("NEQ"),
        "<=" : _fnFlat("LE"),
        ">=" : _fnFlat("GE"),
        "<" : _fnFlat("LT"),
        ">" : _fnFlat("GT"),
        "!i" : _fnFlat("IN"),
        "=" : _fnFlat("EQ")
    }
    // =号可不检查
    var opArr = [ "!n", "!e", "~!", "!~", "~~", "<>", "<=", ">=", "<", ">",
            "!i", "=" ];
    // 迭代取值
    var _op = ops["="];
    var _field = field;
    var _mode;
    for (var idx = 0; idx < opArr.length; idx++) {
        var op = opArr[idx];
        if (field.endWith(op)) {
            _field = field.before(op);
            _op = ops[op];
            if (modes[op])
                _mode = modes[op];
            break;
        }
    }
    // 取对象数据
    this._op = _op;
    this._field = _field;
    if (_mode) {
        this._mode = _mode;
    }
    Log.info("[FMA] Formula is field = " + _field + ", op = " + _op
            + ", mode = " + _mode);
}

// 闭包赋值
(function() {
    // 三元操作符IN
    var _in = function(field, value) {
        var formula = {};
        if (Array.is(value)) {
            formula[field] = value;
        }
        return formula;
    }
    // 其他三元操作符
    var _ternary = function(field, op, value) {
        var formula = {};
        if (!op)
            op = "EQ";
        var formula = {};
        if (!Array.is(value)) {
            formula[field] = value;
            formula["$OP$"] = op;
        }
        return formula;
    }
    // 二元操作
    var _binary = function(field, op) {
        var formula = {};
        formula[op] = field;
        return formula;
    }
    // 四元操作
    var _quaternary = function(field, mode, value) {
        var formula = {};
        if (!mode)
            mode = "ANYWHERE";
        if (!Array.is(value)) {
            formula[field] = value;
            formula["$MODE$"] = mode;
        }
        return formula;
    }
    // 专用赋值
    Formula.prototype._ = function(value) {
        var ret = {};
        if ("IN" == this._op) {
            // IN操作符
            ret = _in(this._field, value);
        } else if ("NNL" == this._op || "NIL" == this._op) {
            // 二元操作符
            ret = _binary(this._field, this._op);
        } else if ("LIKE" == this._op) {
            // 四元操作符
            ret = _quaternary(this._field, this._mode, value);
        } else {
            // 三元其他操作符
            ret = _ternary(this._field, this._op, value);
        }
        return ret;
    }
    Formula.prototype.$ = function() {
        var ret = {};
        try{
            ret['op'] = eval('Cond["' + this._op + '"]');
            ret['field'] = this._field;
            if (this._mode) {
                ret['mode'] = eval('MatchMode["' + this._mode + '"]');
            }
        }catch(error){
            Log.warn('Cond & MatchMode have not been imported.');
            ret = {};
        }
        return ret;
    }
})();
