app.models.Category = Ext.regModel('app.models.Category', {
    idProperty: 'name', // uses name as internal id
    fields: ['id', 'name', 'url']
});

app.stores.category = new Ext.data.Store({
    autoLoad: true,
    model: "app.models.Category",
    proxy: {
        type: "scripttag",
        url: app.api_server + "/api/list_categories/",
        callbackParam: "callback",
        extraParams: {'datatype': 'json'},
        noCache: false,
        reader: {
            type: 'json',
            idProperty: 'name' // uses name as internal id
        }
    },
});

