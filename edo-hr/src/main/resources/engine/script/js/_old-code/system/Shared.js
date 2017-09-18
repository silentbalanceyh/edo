/*
 * JavaScript原生工具类
 */
(function() {
    // ------------------------Class Definition---------------------
    system['shared'] = (function() {
        /* 连接Java类 **/
        _put = function(key, value){
            /* --> 转换成JsonObject,JsonArray **/
            if(null != value){
                if(value.encode){
                    $shared.put(key, value);
                }else if('object' == typeof(value)){
                    $shared.put(key, Value.Json(value));
                }else{
                    $shared.put(key, value);
                }
            }
        };
        _get = function(key){
            /* --> 读取JsonObject,JsonArray **/
            var shared = Value.Js($shared);
            var value = null;
            if(shared[key]){
                value = shared[key];
            }
            return value;
        };
        return function() {
            return {};
        };
    })();
    // ------------------------Interface----------------------------
    (function() {
        system['shared'] = system['shared'].prototype = {
            Put:_put,
            Get:_get
        }
    })();
})();
