var $_location = (function() {
    // ------------------------Class Definition---------------------
    /* 读取Tabular专用对象 **/
    _fullName = function($data){
        var fullName = $data["country"] + $data["state"] + $data["city"] + $data["distinct"];
        if($data["street1"]){
            fullName = fullName + $data["street1"];
        }
        if($data["street2"]){
            fullName = fullName + $data["street2"];
        }
        if($data["street2"]){
            fullName = fullName + $data["street2"];
        }
        if($data["address"]){
            fullName = fullName + $data["address"];
        }
        $data["fullName"] = fullName;
    };
    return function() {
        return {};
    };
})();
// ------------------------Interface----------------------------
(function() {
    $_location = $_location.prototype = {
        fnCalcFullname:_fullName
    }
})();
