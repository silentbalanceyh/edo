Tabular = (function() {
    // ------------------------Class Definition---------------------
    /* 连接Java类 **/
    var _hickor = Java.type('com.vieo.enu.TabularHickor').create();
    /* 读取Tabular专用对象 **/
    _unique = function(type,code){
        var data
        if($data['sigma']){
            data = _hickor.getTabular(type,code, $data['sigma']);
        }else{
            Log.warn('OOB, no "sigma" input parameter to get tabular data.');
            data = _hickor.getTabular(type,code, null);
        }
        return {}.fromJson(data);
    };
    return {}
})();
// ------------------------Interface----------------------------
(function() {
    Tabular = Tabular.prototype = {
        unique:_unique
    }
})();
