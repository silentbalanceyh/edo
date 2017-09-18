function __BuildAndor(record,dataMap,params){
    /* 构造查询条件 **/
    var expr = null;
    for ( var name in dataMap) {
        var column = record.toColumn(name);
        var rightExpr = Cond.EQ(column);
        /* 1.第一次构建条件 * */
        if (null == expr) {
            expr = rightExpr;
        } else {
            expr = Cond.AND(expr, rightExpr);
        }
        /* 2.添加值 * */
        params.add(Type.Acquire(record,name,dataMap[name]));
    }
    return expr;
}

function __BuildRange(column, op){
    var expr = null;
    switch(op){
    case "LT": expr = Cond.LT(column);break;
    case "GT": expr = Cond.GT(column);break;
    case "LE": expr = Cond.LE(column);break;
    case "GE": expr = Cond.GE(column);break;
    }
    return expr;
}
function __BuildBetween(record, rangeMap, params){
    var expr = null;
    for(var name in rangeMap){
        var column = record.toColumn(name)
        var item = rangeMap[name]
        if(item){
            var fromIt = item.from
            var toIt = item.to
            var fromExpr = __BuildRange(column,fromIt)
            var toExpr = __BuildRange(column,toIt)
            if(null != fromExpr && null != toExpr){
                var rangeExpr = Cond.AND(fromExpr,toExpr);
                if(null == expr){
                    expr = rangeExpr;
                }else{
                    expr = Cond.AND(expr,rangeExpr);
                }
                /* 添加两次 **/
                params.add(Type.Acquire(record,name,item.fromValue));
                params.add(Type.Acquire(record,name,item.toValue));
            }
        }
    }
    return expr;
}
// ~ 更加简化的查询引擎 ============================================
function __QueryEngine(dataMap,orders) {
    /* 读取基础数据 **/
    var record = $env.getRecord();
    var params = $env.getValues();
    /* 清空Values中的参数防止越界 **/
    params.clear();
    /* 查询条件生成 * */
    var expr = __BuildAndor(record,dataMap,params);
    /* 设置查询条件 * */
    if (null != expr) {
        $env.setExpr(expr);
    }
    /* 设置排序规则 **/
    {
        if(orders){
            $env.setOrder(Value.OrderBy(orders));
        }
    }
}
// ~ 添加查询引擎用于查询某个区间内的数据 =============================
function __QueryDuration(dataMap,rangeMap,orders){
    /* 读取基础数据 **/
    var record = $env.getRecord();
    var params = $env.getValues();
    /* 清空Values中的参数防止越界 **/
    params.clear();
    /* 构造And的查询条件 * */
    var expr = __BuildAndor(record,dataMap,params);
    /* 设置查询条件 **/
    if(null == expr){
        /* 不带附加条件，只处理范围 **/
        expr = __BuildBetween(record,rangeMap,params);
    }else{
        /* 带附加条件，处理范围的同时引入附加条件 **/
        var rangeExpr = __BuildBetween(record, rangeMap, params);
        expr = Cond.AND(expr,rangeExpr);
    }
    /* 设置查询条件 * */
    if (null != expr) {
        $env.setExpr(expr);
    }
    /* 设置排序规则 **/
    {
        if(orders){
            $env.setOrder(Value.OrderBy(orders));
        }
    }
}
