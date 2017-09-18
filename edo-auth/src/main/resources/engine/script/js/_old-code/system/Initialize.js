/*
 * 全局变量，构造分支树
 */
// --------------Root分支树，以及子分支------------------
var system = {};
// ---------------------短名-----------------------------
system['ID'] = Java.type('com.vie.fixed.Constants').PID;
system['log'] = Java.type('com.vie.que.impl.js.JSLog');
// ~ Language设置 ============================================
//--------------Out Of Box------------------
_OOBLIB = "classpath:engine/script/js/oob/";
_TPLIB = "classpath:engine/script/js/tp/";
_EXTLIB = "classpath:engine/script/js/ext/";
_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
_DAY_FORMAT = "YYYY-MM-DD";
//--------------Java Pattern----------------
//~ Prototype处理 ============================================
