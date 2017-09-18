// ------------------Init Stauts---------------------------------
Import(['Dao','QTree','Period']);

$$Room = (function(){
    // --------------全局变量--------------------------
    var __G_STATUS = Dao.Collect('sys.tabular','type',[
        'room.status','room.clean.status','room.op.status'
    ]);
    var __ETAT_DFT_CLEAN = __G_STATUS.filterObj(function(item){
        return 'room.clean.status' == item.type && 'Checked' == item.code;
    });
    var __ETAT_DFT_ROOM = __G_STATUS.filterObj(function(item){
        return 'room.status' == item.type && 'Operation' == item.code;
    });
    var request = new Request();
    var __G_TYPE = Dao.Query('htl.room.type',request.getSub('hotelId'));
    /* 元数据处理函数 **/
    var __meta = function(){
        var _status = __G_STATUS.filter(function(item){
            return 'room.status' == item.type;
        });
        var _clean = __G_STATUS.filter(function(item){
            return 'room.clean.status' == item.type;
        });
        var _op = __G_STATUS.filter(function(item){
            return 'room.op.status' == item.type;
        });
        return{
            op:_op.horiz('code','uniqueId'),
            status:_status.horiz('code','uniqueId'),
            clean:_clean.horiz('code','uniqueId')
        }
    }
    var __type = function(){
        return {
            code:__G_TYPE.horiz('code','uniqueId'),
            value:__G_TYPE.horiz('uniqueId','name')
        }
    }
    var __etat = function(etat){
        if(!etat) etat = {};
        return {
            arriving:false,
            leaving:false,
            opStatus:__ETAT_DFT_ROOM.uniqueId,
            cleanStatus:__ETAT_DFT_CLEAN.uniqueId
        }.from(etat);
    };
    var __MAP_TYPE = __type();
    var __MAP_ETAT = __meta();
    var __OBJ_CLEAN = __MAP_ETAT.clean;
    var __OBJ_STATUS = __MAP_ETAT.status;
    /*
     * 计算某一天房态的通用函数
     * @param total：酒店总房间
     * @param inoccups: 目前查询到的被占用的房间，来自v.htl.room（包含房态）
     * @param filters: 
     * {
     *         hotelId: 酒店ID,
     *         day: 时间信息
     * }
     */
    _fnCalcStatus = function(total, inoccups, filters){
        if(!total){
            Log.warn("[HTL] No room found in current hotel.");
            hotel = [];
        }
        if(!inoccups) inoccups = [];
        var status = Dao.Query('v.htl.room',filters);
        /* 1.遍历所有房间 **/
        var response = [];
        total.each(function(room){
            /* 2.占用房中是否包含该房间 **/
            var found = inoccups.find('number',room.number);
            if(found){
                /* 3.1.1.包含该房间 **/
                response.push(found);
            }else{
                /* 3.2.1.不包含该房间 **/
                var etat = status.find('uniqueId',room.uniqueId);
                /* 3.2.2.执行房态初始化 **/
                var initEtat = __etat(etat.from({
                    day: filters.day
                }));
                /* 3.2.3.合并房态信息 **/
                initEtat = room.from(initEtat);
                response.push(initEtat);
            }
        });
        return response;
    };
    _fnCalcReport = function(rooms){
        if(!Array.is(rooms)){
            Log.warn("[HTL] The input parameter 'rooms' type is invalid.");
        }
        /* 1.按type进行分组 **/
        var groups = rooms.group("roomTypeId");
        /* 2.构造响应 **/
        var response = [];
        /* 3.遍历每一个组的房间 **/
        groups.each(function(group,key){
            /* 1.每一行的数据计算 **/
            var row = {};
            row['typed'] = group.length;
            /* 2.清洁状态计算 **/
            row['dirty']         = group.count('cleanStatus',__OBJ_CLEAN.get('Dirty'));
            row['checked']         = group.count('cleanStatus',__OBJ_CLEAN.get('Checked'));
            row['unchecked']     = group.count('cleanStatus',__OBJ_CLEAN.get('Unchecked'));
            /* 3.基础状态计算 **/
            row['self']            = group.count('opStatus',__OBJ_STATUS.get('Self'));
            row['mind']            = group.count('opStatus',__OBJ_STATUS.get('Mind'));
            row['disabled']        = group.count('opStatus',__OBJ_STATUS.get('Disabled'));
            row['left']            = group.count('opStatus',__OBJ_STATUS.get('Left'));
            row['dwell']            = group.count('opStatus',__OBJ_STATUS.get('Dwell'));
            row['free']            = group.count('opStatus',__OBJ_STATUS.get('Free'));
            /* 4.计算预离、预抵、在住、可用、可预订 **/
            var opRooms = group.filter(Function.asFilter('opStatus',__OBJ_STATUS.get('Operation')));
            /* 4.1.预离和预抵 **/
            row['leaving'] = opRooms.filter(Function.Logic.tf('leaving','arriving')).length;
            row['arriving'] = opRooms.filter(Function.Logic.ft('leaving','arriving')).length;
            /* 在住 = 占用 + 预离 **/
            row['reside'] = opRooms.filter(Function.Logic.t('leaving')).length;
            /* 可用 = 空房间 + 预抵 **/
            row['useful'] = opRooms.filter(Function.Logic.f('leaving')).length;
            /* 可预定 = 空房间 + 预离 **/
            row['ordering'] = opRooms.filter(Function.Logic.f('arriving')).length;
            /* 计算总数 **/
            row.each(function(value,field){
                if(total.get(field)){
                    total[field] += parseInt(value);
                }else{
                    total[field] = 0 + parseInt(value);
                }
            });
            /* 房型数据 **/
            row['roomTypeId'] = key
            row['roomType'] = __MAP_TYPE.get('value').get(key);
            response.push(row);
        });
        return response;
    };
    _fnCalcOrdered = function(day, roomTypeId){
        if(!roomTypeId || !day){
            Log.warn("[HTL] Required parameter 'roomTypeId' or 'day' missing.");
        }
        var criteria = new QTree().and("arriveTime<=",day).and("leaveTime>=",day);
        criteria.connect(new QTree().and("roomTypeId",roomTypeId).and("sigma",$data["sigma"]));
        var orders = Dao.Criteria("htl.order.items",criteria._());
        var counter = 0;
        if(0 < orders.length){
            counter = orders.sumObj("roomCounter");
        }
        return counter;
    };
    _fnTakeUp = function(room, duration, hotelId){
        if(!hotelId || !duration || !room){
            Log.warn("[HTL] Required parameter 'hotelId' or 'duration' or 'room' missing.");
        }
        if(!duration.hasOwnProperty('start') || !duration.hasOwnProperty('end')){
            Log.warn('[HTL] Parameter "duration" data structure is invalid, please contact administrator.');
        }
        // 开始时间和结束时间
        var start = Period.time(duration.start).toDay();
        var end = Period.time(duration.end).toDay();
        Log.info('[HTL] Room status between ' + start + ' and ' + end + ' will be queried from the system.');
        // 读取房间原始状态信息
        var filters = new QTree().and('number',room).and('hotelId',hotelId);
        var rooms = Dao.Criteria('htl.room',filters._());
        filters.connect(new QTree().and('day>=',start).and('day<=',end));
        var status = Dao.Criteria('v.htl.room',filters._());
        if(Array.is(rooms) && Array.is(status)){
            rooms = rooms.first();
            Period.everyDay(start,end,function(period){
                // 数据库中是时间格式，所以必须格式化时间部分以00:00:00方式出现
                var found = status.find('day',period.toTime());
                if(found){
                    /** 更新房态 **/
                    Dao.Modify('htl.room.status',Object.pk(found.get('statusId')),{
                        opStatus:__ETAT_DFT_ROOM.id(),
                        arriving:true,
                        leaving:true
                    });
                }else{
                    /** 添加房态 **/
                    var data = {
                        arriving:true,
                        leaving:true,
                        day:period.toDay(),
                        opStatus:__ETAT_DFT_ROOM.id(),
                        cleanStatus:__ETAT_DFT_CLEAN.id(),
                        roomId:rooms.id()
                    };
                    Dao.Insert('htl.room.status',data);
                }
            });
        }else{
            Log.warn('[HTL] The queried data structure is invalid. ( rooms or status ).');
        }
    };
    var fnCalcColor = function(room){
        // 2.先计算基础房态中的：维修、停用、自用、免费、长住房
        if(__OBJ_STATUS.get('Self') == room.opStatus){
            // Color -> 自用房
            room.color = 'self';
        }else if(__OBJ_STATUS.get('Mind') == room.opStatus){
            // Color -> 维修房
            room.color = 'mind';
        }else if(__OBJ_STATUS.get('Free') == room.opStatus){
            // Color -> 免费房
            room.color = 'free';
        }else if(__OBJ_STATUS.get('Dwell') == room.opStatus){
            // Color -> 长住房
            room.color = 'long-term';
        }else if(__OBJ_STATUS.get('Operation') == room.opStatus){
            // 可操作的房间
            if(__OBJ_CLEAN.get('Checked') == room.cleanStatus){
                if(room.leaving && room.arriving){
                    // Color -> 住净房
                    room.color = 'taken-clean';
                }else if(!room.leaving && !room.arriving){
                    // Color -> 空净房
                    room.color = 'empty-clean';
                }
            }else{
                if(room.leaving && room.arriving){
                    // Color -> 住脏房
                    room.color = 'taken-dirty';
                }else if(!room.leaving && !room.arriving){
                    // Color -> 空脏房
                    room.color = 'empty-dirty';
                }
            }
        }
        if(!room.color){
            // 其他房间，默认：空净房
            room.color = "empty-clean";
        }
    };
    _fnCalcRoom = function(rooms){
        if(Array.is(rooms)){
            rooms.each(function(room){
                // 1.房型计算
                var type = __G_TYPE.filterObj(Function.asFilter('uniqueId',room.roomTypeId));
                if(type) room.roomType = type.get('name');
                // 2.房间颜色部分
                fnCalcColor(room);
            });
        }else{
            Log.warn('[HTL] The "parameter" rooms must be an array.');
        }
    };
    return {};
})();
(function(){
    $$Room = $$Room.prototype = {
        // 计算房态信息
        fnCalcStatus:_fnCalcStatus,
        // 生成不同房型的房态报表
        fnCalcReport:_fnCalcReport,
        // 计算当天预定的房间数量
        fnCalcOrdered:_fnCalcOrdered,
        // 按照事件更新房态信息,
        fnTakeUp:_fnTakeUp,
        // 房屋信息计算
        fnCalcRoom:_fnCalcRoom,
    }
})();
