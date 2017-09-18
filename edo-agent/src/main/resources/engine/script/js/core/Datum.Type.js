Type = (function(){
    var __value = Java.type('com.vie.que.impl.js.JSValue');
    _string = function(value) {
        return __value.toString(value);
    };
    _xml = function(value) {
        return __value.toXml(value);
    };
    _json = function(value) {
        return __value.toJson(value);
    };
    _script = function(value) {
        return __value.toScript(value);
    };
    _logical = function(value) {
        return __value.toLogical(value);
    };
    _number = function(value) {
        return __value.toNumber(value);
    };
    _integer = function(value) {
        return __value.toInteger(value);
    };
    _binary = function(value) {
        return __value.toBinary(value);
    };
    _date = function(value) {
        return __value.toDate(value);
    };
    _decimal = function(value) {
        return __value.toDecimal(value);
    };
    _acquire = function(record,field,value){
        return __value.getValue(record,field,value);
    };
    return {};
})();

(function(){
    Type = Type.prototype = {
        String : _string,
        Json : _json,
        Xml : _xml,
        Script : _script,
        Boolean : _logical,
        Long : _number,
        Integer : _integer,
        Binary : _binary,
        Date : _date,
        Decimal : _decimal,
        Acquire : _acquire
    }
})();
