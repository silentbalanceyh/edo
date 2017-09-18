Tp('moment')
moment.lang('zh-cn')
_FMT_TIME = "YYYY-MM-DD HH:mm:ss";
_FMT_DAY = "YYYY-MM-DD";
// Java用
_FMT_JTIME = "YYYY-MM-dd HH:mm:ss";
_FMT_JDAY = "YYYY-MM-dd";
function Period(literal, pattern) {
    if (!pattern)
        pattern = _FMT_TIME;
    this._pattern = pattern;
    // 没传入literal
    if (!literal)
        literal = new moment().format(this._pattern);
    if (moment.isMoment(literal)) {
        // literal是Moment
        this._value = literal;
        this._literal = this._value.format(this._pattern);
    } else if (literal._ && moment.isMoment(literal._())) {
        // literal是Period
        this._value = literal._();
        this._literal = this._value.format(this._pattern);
    } else {
        // literal是字符串
        this._literal = literal;
        this._value = new moment(literal, this._pattern);
    }
    Mirror.attribute(this, [ '_literal', '_value', '_pattern' ]);
}

Period.day = function(literal) {
    return new Period(literal, _FMT_DAY);
}

Period.time = function(literal) {
    return new Period(literal, _FMT_TIME);
}

Period.jtime = function(literal){
    var convertor = Java.type('com.vie.util.Period')
    return convertor.convertTime(literal, _FMT_JTIME);
}
Period.jday = function(literal){
    var convertor = Java.type('com.vie.util.Period')
    return convertor.convertTime(literal, _FMT_JDAY);
}
Period.now = function(){
    var convertor = Java.type('com.vie.util.Period');
    return new Period(convertor.now(_FMT_JTIME));
}
Period.everyDay = function(start, end, fnExecute){
    if(!fnExecute){
        Log.warn('[RTE] - fnExecute: The callback function "fnExecute" is undefined, please verify.');
    }
    // 转换start和end
    if(!moment.isMoment(start)) start = moment(start, _FMT_DAY);
    if(!moment.isMoment(end)) end = moment(end, _FMT_DAY);
    // 遍历每一天
    for(var current = start; current.isBefore(end,'day'); current.add(1,'day')){
        var item = moment(current.format(_FMT_TIME),_FMT_DAY);
        // 最终函数传入Period对象
        fnExecute(new Period(item));
    }
}
function _ensure(value) {
    if (!moment.isMoment(value)) {
        Log.warn('[RTE] - value:  The "_value" type must be Moment in Period class.');
    }
}
Period.prototype = {
    _ : function() {
        _ensure(this._value);
        return this._value;
    },
    toDay: function(){
        _ensure(this._value);
        return this._value.format(_FMT_DAY);
    },
    toTime: function(){
        _ensure(this._value);
        return this._value.format(_FMT_TIME);
    },
    toIso: function(){
        _ensure(this._value);
        return this._value.toISOString();
    },
    format : function(pattern) {
        _ensure(this._value);
        if (!pattern)
            pattern = this._pattern;
        return this._value.format(pattern);
    },
    first : function() {
        _ensure(this._value);
        var start = new moment(this._value.startOf('month'), this._pattern);
        return new Period(start, this._pattern);
    },
    end : function() {
        _ensure(this._value);
        var end = new moment(this._value.endOf('month'), this._pattern);
        return new Period(end, this._pattern);
    },
    addDay : function(days) {
        _ensure(this._value);
        this._value.add(days, 'days');
        this._literal = this._value.format(this._pattern);
    }
}
