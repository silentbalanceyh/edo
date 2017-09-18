function Request() {
    var raw = ($data) ? $data : {};
    // 基础数据
    this._data = raw
    // 关联数据
    this._ref = raw.getOrElse('ref', {});
    // 用户数据
    this._user = raw.getOrElse('$$USER$$', null);
    // Sigma
    this._sigma = raw.get('sigma');

    Mirror.attribute(this, ['_data', '_ref', '_user', '_sigma']);
}

Request.prototype = {
    // 直接引用返回
    ref: function (field) {
        return this._ref[field];
    },
    _: function () {
        return this._data;
    },
    keys: function () {
        return (this._data) ? Object.keys(this._data) : []
    },
    sigma: function () {
        return this._sigma;
    },
    // 读数据
    get: function (key) {
        if (!this._data[key]) {
            Log.warn('[RTE] The "' + key + '" field does not exist in data.')
        }
        return this._data[key]
    },
    getSub: function (keys) {
        return this._data.getSub(keys);
    },
    array: function (key) {
        var array = this._data[key];
        if (!Array.is(array)) {
            array = [];
        }
        return array;
    },
    zip: function (key, value) {
        var keys = this._data[key];
        var values = this._data[value];
        if (!Array.is(keys)) keys = [keys];
        if (!Array.is(values)) values = [values];
        return Array.zip(keys, values);
    },
    bool: function (key) {
        if (this._data[key]) {
            return true;
        } else {
            return false;
        }
    },
    by: function (update) {
        if (this._user) {
            if (update) {
                this._data['updateBy'] = this._user;
            } else {
                this._data['createBy'] = this._user;
            }
        }
        if (!update)
            delete this._data['uniqueId'];
    },
    // 写数据，如果existing为true，当前请求包含数据时不执行set
    set: function (key, value, existing) {
        if (existing) {
            if (!this._data.hasOwnProperty(key)) {
                this._data[key] = value;
            }
        } else {
            this._data[key] = value
        }
    },
    swap: function (from, to) {
        this._data.swap(from, to);
    },
    swapRef: function (from, to) {
        if (!from) {
            Log.warn("[RTE] The parameter 'from' must be existing. from = " + from);
        }
        // 单参数处理，同名转移
        if (!to) to = from;
        if (this._ref && this._ref[from]) {
            this._data[to] = this._ref[from];
        }
    },
    intake: function (data) {
        if (data) {
            var reference = this._data
            data.each(function (value, key) {
                reference[key] = value
            });
        }
    }
}

function Record() {
    if ($env) {
        this._env = $env

        this._record = $env.getRecord()

        this._params = $env.getValues()

        this._identifier = this._record.identifier()
    }

    Mirror.attribute(this, ['_env', '_record', '_params', '_identifier']);
}

Record.prototype = {
    // Query常用的方法
    _: function () {
        return this._record;
    },
    args: function () {
        return this._params;
    },
    column: function (name) {
        return this._record.toColumn(name);
    },
    // 基础方法
    name: function () {
        return this._identifier;
    },
    set: function (field, value) {
        if (this.contain(field)) {
            this._record.set(field, value)
        }
    },
    // 填充数据方法
    connect: function (request, update) {
        if (request) {
            // 自动注入updateBy和createBy
            request.by(update);
            var reference = this
            request.keys().each(function (key) {
                var data = request.get(key);
                if (data) {
                    reference.set(key, data);
                }
            })
        }
    },
    intake: function (data) {
        if (data) {
            var reference = this
            data.each(function (value, field) {
                if (value) {
                    reference.set(field, value);
                }
            })
        }
    },
    inquiry: function (query, orders) {
        if (query) {
            query.init(this);
        }
        var expr = query.expr();
        if (expr) {
            this._env.setExpr(expr);
        }
        if (orders) {
            var OrderBy = Java.type('com.vie.orb.impl.OrderBy');
            this._env.setOrder(OrderBy.create(orders.toJson()));
        }
    },
    // 辅助方法
    contain: function (field) {
        if (this._record.fields().keySet().contains(field)) {
            return true;
        } else {
            return false;
        }
    }
}

function Response(isObject) {
    var raw = ($response) ? $response : {};
    this._value = raw;

    this._hooker = ($hooker) ? $hooker : {};
    if (isObject) {
        this._isObject = isObject;
    } else {
        if (raw.list) {
            this._isObject = false;
        } else {
            this._isObject = true;
        }
    }
}

Response.prototype = {
    _: function () {
        if (this._isObject) {
            return this._value;
        } else {
            return this._value.list;
        }
    },
    id: function () {
        if (this._isObject) {
            return this._value.id()
        }
    },
    swapCount: function (count, remove) {
        // 默认值
        if (!count) count = 0;
        if (this._hooker) {
            this._hooker.put('count', count);
            if (remove) {
                this._hooker.remove('list');
            }
        }
    },
    swapList: function (dataArr, isCount) {
        // 默认值
        if (!Array.is(dataArr)) dataArr = []
        if (this._hooker) {
            var jArr = dataArr.toJson();
            this._hooker.put('list', jArr);
            if (!isCount) {
                this._hooker.put('count', dataArr.length);
            }
        }
    },
    swapObject: function (replaced) {
        if (this._hooker) {
            if (!replaced) replaced = {};
            this._hooker.remove('count');
            this._hooker.remove('list');
            this._hooker.mergeIn(replaced.toJson());
        }
    },
    buildObject: function (request, merged) {
        var result = {}
        if (this._isObject) {
            if (request) {
                // 从请求中提取数据信息，主要提取ref部分，其他内容不需要提取
                var refData = request._().get('ref');
                refData.each(function (_, key) {
                    var value = request.get(key);
                    if (value) {
                        result.set(key, value);
                    }
                });
                result.set('ref', refData);
            }
            // 提取基础响应数据
            var respData = this._value;
            result.from(respData);
            // 遍历merged中的所有数据
            if (merged) {
                merged.each(function (item, key) {
                    // 数组直接挂子节点
                    if (Array.is(item)) {
                        result.set(key, item);
                    } else {
                        // 对象则使用合并的方式操作
                        if (Object.prototype.isPrototypeOf(item)) {
                            result.from(item);
                        }
                    }
                });
            }
        }
        return result;
    }
}
