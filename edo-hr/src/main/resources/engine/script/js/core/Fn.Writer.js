/*
 * 插入专用
 * @param data
 * @returns
 */
function __DataWriter(data, inputReq){
    // From: $data
    var request = (inputReq) ? inputReq : new Request();
    // From: data
    request.intake(data);

    var record = new Record();
    // To: Record
    record.connect(request,true);
}
