Dao = (function () {
    var __dao = Java.type('com.vie.que.impl.js.JSDao');
    var __prepare = function (data, updated) {
        // 设置记录默认的active
        if(!data.hasOwnProperty("active")){
            data.on();
        }
        // 设置记录默认的sigma
        if(!data.hasOwnProperty("sigma")){
            data.ma();
        }
        // 设置Auditor信息
        data.by(updated);
    }
    _remove = function (id, filter) {
        return {}.fromJson(__dao.remove(id, filter.toJson()));
    };
    _batchRemove = function (id, filter) {
        return [].fromJson(__dao.batchRemove(id, filter.toJson()));
    };
    _insert = function (id, data) {
        __prepare(data);
        return {}.fromJson(__dao.insert(id, data.toJson()));
    };
    _batchInsert = function (id, dataArr) {
        dataArr.forEach(function (item) {
            __prepare(item)
        });
        return [].fromJson(__dao.batchInsert(id, dataArr.toJson()));
    };
    _update = function (id, data) {
        __prepare(data, true);
        return {}.fromJson(__dao.update(id, data.toJson()));
    };
    _batchUpdate = function (id, dataArr) {
        dataArr.forEach(function (item) {
            __prepare(item, true);
        });
        return [].fromJson(__dao.batchUpdate(id, dataArr.toJson()));
    };
    _modify = function (id, filter, data) {
        __prepare(data, true);
        return {}.fromJson(__dao.update(id, filter.toJson(), data.toJson()));
    };
    _queryOne = function (id, filter) {
        return {}.fromJson(__dao.queryOne(id, filter.toJson()));
    };
    _queryList = function (id, filter) {
        return [].fromJson(__dao.queryList(id, filter.toJson()));
    };
    _criteria = function (id, criteria) {
        return [].fromJson(__dao.queryByCriteria(id, criteria.toJson()));
    };
    _queryBetween = function (id, filter, ranger) {
        return [].fromJson(__dao.queryList(id, filter.toJson(), ranger.toJson()));
    };
    _queryMulti = function (id, field, values) {
        return [].fromJson(__dao.queryList(id, field, values.toJson()));
    };
    _count = function (id, filter) {
        return __dao.count(id, filter.toJson());
    };
    _serial = function (code) {
        var sigma = $data['sigma'] ? $data['sigma'] : null;
        if (sigma) {
            return __dao.number(code, sigma);
        } else {
            Log.warn('[RTE] The parameter "sigma" has not been provided, serial generation failure.');
        }
    };
    _order = function (record, order) {
        return __dao.order(record, order);
    };
    return {};
})();

(function () {
    Dao = Dao.prototype = {
        Remove: _remove,
        Insert: _insert,
        Update: _update,
        BatchRemove: _batchRemove,
        BatchInsert: _batchInsert,
        BatchUpdate: _batchUpdate,
        Modify: _modify,
        Unique: _queryOne,
        Query: _queryList,
        Between: _queryBetween,
        Collect: _queryMulti,
        Count: _count,
        Serial: _serial,
        Order: _order,
        Criteria: _criteria
    }
})();
