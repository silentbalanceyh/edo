/*
 * OOB中的Loader库，用于加载OOB，TP以及EXT三种不同的库专用
 */
Ext = null;
Tp = null;
Import = null;
(function () {
    var Loader = (function () {
        // Reference
        var Log = Java.type('com.vie.que.impl.js.JSLog');
        // Lib Pathes
        var _OOBLIB = "classpath:engine/script/js/";
        var _TPLIB = "classpath:engine/script/js/tp/";
        var _EXTLIB = "classpath:engine/script-ext/js/";
        var LIB = {
            OOB: {
                // Business -> OOB专用库
                "Tabular": "oob/Oob.Tabular.js",
                "Category": "oob/Oob.Category.js",
                "Order": "oob/Oob.Order.js",
                "Member": "oob/Oob.Member.js",
                "Location": "oob/Oob.Location.js",
                // Datum
                "Type": "core/Datum.Type.js",
                "Period": "core/Datum.Period.js",
                "Dao": "core/Datum.Dao.js",
                // Query
                "Cond": "core/Query.Cond.js",
                "MatchMode": "core/Query.MatchMode.js",
                "Fabric": "core/Query.Fabric.js",
                "Formula": "core/Query.Formula.js",
                "QTree": "core/Query.QTree.js",
                // Function -> 函数库
                "FnWriter": "core/Fn.Writer.js",
                "FnUpdater": "core/Fn.Updater.js",
                "FnReader": "core/Fn.Reader.js"
            },
            TP: {
                "moment": "moment.min.js"
            }
        };
        var THREAD_MAP = {};
        var _load = function (folder, pathes) {
            if (!folder) {
                Log.warn("[RTE] Parameter 'folder' of load method has not been provided.")
            }
            if (pathes) {
                var fnLoad = function (path) {
                    if (!THREAD_MAP[path]) {
                        Log.info("Dynamic initializing script File -> " + path);
                        load(path);
                        // 防止重复加载
                        THREAD_MAP[path] = true;
                    }
                }
                if (Array.is(pathes)) {
                    pathes.each(function (key) {
                        fnLoad(folder + key);
                    });
                } else {
                    fnLoad(folder + pathes);
                }
            }
        };
        _ext = function (pathes) {
            _load(_EXTLIB, pathes);
        };
        _import = function (pathes) {
            pathes = Array.as(pathes)
            var oobs = LIB.OOB.values(pathes);
            _load(_OOBLIB, oobs)
        };
        _tp = function (pathes) {
            pathes = Array.as(pathes)
            var tps = LIB.TP.values(pathes);
            _load(_TPLIB, tps)
        };
        return {}
    })();
    (function () {
        Loader = Loader.prototype = {
            Ext: _ext,
            Import: _import,
            Tp: _tp,
        }
    })();
    // 缩短名，和原始库统一的操作
    Ext = Loader.Ext
    Import = Loader.Import
    Tp = Loader.Tp
})();
