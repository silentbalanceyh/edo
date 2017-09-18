Import('Dao')
/*
 * 更新专用
 * @param filters
 * @param data
 * @returns
 */
function __DataUpdater(filters, data){
    // From: $data
    var request = new Request();
    // From: data
    request.intake(data);
    var record = new Record();
    
    var queried = Dao.Unique(record.name(), filters);
    // From: Queried
    record.intake(queried);
    // To: Record
    record.connect(request, false);
}
