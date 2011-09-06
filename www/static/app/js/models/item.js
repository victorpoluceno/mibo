app.models.Item = Ext.regModel('app.models.Item', {
    fields: ['id', 'name', 'description', 'channel_id', 'url', 'playback_url', 'date', 'size'],
    associations: [
        {'type': 'belongsTo', 'model': 'app.models.Channel', 'name': 'channel'}
    ]
});

//FIXME use rest proxy to avoid non cache 
app.stores.item = new Ext.data.Store({
    model: "app.models.Item",
    proxy: {
        type: "scripttag",
        url: app.api_server + "/api/get_channel/",
        callbackParam: "callback",
        noCache: false,
        reader: {
            type: 'json',
            root: 'item'
        }
    },
});

app.stores.item.on('beforeload', function(store, operation){
    // hack that enable browser cache by avoiding mutable post 
    // fix on the callback param
    Ext.data.ScriptTagProxy.TRANS_ID = 1000;
    store.proxy.extraParams = {
        'id': operation.channel, 
        'datatype': 'json'
    };
});

