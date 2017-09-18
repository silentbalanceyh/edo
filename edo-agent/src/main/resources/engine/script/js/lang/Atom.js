Log = Java.type('com.vie.que.impl.js.JSLog');
/*
 * OOB中的Loader库，用于加载OOB，TP以及EXT三种不同的库专用
 */
(function () {
    // Reference
    var JsonArray = Java.type('io.vertx.core.json.JsonArray');
    var JsonObject = Java.type('io.vertx.core.json.JsonObject');
    var Random = Java.type('com.vie.util.RandomKit');
    var ID = Java.type('com.vie.fixed.Constants').PID;
    var RET = '$$RET$$';
    var UID = '$$USER$$';
    var SIGMA = "sigma";
    // Basic internal function
    var _isArray = function (input) {
        if (Array.prototype.isPrototypeOf(input)) {
            return true;
        } else {
            return false;
        }
    }
    var _isFunction = function (input) {
        if (Function.prototype.isPrototypeOf(input)) {
            return true;
        } else {
            return false;
        }
    }
    // Internal Function
    var _contain = function (array, input) {
        var ret = false
        var length = array.length
        for (var idx = 0; idx < length; idx++) {
            var item = array[idx];
            if (input == item) {
                ret = true;
                break;
            }
        }
        return ret;
    };
    /*
     * 高频使用函数
     * 1. keys = Array的分支
     * 2. keys = String的分支
     */
    var _itArr = function (keys, fnExecute) {
        if (_isArray(keys)) {
            // 数组模式
            keys.forEach(function (key) {
                fnExecute(key);
            });
        } else {
            // 字符串模式
            fnExecute(keys);
        }
    };
    /*
     * 对象属性迭代
     */
    var _itObj = function (reference, fnExecute) {
        for (var field in reference) {
            var value = reference[field];
            if (!_isFunction(value) && _isFunction(fnExecute)) {
                fnExecute(value, field);
            }
        }
    };
    /*
     * keys不传：直接将from中的值拷贝到to中 keys为String：只拷贝key中的值 keys为Array：拷贝keys中每个元素对应键值
     */
    var _copy = function (to, from, keys) {
        if (keys) {
            _itArr(keys, function (key) {
                to[key] = from[key]
            });
        } else {
            _itObj(from, function (value, key) {
                to[key] = value;
            });
        }
    };

    var _copyArray = function (toArr, fromArr) {
        var length = fromArr.length;
        for (var idx = 0; idx < length; idx++) {
            toArr[idx] = fromArr[idx]
        }
    };
    // --> 修改String的原型定义
    String.user = function () {
        var user = null;
        if ($data) {
            user = ($data[UID]) ? $data[UID] : null;
        }
        return user;
    };
    String.random = function (length) {
        return Random.randomString(length);
    };
    String.hmac256 = function (input, secret) {
        return Random.hmacSHA256(input, secret);
    };
    String.prototype.startWith = function (str) {
        var expr = new RegExp("^" + str);
        return expr.test(this);
    };
    String.prototype.endWith = function (str) {
        var expr = new RegExp(str + "$");
        return expr.test(this);
    };
    String.prototype.before = function (str) {
        var index = this.indexOf(str);
        if (0 < index) {
            return this.substring(0, index);
        } else {
            return this
        }
    };
    String.prototype.after = function (str) {
        var index = this.indexOf(str);
        if (0 < index) {
            return this.substring(index + 1, this.length);
        } else {
            return this
        }
    };
    // Function 原型定义
    Function.is = _isFunction
    // 生成对象数组Filter专用函数
    Function.asFilter = function (field, value) {
        return function (item) {
            if (item && item[field]) {
                return value == item[field]
            } else {
                return false;
            }
        }
    };
    // 生成四宫格双条件Filter专用函数，逻辑门
    Function.Logic = {
        // cond1 = true, cond2 = true
        tt: function (cond1, cond2) {
            return function (item) {
                return item[cond1] && item[cond2];
            };
        },
        // cond1 = true, cond2 = false
        tf: function (cond1, cond2) {
            return function (item) {
                return item[cond1] && !item[cond2];
            };
        },
        // cond1 = false, cond2 = true
        ft: function (cond1, cond2) {
            return function (item) {
                return !item[cond1] && item[cond2];
            };
        },
        // cond1 = false, cond2 = false
        ff: function (cond1, cond2) {
            return function (item) {
                return !item[cond1] && !item[cond2];
            };
        },
        // condition = true;
        t: function (condition) {
            return function (item) {
                return item[condition];
            };
        },
        // condition = false;
        f: function (condition) {
            return function (item) {
                return item[condition];
            };
        }
    };
    // --> 修改Object的原型定义
    Object.pk = function (value) {
        var ret = {}
        ret[ID] = value;
        return ret;
    }
    Object.prototype.id = function (value) {
        return this[ID] ? this[ID] : undefined;
    };
    Object.prototype.ma = function () {
        if ($data && $data[SIGMA]) {
            this[SIGMA] = $data[SIGMA];
        }
    };
    Object.prototype.get = function (field) {
        if (!field) {
            Log.warn('[RTE] The parameter "field" of Object.get is not valid: ' + field);
        }
        var value = this[field]
        return (undefined === value || null === value) ? '' : value;
    };
    Object.prototype.getID = function (field) {
        var ret = {};
        if (field) {
            ret[ID] = this[field];
        }
        return ret;
    }
    Object.prototype.getSub = function (keys) {
        var ret = {};
        var reference = this;
        _itArr(keys, function (key) {
            if (undefined !== reference[key]) {
                ret[key] = reference[key];
            }
        });
        return ret;
    };
    Object.prototype.by = function (updated) {
        if (updated) {
            this['updateBy'] = String.user();
        } else {
            this['createBy'] = String.user();
        }
    };
    Object.prototype.set = function (field, value) {
        if (value) {
            this[field] = value;
        }
    };
    Object.prototype.getOrElse = function (field, ret) {
        if (1 === arguments.length) {
            Log.warn('[RTE] You must provide "ret" for Object.getOrElse specific methos: ret = ' + ret);
        }
        var value = this[field]
        return (undefined === value || null === value) ? ret : value;
    };
    Object.prototype.values = function (keys) {
        var values = [];
        var reference = this;
        if (keys) {
            _itArr(keys, function (key) {
                var value = reference[key];
                if (!_isFunction(value)) {
                    values.push(value);
                }
            });
        } else {
            _itObj(reference, function (value) {
                values.push(value);
            });
        }
        return values;
    };
    Object.prototype.toString = function () {
        return JSON.stringify(this);
    };
    Object.prototype.toJson = function () {
        return new JsonObject(JSON.stringify(this));
    };
    Object.prototype.to = function (target, keys) {
        _copy(target, this, keys);
        return target;
    };
    Object.prototype.from = function (target, keys) {
        _copy(this, target, keys);
        return this;
    };
    Object.prototype.fromJson = function (input) {
        if (!input || !input.encode) {
            Log.warn('[RTE] The parameter "input" of Object.from is not valid: ' + input);
        }
        var target = JSON.parse(input.encode());
        _copy(this, target);
        return this
    };
    Object.prototype.each = function (fnCallback) {
        if (fnCallback) {
            var reference = this;
            _itObj(reference, fnCallback);
        }
    };
    Object.prototype.swap = function (from, to) {
        if (!from || !to) {
            Log.warn('[RTE] The parameter "from" and "to" are required, please check.')
        }
        if (this[from]) {
            this[to] = this[from];
        }
    };
    // 不适用serial和tabular防止字段冲突
    // --> 专用于OOB的特殊信息
    Object.prototype.serie = function (serial, field) {
        if (!field)
            field = 'serial';
        this[field] = serial;
    };
    // exprs 格式：{ field: "code=type" }
    Object.prototype.liste = function (exprs, mode) {
        if (!mode)
            mode = "PK";
        var data = {}
        exprs.each(function (value, field) {
            var type = value.before("=");
            var code = value.after("=");
            data[field] = {
                type: type,
                code: code
            }
        });
        this['tabular'] = {}
        this['tabular'][mode] = data;
    };
    // 特殊Api
    Object.prototype.bool = function (keys) {
        var reference = this;
        _itArr(keys, function (key) {
            if (reference[key] && "on" != reference[key]) {
                reference[key] = true;
            } else {
                reference[key] = false;
            }
        });
    };
    Object.prototype._b = function (field) {
        return (this[field]) ? true : false;
    };
    Object.prototype._i = function (field, decimal) {
        var result = this[field] ? this[field] : 0;
        result = (decimal) ? parseFloat(result) : parseInt(result);
        return isNaN(result) ? 0 : result;
    };
    Object.prototype._x = function (operators, decimal) {
        var result = 1;
        if (_isArray(operators)) {
            var reference = this;
            operators.forEach(function (key) {
                var number = 0;
                if (reference[key]) {
                    number = (decimal) ? parseFloat(reference[key]) : parseInt(reference[key]);
                }
                if (isNaN(number)) {
                    Log.warn("[RTE] The field " + key + " is not valid number, NaN found.");
                }
                result = result * number;
            });
        }
        return isNaN(result) ? 1 : result;
    };
    Object.prototype._p = function (field) {
        var result = 0;
        if (this[field]) {
            var literal = this[field];
            if (0 < literal.indexOf("%")) {
                literal = literal.replace('%', '');
                literal = parseFloat(literal) / 100;
                result = literal;
            }
        }
        return result;
    };
    Object.prototype.plus = function (field, init, step) {
        if (undefined === init) init = 1;
        if (undefined === step) step = 1;
        var value = parseInt(this[field]);
        if (0 >= this[field] || !this[field] || isNaN(value)) {
            this[field] = init;
        } else {
            this[field] += step;
        }
    };
    // OOB专用响应格式
    Object.prototype.out = function () {
        return (this[RET]) ? this[RET] : false
    };
    Object.prototype.off = function () {
        this['active'] = false;
    };
    Object.prototype.on = function () {
        this['active'] = true;
    };
    Object.prototype.hcat = function (expr, field) {
        var type = expr.before("=");
        var code = expr.after("=");
        if (!field)
            field = "category";
        this[field] = {
            type: type,
            code: code
        }
    };
    // --> 修改Date原型定义
    // --> 修改Array的原型定义
    Array.zip = function (keys, values) {
        if (_isArray(keys) && _isArray(values)) {
            var length = keys.length;
            var ret = {};
            for (var idx = 0; idx < length; idx++) {
                var key = keys[idx];
                var value = values[idx];
                if (key) ret[key] = value;
            }
            return ret;
        } else {
            Log.warn("[RTE] Zip operation only accept two Array parameters.");
        }
    };
    Array.is = _isArray
    Array.as = function (input) {
        if (_isArray(input)) {
            return input
        } else {
            return [input]
        }
    };
    var _orders = function (keys, isAsc) {
        if (!_isArray(keys)) {
            Log.warn('[RTE] The parameter "keys" of _order must be Array, now it is not valid: ' + keys);
        }
        var asc = (isAsc) ? "ASC" : "DESC";
        var orders = [];
        keys.forEach(function (key) {
            var order = {};
            order[key] = asc;
            orders.push(order);
        })
        return orders;
    };
    Array.desc = function (keys) {
        return _orders(keys, false);
    };
    Array.asc = function (keys) {
        return _orders(keys, true);
    };
    Array.prototype.fromJson = function (input) {
        if (!input || !input.encode) {
            Log.warn('[RTE] The parameter "input" of Array.from is not valid: ' + input);
        }
        var target = JSON.parse(input.encode());
        _copyArray(this, target);
        return this;
    };
    Array.prototype.toJson = function () {
        return new JsonArray(JSON.stringify(this));
    };
    Array.prototype.contain = function (input) {
        return _contain(this, input)
    };
    Array.prototype.each = Array.prototype.forEach;
    Array.prototype.first = function () {
        if (this[0]) {
            return this[0];
        } else {
            return {};
        }
    };
    // Filter唯一读取
    Array.prototype.filterObj = function (fnFilter) {
        if (!fnFilter) {
            Log.warn('[RTE] The parameter "fnFilter" of Array.filterObj is not valid: ' + fnFilter);
        }
        var result = this.filter(fnFilter);
        if (1 == result.length) {
            if (result[0]) {
                result = result[0]
            }
        }
        return result;
    };
    Array.prototype.empty = function () {
        return 0 == this.length;
    };
    // 根据field和value转换对象数组
    Array.prototype.horiz = function (field, value) {
        var result = {};
        for (var idx = 0; idx < this.length; idx++) {
            var item = this[idx];
            if (item[field] && item[value]) {
                result.set(item[field], item[value]);
            }
        }
        return result;
    };
    Array.prototype.add = function (input, dup) {
        if (dup) {
            if (!_contain(this, input)) {
                this.push(input);
            }
        } else {
            this.push(input);
        }
    };
    // 根据field = value条件查找
    Array.prototype.find = function (field, value) {
        var found = false;
        for (var idx = 0; idx < this.length; idx++) {
            var item = this[idx];
            if (value == item[field]) {
                found = item;
                break;
            }
        }
        return found;
    };
    // 分组
    Array.prototype.group = function (field) {
        if (!field) {
            Log.warn('[RTE] The parameters "field" must not be null or empty.');
        }
        var reference = this;
        var mapped = reference.map(function (item) {
            return item[field];
        });
        var grouped = {}
        mapped.forEach(function (item) {
            var key = item;
            var value = reference.filter(function (ele) {
                return key == ele[field];
            });
            grouped[key] = value;
        });
        return grouped;
    };
    // 统计
    Array.prototype.count = function (field, value) {
        var result = this.filter(Function.asFilter(field, value));
        return result.length;
    };
    // 计算数组中的数据和
    Array.prototype.sum = function (decimal) {
        var reference = this;
        var sum = 0;
        reference.forEach(function (item) {
            if (decimal) {
                sum += parseFloat(item);
            } else {
                sum += parseInt(item);
            }
        });
        return sum;
    };
    Array.prototype.sumObj = function (field, decimal) {
        var reference = this;
        var sum = 0;
        reference.forEach(function (item) {
            if (item && item[field]) {
                if (decimal) {
                    sum += parseFloat(item[field]);
                } else {
                    sum += parseInt(item[field]);
                }
            }
        });
        return sum;
    };
    Array.prototype.batch = function (field, value) {
        var reference = this;
        reference.forEach(function (item) {
            if (item) {
                item[field] = value;
            }
        })
    };
    // 两个对象数组进行记录连接
    Array.prototype.enosis = function (target, expr, replaced) {
        if (!replaced) replaced = false;
        if (Array.is(target) && expr && 0 < expr.indexOf('=')) {
            // 在String之后，可直接使用before和after
            var sourceKey = expr.before('=');
            var targetKey = expr.after('=');
            var reference = this;
            if (sourceKey && targetKey) {
                target.forEach(function (item) {
                    var targetValue = item[targetKey];
                    var sourceRef = reference.find(sourceKey, targetValue);
                    if (sourceRef) {
                        if (replaced) {
                            sourceRef.from(item);
                        } else {
                            var middle = {};
                            middle.from(item);
                            middle.from(sourceRef);
                            sourceRef.from(middle);
                        }
                    }
                });
            }
        }
    };
})();
// --> 反射类Mirror专用
Mirror = (function () {
    _singleton = function (obj, methods) {
        var next = true;
        try {
            var reference = eval("new " + obj + "();");
            Log.warn('[RTE] The ' + obj + ' must be singleton, could not be initialized.');
            next = false;
        } catch (error) {
            next = true;
        }
        if (next) {
            try {
                if (methods && Array.is(methods)) {
                    methods.each(function (key) {
                        var reference = eval(obj + '.' + key);
                        if (!Function.is(reference)) {
                            Log.warn('[RTE] The method "' + key + '" is not valid function.')
                        }
                    });
                } else {
                    Log.warn('[RTE] Parameter "methods" type must be Array.');
                }
            } catch (error) {
            }
        }
    }
    _attribute = function (reference, attrs) {
        var next = true;
        try {
            if (reference && Array.is(attrs)) {
                attrs.each(function (attr) {
                    if (!reference[attr]) {
                        Log.warn('[RTE] The attribute "' + attr + '" is not valid, attr = ' + reference[attr]);
                    }
                });
            } else {
                Log.warn('[RTE] Parameter "attrs" type must be Array.')
            }
        } catch (error) {
        }
    }
    return {}
})();
(function () {
    Mirror = Mirror.prototype = {
        singleton: _singleton,
        attribute: _attribute
    }
})();
// 特殊扩展
Error.ensure = function (result, name) {
    if (result) {
        Log.info(" ---> [ " + name + " ] passed successfully! result = " + result);
    } else {
        var error = "[ERR] " + name + " error occur: result = " + result;
        throw new Error(error);
    }
}
Error.debug = function (json) {
    var result = json.toJson();
    Log.info(" ---> Formated \n" + result.encodePrettily());
}
