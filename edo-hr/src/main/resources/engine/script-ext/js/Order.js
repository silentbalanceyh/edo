Import(['Order', 'Dao', 'Period']);

$$Order = (function () {
    var _configOrder = function (data, total, status) {
        // 设置订单状态信息
        if (!status) status = "Ordered";
        var config = {};
        config.from(data, ['sigma', 'partnerId']);
        config.set('amountActual', total);
        config.set('now', ['orderTime']);
        // 其他信息
        config.hcat('order.type=Preordain');
        config.serie('Preordain');
        config.serie('PreordainCredence', 'credence');
        config.liste({
            orderStatus: "order.status=" + status
        }, "NAME");
        // 订单Autidor，Active
        config.by();
        config.on();
        // 设置创建者
        return config;
    };
    var _configOrderItems = function (item, data) {
        var quantity = item._x(["insideDays", "roomCounter"]);
        var amountPrice = item._i("unitPrice", true);
        var amountActual = amountPrice * quantity;
        var config = {};
        config.from(data, 'sigma');
        config.serie('PreordainItem');

        config.set('quantity', quantity);
        config.set('amountPrice', amountPrice);
        config.set('amountActual', amountActual);

        var discount = item._p('discount');
        config.set('discount', discount);
        config.by();
        config.on();

        return config;
    };
    _fnCreate = function (data, total) {
        var config = _configOrder(data, total, data.status);
        config.from(data, ['companyId', 'partnerId']);
        return Order.create(config);
    };
    _fnConnect = function (data) {
        var orderItems = data['orderItems'];
        if (!orderItems || 0 >= orderItems.length) {
            Log.warn("[HTL] The parameter 'orderItems' does not existing or empty, cased failure.");
            return;
        }
        var items = [];     // 订单项
        var codes = [];     // 使用过的房价码
        // 返回数据
        orderItems.each(function (item) {
            // 1.房价码读取，使用item中的房价码读取相关信息
            var codePrice = Dao.Unique('htl.code.price', {
                uniqueId: item.get('codePrice')
            });
            if (codePrice) codes.push(codePrice);
            // 2.包早和POS预定
            item._b(['brekker', 'pos']);
            // 3.构造订单项
            var itemData = _configOrderItems(item, data);
            items.push(itemData);
        });
        var total = items.sumObj('amountActual', true);
        return {total: total, items: items, codes: codes};
    };
    _fnCreateItems = function (items, orderId) {
        if (!Array.is(items)) {
            Log.warn("[HTL] The parameter 'items' must be Array.");
            return;
        }
        items.batch('orderId', orderId);
        return Order.createItems(items);
    };
    _fnCreateFtItems = function (item, created, code) {
        var roomType = Dao.Unique('htl.room.type', created.getID('roomTypeId'));
        // 1. 餐券
        var data = {};
        if (roomType) {
            data.from(roomType, ["lunchTicket", "supperTicket", "brekkerTicket"]);
        }
        // 2. 时间计算
        data.set('leaveTime', Period.jtime(created.get('leaveTime')));
        data.set('arriveTime', Period.jtime(created.get('arriveTime')));
        // 3. 请求中拷贝数据
        data.from(created, [
            "insideDays",
            "insidePersons",
            "roomCounter",
            "roomTypeId",
            "codeGroup",
            "codeCommission"
        ]);
        // 4. 处理Boolean值
        data.from(created, ['brekker','pos']);
        data.bool(["brekker", "pos"]);
        // 5. 处理价格以及特殊
        data.set('brekkerPrice', code._i('brekkerPrice', true));
        data.set('codePrice', code.id());
        data.set('oitemId', item.id());
        data.ma();
        return Dao.Insert('htl.order.items', data);
    };
    // 从data中提取traveler节点生成orderItems：特殊方法
    _fnFlip = function(request){
        var traveler = request.array('traveler');
        var first = traveler.first();
        // 拷贝订单项数据
        var orderItems = first.getSub([
            'roomTypeId','brekker','pos',
            'codePrice', 'codeGroup', 'codeCommission',
            'insideDays',
            'leaveTime', 'arriveTime',
            'unitPrice', 'discount'
        ]);
        // 预定房间信息，只能为1
        orderItems.set('roomCounter', 1);
        // 入住人数，直接取traveler长度
        orderItems.set('insidePersons', traveler.length);
        // 转换orderItems的数据类型
        orderItems = Array.as(orderItems);
        // 修改request请求
        request.set('orderItems',orderItems);
        return orderItems;
    };
    // 构造订单专用响应数据
    _fnResponse = function(response,objects,arrays){
        if(arrays){
            arrays.each(function(item){
                Error.debug(item);
            })
        }
        if(objects){
            objects.each(function(item){
                Error.debug(item);
            });
        }
        Error.debug(response._());
    };
    return {};
})();
(function () {
    $$Order = $$Order.prototype = {
        fnCreate: _fnCreate,
        fnConnect: _fnConnect,
        fnCreateItems: _fnCreateItems,
        fnCreateFtItems: _fnCreateFtItems,
        fnFlip: _fnFlip,
        fnResponse:_fnResponse
    }
})();
