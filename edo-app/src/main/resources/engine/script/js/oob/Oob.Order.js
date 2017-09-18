Order = (function() {
    // ------------------------Class Definition---------------------
    /* 连接Java类 **/
    var _hickor = Java.type('com.vieo.order.OrderHickor').instance();
    /* 读取Tabular专用对象 **/
    _create = function(data){
        var literal = data.toJson();
        var result = _hickor.createInd(literal);
        return {}.fromJson(result);
    };
    _createItems = function(data){
        var literal = data.toJson();
        var result = _hickor.createIndItem(literal);
        return [].fromJson(result);
    };
    _find = function(serial){
        var result = _hickor.findInd(serial);
        return {}.fromJson(result);
    };
    _update = function(data){
        var literal = data.toJson();
        var result = _hickor.updateInd(literal);
        return {}.fromJson(result);
    };
    return function() {
        return {};
    };
})();
// ------------------------Interface----------------------------
(function() {
    Order = Order.prototype = {
        create:_create,
        update:_update,
        createItems:_createItems,
        find:_find
    }
})();
