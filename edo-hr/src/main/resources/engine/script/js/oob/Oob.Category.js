var $_category = (function() {
    // ------------------------Class Definition---------------------
    /* 连接Java类 **/
    var _hickor = Java.type('com.vieo.enu.HCatHickor').create();
    /* 读取Tabular专用对象 **/
    _unique = function(type,code){
        var data
        if($data['sigma']){
            data = _hickor.getHCat(type,code, $data['sigma']);
        }else{
            data = _hickor.getHCat(type,code, null);
        }
        return Value.Js(data);
    };
    return function() {
        return {};
    };
})();
// ------------------------Interface----------------------------
(function() {
    $_category = $_category.prototype = {
        fnUnique:_unique
    }
})();
