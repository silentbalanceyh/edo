// ------------------------JSFunction----------------------------
Import(['Member'])

$$Member = (function(){
    var _configMember = function(data){
        var config = {};
        config.set('sigma',data.get('sigma'));
        config.set('mobile',data.get('mobile'));
        config.serie('Member');
        config.liste({
            level:"member.type=Registered",
            status:"member.status=New"
        });
        return config;
    };
    _fnCreate = function(data){
        if(!data['mobile']){
            Log.warn("[HTL] Required parameter 'mobile' missing when creating member.");
        }
        var config = _configMember(data);
        // data <-- config
        var member = Member.create(data.from(config));
        if('EXISTING' == member.out()){
            member = Dao.Unique('htl.member',{
                "memberId": member.id(),
                "hotelId": data.get('hotelId')
            })
        }else{
            var _new = {};
            _new.set('memberId',member.id());
            // _new <-- data
            member = Dao.Insert('htl.member',_new.from(data));
        }
        return member.id();
    };
    _fnAccount = function(item, mobile){
        var filters = {
            mobile:mobile,
            hotelId:item.get('hotelId')
        };
        var member = Dao.Unique('v.htl.member',filters);
        if(!member.id()){
            var data = {};
            data.set('username',mobile);
            data.set('mobile',mobile);
            data.set('realname',data.get('preservor'));
            data.off();
            var config = _configMember(data);
            member = Member.create(data.from(config));
            // Htl Member会员创建
            var params = {
                memberId:member.id(),
                hotelId:item.get('hotelId')
            };
            member = Dao.Insert('htl.member',params);
        }
        return member.id();
    };
    return {};
})();
(function(){
    $$Member = $$Member.prototype = {
        fnCreate:_fnCreate,
        fnAccount:_fnAccount
    }
})();
