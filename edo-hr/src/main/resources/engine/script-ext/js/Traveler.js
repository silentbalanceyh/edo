Import(['Order', 'Dao', 'Period', 'Tabular'])

$$Traveler = (function () {
    // 宾客记录处理
    var travelerStatus = Tabular.unique('traveler.status', 'OnGoing');
    var inoccupStatus = Tabular.unique('inoccup.status', 'Registered');

    _fnSave = function (item, hotelId) {
        if (!item) {
            Log.warn("[HTL] Traveler item data shouldn't be invalid. item = " + item);
        }
        /* 1.新宾客还是旧宾客 **/
        var traveler = {};
        if (item.hasOwnProperty('tserial')) {
            // 旧宾客
            var data = Dao.Unique('htl.traveler', {
                hotelId: hotelId,
                serial: item.get('tserial')
            });
            // 入住次数增加
            if (data.get('status') != travelerStatus.id()) {
                data.plus('inoccups');
            }
            // 传入宾客信息拷贝到原始数据中
            data.from(item, [
                'address', 'birthday', 'country',
                'idcNumber', 'idcType', 'nativePlace', 'nickname',
                'realname', 'nation', 'mobile'
            ]);
            // 修改宾客状态
            data.set('status', travelerStatus.id());
            data.set('operator', String.user());
            traveler = Dao.Modify('htl.traveler', {
                uniqueId: data.id()
            }, data)
        } else {
            // 新宾客
            item.set('status', travelerStatus.id());
            item.plus('inoccups');
            item.set('serial', Dao.Serial('TravelerHistory'));
            item.set('hotelId', hotelId);
            item.set('operator', String.user());
            item.ma();
            traveler = Dao.Insert('htl.traveler', item);
        }
        return traveler;
    };
    _fnInoccup = function (item, hotelId, orderId) {
        var inoccup = {};
        // 特殊值处理
        inoccup.set('status', inoccupStatus.id());
        inoccup.set('hotelId', hotelId);
        inoccup.set('orderId', orderId);
        inoccup.set('serial', Dao.Serial('Inoccup'));
        inoccup.set('operator', String.user());
        inoccup.set('travelerId', item.id());
        inoccup.set('inoccupTime', Period.now().toTime());

        // item中的值拷贝
        inoccup.from(item.getSub([
            'type', 'request', 'secret', 'cardCounter',
            'roomNumber', 'preference', 'carPlate',
            'insideDays', 'insidePersons'
        ]));
        // 特殊方法调用
        inoccup.by();
        inoccup.ma();
        return Dao.Insert('htl.occup', inoccup);
    };
    return {};
})();
(function () {
    $$Traveler = $$Traveler.prototype = {
        fnSave: _fnSave,
        fnInoccup: _fnInoccup
    }
})();
