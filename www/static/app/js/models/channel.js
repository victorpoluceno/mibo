app.models.Channel = Ext.regModel('app.models.Channel', {
    fields: ['id', 'name', 'description', 'thumbnail_url', 'publisher', 'rating'],
    associations: [
        {'type': 'hasMany', 'model': 'app.models.Item', 'name': 'item'}
    ]
});

app.stores.channel = new Ext.data.Store({
    model: "app.models.Channel",
    proxy: {
        type: "scripttag",
        url: app.api_server + "/api/get_channels/",
        callbackParam: "callback",
        noCache: false,
        reader: {
            type: 'json'
        }
    },
});

app.stores.channel.on('beforeload', function(store, operation){
    // hack that enable browser cache by avoiding mutable 
    // postfix on the callback param
    Ext.data.ScriptTagProxy.TRANS_ID = 1000;
    // filter params required by mibo api
    store.proxy.extraParams = {
        'filter': 'category', 
        'filter_value': operation.category, 
        'sort': 'rating', 
        'datatype': 'json'};
});

app.stores.channel.on('load', function (store, records, successful){
    if (successful){
        //FIXME should use filterBy but it is not working properly
        store.each(function (record){
            if (record.get('item') == null || record.get('item').length == 0){
                store.remove(record);
            }
        });
    }
});

