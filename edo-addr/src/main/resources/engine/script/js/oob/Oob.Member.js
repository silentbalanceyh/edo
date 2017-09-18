Member = (function() {
    // ------------------------Class Definition---------------------
    /* 连接Java类 **/
    var _hickor = Java.type('com.vieo.member.MemberHickor').instance();
    /* OOB创建会员信息 **/
    _create = function(data){
        if(!data){
            Log.warn("OOB, member data could not be empty or undefined.");
            return;
        }
        if(!data['mobile']){
            Log.warn("OOB, the 'mobile' of member created data must exist.");
        }
        var literal = data.toJson();
        var result = _hickor.create(literal);
        return {}.fromJson(result);
    };
    return function() {
        return {};
    };
})();
// ------------------------Interface----------------------------
(function() {
    Member = Member.prototype = {
        create:_create
    }
})();
