// ~更加简化的写入引擎 =======================================
function __DataWriter(dataMap){
    // 1.Record信息
    var record = $env.getRecord();
    // 2.遍历请求，遍历之前删除参数中的uniqueId
    delete $data[$ID];
    delete dataMap[$ID];
    for(var key in $data){
        if(record.fields().keySet().contains(key)){
            record.set(key,$data[key]);
        }
    }
    // 3.设置值
    for(var field in dataMap){
        record.set(field,dataMap[field]);
    }
}

function __DataUpdater(filters,dataMap){
    // 1.Record信息
    var record = $env.getRecord();
    // 2.Record读取
    var queried = Dao.Unique(record.identifier(),filters);
    // 3.遍历$data赋值
    for(var key in $data){
        if(record.fields().keySet().contains(key)){
            queried[key] = $data[key];
        }
    }
    // 4.dataMap赋值
    for(var field in dataMap){
        queried[field] = dataMap[field];
    }
    // 5.设置值
    for(var field in queried){
        record.set(field,queried[field]);
    }
}
