/*
 * 引用短名
 */ 
// util/Expression.js
// -----------------------------------------------
Cond = system.query.Cond;
MatchMode = system.query.MatchMode;
// util/Type.js, Value.js
// -----------------------------------------------
Type = system.type;
Value = system.value;
Dao = system.dao;
Js = system.js;
Shared = system.shared;
Log = system.log;
// ------------------ 从Java中读取绑定 -------------
$ID = system['ID'];
Tool = {
    Random:Java.type('com.vie.util.RandomKit')
};
// ------------------ 动态加载专用方法 -------------
Import = Js.Import(Js.Lib.OOB);
Tp = Js.Import(Js.Lib.TP);
// 扩展库加载
Ext = Js.ExtLoader;
// ----------------- 调试专用方法 -----------------
debug = function(data){
    if(data.encode){
        print(JSON.stringify(Value.Js(data)));
    }else{
        print(JSON.stringify(data));
    }
}
//----------------- 特殊全局函数 -----------------
operator = function(){
    if($data['$$USER$$']){
        return $data['$$USER$$']
    }
}
outcome = function(data){
    if(data){
        return data['$$RET$$'];
    }else{
        return false;
    }
}
id = function(key){
    if($data['id']){
        return $data['id'][key]
    }
}
