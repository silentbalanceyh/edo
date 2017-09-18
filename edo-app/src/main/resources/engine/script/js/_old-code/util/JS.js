/*
 * JavaScript原生工具类
 */
(function() {
    // ------------------------Class Definition---------------------
    system['js'] = (function() {
        var _OOBLIBRARY = {
            "tabular": _OOBLIB + "Tabular.js",
            "category":_OOBLIB + "Category.js",
            "order":_OOBLIB + "Order.js",
            "member":_OOBLIB + "Member.js",
            "location":_OOBLIB + "Location.js"
        };
        var _TPLIBRARY = {
            "moment":_TPLIB + "moment.min.js"
        };
        var _LOADER = function(folder, pathes){
            if(pathes){
                if(Array.prototype.isPrototypeOf(pathes)){
                    for(var idx = 0; idx < pathes.length; idx++){
                        var key = pathes[idx];
                        if(folder){
                            load(folder + key);
                        }else{
                            load(pathes)
                        }
                    }
                }else{
                    if(folder){
                        load(folder + pathes);
                    }else{
                        load(pathes);
                    }
                }
            }
        };
        /* 执行字段转换 **/
        _mapping = function(data, from, to){
            if(data[from]){
                data[to] = data[from]
                delete data[from]
            }
        };
        _setData = function(data, key){
            if($data[key]){
                data[key] = $data[key]
            }
        };
        _fillData = function(data, source, keys){
            if(keys && Array.prototype.isPrototypeOf(keys)){
                for(var idx = 0; idx < keys.length; idx++ ){
                    var key = keys[idx];
                    data[key] = source[key];
                }
            }
        };
        _checkData = function(data, keys){
            if(keys && Array.prototype.isPrototypeOf(keys)){
                for(var idx = 0; idx < keys.length; idx++ ){
                    var key = keys[idx];
                    if($data[key]){
                        if("on" != $data[key]){
                            data[key] = $data[key];
                        }else{
                            data[key] = false;
                        }
                    }
                }
            }
        };
        /* 连接Java类 **/
        _copy = function(target,source, keys){
            if(keys && Array.prototype.isPrototypeOf(keys)){
                for(var idx = 0; idx < keys.length; idx++ ){
                    var key = keys[idx]
                    target[key] = source[key];
                }
            }else{
                for(var key in source){
                    target[key] = source[key];
                }
            }
            return target;
        };
        _append = function(target,source){
            for(var idx = 0; idx < target.length; idx++ ){
                target[idx] = _copy(target[idx],source);
            }
            return target;
        };
        _filter = function(list, fnFilter){
            var target = []
            for(var idx = 0; idx < list.length; idx++ ){
                if(fnFilter(list[idx])){
                    target.push(list[idx]);
                }
            }
            return target;
        };
        _group = function(list, field, target){
            var grouped = {}
            for(var idx = 0; idx < list.length; idx++ ){
                /* 1.读取list中的项 **/
                var item = list[idx]
                /* 2.当前项存在 **/
                if(item[field]){
                    var value = item[field]
                    if(!grouped[value]){
                        grouped[value] = []
                    }
                    /* 3.是否执行item的push或某个字段的单独push **/
                    if(target && item[target]){
                        grouped[value].push(item[target])
                    }else{
                        grouped[value].push(item)
                    }
                }
            }
            return grouped
        };
        _horiz = function(list, field, target){
            if(field && target){
                var result = {}
                for(var idx = 0; idx < list.length; idx++ ){
                    var item = list[idx]
                    if(item[field] && item[target]){
                        result[item[field]] = item[target]
                    }
                }
                return result
            }else{
                return list;
            }
        }
        _map = function(list, field){
            var inoccups = []
            var existing = {}
            for(var idx = 0; idx < list.length; idx++ ){
                var entity = list[idx]
                if(entity[field]){
                    if(!existing[entity[field]]){
                        inoccups.push(entity[field]);
                        existing[entity[field]] = true;
                    }
                }
            }
            return inoccups;
        };
        _findArray = function(list, field, value){
            var founds = [];
            for(var idx = 0; idx < list.length; idx++ ){
                var entity = list[idx];
                if(entity[field] == value){
                    founds.push(entity);
                }
            }
            return founds;
        };
        _find = function(list, field, value){
            var found = false;
            for(var idx = 0; idx < list.length; idx++ ){
                var entity = list[idx];
                if(entity[field] == value){
                    found = entity;
                    break;
                }
            }
            return found;
        };
        _ext = function(pathes){
            _LOADER(_EXTLIB,pathes);
        };
        _keys = function(object){
            var keys = [];
            if(object){
                for(var key in object){
                    keys.push(key)
                }
            }
            return keys;
        }
        _context = function(data,callback){
            if(data && 1 == data.length && Array.prototype.isPrototypeOf(data)){
                callback(data[0])
            }
        };
        _import = function(LIB){
            return function(pathes){
                var loader = function(key){
                    var path = LIB[key];
                    if(path){
                        load(path);
                    }
                }
                if(Array.prototype.isPrototypeOf(pathes)){
                    for(var idx = 0; idx < pathes.length; idx++){
                        var key = pathes[idx];
                        loader(key);
                    }
                }else{
                    loader(pathes);
                }
            }
        };
        _ooblib = function(){
            return _OOBLIBRARY;
        };
        _tplib = function(){
            return _TPLIBRARY;
        };
        return function() {
            return {};
        };
    })();
    // ------------------------Interface----------------------------
    (function() {
        system['js'] = system['js'].prototype = {
            Object:{
                Copy:_copy,
                Mapping:_mapping,
                SetData:_setData,
                FillData:_fillData,
                CheckData:_checkData,
                Keys:_keys
            },
            Array:{
                Append:_append,
                Find:_find,
                FindArray:_findArray,
                Group:_group,
                Map:_map,
                Filter:_filter,
                Horiz:_horiz
            },
            Import:_import,
            ExtLoader:_ext,
            Context:_context,
            Lib:{
                OOB:_ooblib(),
                TP:_tplib()
            }
        }
    })();
})();
