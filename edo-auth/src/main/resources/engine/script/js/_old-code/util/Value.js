/*
 * 字符串工具类
 */
(function() {
    // ------------------------Class Definition---------------------
    system['value'] = (function() {
        /* 连接Java类 **/
        var OrderBy = Java.type('com.vie.orb.impl.OrderBy');
        var JsonArray = Java.type('io.vertx.core.json.JsonArray');
        var JsonObject = Java.type('io.vertx.core.json.JsonObject');
        var Convertor = Java.type('com.vie.util.DateTimeKit');
        _orders = function(data){
            var value = JSON.stringify(data);
            var array = new JsonArray(value);
            return OrderBy.create(array);
        };
        _get = function(value) {
            return (undefined == value || null == value) ? '' : value;
        };
        _updated = function(value) {
            return (undefined == value || null == value) ? '$NU$' : value;
        };
        _deleted = function(){
            var response = $response;
            if(response['RESULT']){
                return $response["DELETED"];
            }else{
                return null;
            }
        };
        _json = function(data){
            var value = "";
            if(Array.prototype.isPrototypeOf(data)){
                value = new JsonArray(JSON.stringify(data));
            }else{
                value = new JsonObject(JSON.stringify(data));
            }
            return value;
        };
        _js = function(data){
            var result = {};
            if(data){
                result = JSON.parse(data.encode());
            }
            return result;
        };
        _boolean = function(data, keys){
            if(keys){
                for(var i = 0; i < keys.length; i++ ){
                    var attr = keys[i];
                    var value = data[attr];
                    if("on" != value && value){
                        data[attr] = true;
                    }else{
                        data[attr] = false;
                    }
                }
            }
        };
        _datetime = function(iso, pattern){
            if(!pattern){
                // Java专用格式化
                pattern = "YYYY-MM-dd HH:mm:ss"
            }
            return Convertor.convertTime(iso, pattern)
        }
        return function() {
            return {};
        };
    })();
    // ------------------------Interface----------------------------
    (function() {
        system['value'] = system['value'].prototype = {
            Get : _get,
            Updated : _updated,
            OrderBy:_orders,
            Deleted : _deleted,
            Json : _json,
            Js:_js,
            DateTime:_datetime,
            Boolean:_boolean
        }
    })();
})();
