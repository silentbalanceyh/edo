function $_fnHtlConfigOrder(data, total, status){
    var config = {
        sigma: data['sigma'],
        category: { type:'order.type', code:'Preordain'},
        serial: 'Preordain',
        credence: 'PreordainCredence',
        tabular:{
            NAME:{
                orderStatus:{ type:'order.status',code:'Ordered'}
            }
        },
        now:['orderTime'],
        amountActual:total
    }
    return config;
}

function $_fnHtlConfigOrderItem(item, data){
    var quantity = parseInt(item['insideDays']) * parseInt(item['roomCounter']);
    var amountPrice = parseFloat(item['unitPrice']);
    var amountActual = amountPrice * quantity;
    var config = {
        sigma: data['sigma'],
        serial: 'PreordainItem',
        amountPrice: amountPrice,
        amountActual: amountActual,
        quantity: quantity
    };
    return config;
}
