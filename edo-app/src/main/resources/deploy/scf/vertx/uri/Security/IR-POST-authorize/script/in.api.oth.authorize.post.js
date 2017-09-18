Import('FnWriter');
var code = String.random(32);
Log.info(' [API] -----------> /api/oth/authorize | code = ' + code);

var data = {
    "code":code,
    "authenticate":code
}
__DataWriter(data);
