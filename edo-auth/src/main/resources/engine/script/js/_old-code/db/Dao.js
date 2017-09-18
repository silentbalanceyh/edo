// Package: util
// File: Dao.js
// Version: 1.0
(function() {
    // ------------------------Class Definition---------------------
    system['dao'] = (function() {
        /* 连接Java变量 * */
        var JsonObject = Java.type('io.vertx.core.json.JsonObject');
        var JsonArray = Java.type('io.vertx.core.json.JsonArray');
        var __dao = Java.type('com.vie.que.impl.js.JSDao');
        __jobject = function(data){
            var value = JSON.stringify(data);
            return new JsonObject(value);
        };
        __jarray = function(data){
            var value = JSON.stringify(data);
            return new JsonArray(value);
        };
        var __js = function(data){
            var jsonStr = data.encode();
            return JSON.parse(jsonStr);
        };
        var __uid = function(data,insert){
            if(data){
                var userId = operator()
                if(userId){
                    if(insert){
                        data['createBy'] = userId
                    }else{
                        data['updateBy'] = userId
                    }
                }
            }
            /* 返回 **/
            return data
        }
        var __uids = function(array,insert){
            if(Array.prototype.isPrototypeOf(array) && 0 < array.length){
                for(var idx = 0; idx < array.length; idx++ ){
                    __uid(array[idx],insert)
                }
            }
            /* 返回 **/
            return array;
        }
        /* 删除 * */
        _remove = function(id, filter) {
            return __js(__dao.remove(id, __jobject(filter)));
        };
        /* 批量删除 **/
        _batchRemove = function(id, filter){
            return __js(__dao.batchRemove(id, __jobject(filter)));
        };
        /* 插入 **/
        _insert = function(id, data){
            return __js(__dao.insert(id, __jobject(__uid(data,true))));
        };
        /* 批量插入 **/
        _batchInsert = function(id, dataArr){
            return __js(__dao.batchInsert(id, __jarray(__uids(dataArr,true))));
        };
        /* 更新 **/
        _update = function(id, data){
            return __js(__dao.update(id, __jobject(__uid(data))));
        };
        /* 批量更新 **/
        _batchUpdate = function(id, dataArr){
            return __js(__dao.batchUpdate(id, __jarray(__uids(dataArr))));
        };
        /* 条件更新 **/
        _modify = function(id, filter, data){
            return __js(__dao.update(id, __jobject(filter), __jobject(__uid(data))));
        };
        /* 单条记录查询 **/
        _queryOne = function(id, filter){
            return __js(__dao.queryOne(id,__jobject(filter)));
        };
        /* 整体记录查询 **/
        _queryList = function(id, filter){
            return __js(__dao.queryList(id,__jobject(filter)));
        };
        _criteria = function(id, criteria){
            return __js(__dao.queryByCriteria(id,__jobject(criteria)));
        };
        /* 范围查询 **/
        _queryBetween = function(id, filter, ranger){
            return __js(__dao.queryList(id,__jobject(filter),__jobject(ranger)));
        }
        /* 整体记录查询，单字段多值 **/
        _queryMulti = function(id, field, values){
            return __js(__dao.queryList(id, field, __jarray(values)));
        };
        _count = function(id, data){
            return __dao.count(id, __jobject(data));
        };
        _serial = function(code){
            var sigma = $data['sigma']?$data['sigma']:null;
            return __dao.number(code, sigma);
        };
        _order = function(record,order){
            return __dao.order(record,order);
        };
        return function() {
            return {};
        };
    })();
    // ------------------------Interface----------------------------
    (function() {
        system['dao'] = system['dao'].prototype = {
            Remove : _remove,
            Insert : _insert,
            Update : _update,
            BatchRemove: _batchRemove,
            BatchInsert: _batchInsert,
            BatchUpdate: _batchUpdate,
            Modify : _modify,
            Unique: _queryOne,
            Query: _queryList,
            Between: _queryBetween,
            Collect: _queryMulti,
            Count: _count,
            Serial: _serial,
            Order: _order,
            Criteria:_criteria
        }
    })();
})();
