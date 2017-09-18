Import(['Dao', 'FnWriter'])

var request = new Request();
/* 1.删除原始授权码，测试通过 **/
var code = request.get('code');
var authenticate = code;
var filters = {
    code: code,
    authenticate: authenticate
};
Dao.Remove('oth.auth.code', filters);

/* 2.生成Token和RefreshToken **/
var token = String.random(64);
var refreshToken = String.random(64);
/* 2.2.默认过期是8小时 **/
var time = (new Date()).getTime() + 3600 * 8 * 1000;

/* 3.读取当前OAuth用户信息 **/
var userData = Dao.Unique('oth.user', {
    clientId: request.get('client_id')
});
var userSecret = userData['clientSecret'];
token = String.hmac256(token, userSecret);
refreshToken = String.hmac256(refreshToken, userSecret);

/* 4.插入RefreshToken **/
var refreshData = {
    authenticate: authenticate,
    token: refreshToken
};
Dao.Insert('oth.refresh.token', refreshData);

/* 5.设置当前Token信息 **/
__DataWriter({
    "authenticate": authenticate,
    "token": token,
    "refreshToken": refreshToken,
    "expiredTime": time
});
