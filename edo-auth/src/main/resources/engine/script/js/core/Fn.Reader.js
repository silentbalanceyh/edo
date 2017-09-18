Import('Fabric');

function __QueryEngine(data,orders) {
    var record = new Record();
    
    var query = new Query(data, true);
    
    record.inquiry(query, orders);
}
