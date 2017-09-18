Shared = (function() {
    /* 连接Java类 * */
    _put = function(key, value) {
        /* --> 转换成JsonObject,JsonArray * */
        if (null != value) {
            if (value.encode) {
                $shared.put(key, value);
            } else if ('object' == typeof (value)) {
                $shared.put(key, value.toJson());
            } else {
                $shared.put(key, value);
            }
        }
    };
    _get = function(key) {
        /* --> 读取JsonObject,JsonArray * */
        var shared = {}.fromJson($shared); // Value.Js($shared);
        var value = null;
        if (shared[key]) {
            value = shared[key];
        }
        return value;
    };
    return {};
})();

(function() {
    Shared = Shared.prototype = {
        Put : _put,
        Get : _get
    }
})();

Mirror.singleton("Shared",[
    "Get","Put"
])
