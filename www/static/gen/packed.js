Ext.Router.draw(function(map) {
    // index url
    map.connect('', {controller: 'category', action: 'index'});
    map.connect('channel/:category_id/', {controller: 'channel', action: 'index'})
    map.connect('item/:channel_id/', {controller: 'item', action: 'index'})
    map.connect('player/:item_id/', {controller: 'player', action: 'index'})
    // fallback route
    map.connect(':controller/:action');
});


Ext.regApplication({
    name: 'app',
    api_server: document.API_SERVER,
    launch: function() {
        this.views.viewport = new this.views.Viewport();
    },
});


app.views.Viewport = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    cardSwitchAnimation: 'slide',
    initComponent: function() {
        //put instances of cards into app.views namespace
        Ext.apply(app.views, {
            categoryList: new app.views.CategoryList(),
            channelList: new app.views.ChannelList(),
            itemList: new app.views.ItemList(),
            playerDetail: new app.views.PlayerDetail()
        });
        //put instances of cards into viewport
        Ext.apply(this, {
            items: [
                app.views.categoryList,
                app.views.channelList,
                app.views.itemList,
                app.views.playerDetail
            ]
        });
        app.views.Viewport.superclass.initComponent.apply(this, arguments);
    }
});


app.models.Category = Ext.regModel('app.models.Category', {
    idProperty: 'name', // uses name as internal id
    fields: ['id', 'name', 'url']
});


//FIXME use restproxy to avoid non cache behavior
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


app.models.Channel = Ext.regModel('app.models.Channel', {
    fields: ['id', 'name', 'description', 'thumbnail_url', 'publisher', 'rating'],
    associations: [
        {'type': 'hasMany', 'model': 'app.models.Item', 'name': 'item'}
    ]
});

//FIXME use rest proxy to avoid non cache 
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
    // hack that enable browser cache by avoiding mutable post 
    // fix on the callback param
    Ext.data.ScriptTagProxy.TRANS_ID = 1000;
    store.proxy.extraParams = {
        'filter': 'category', 
        'filter_value': operation.category, 
        'sort': 'rating', 
        'datatype': 'json'};
});

app.stores.channel.on('load', function (store, records, successful){
    if (successful){
        //FIXME we should use filterBy but is not working properly
        store.each(function (record){
            if (record.get('item') == null || record.get('item').length == 0){
                store.remove(record);
            }
        });
    }
});


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


app.views.CategoryList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Mibo'
    }],
    layout: 'fit',
    items: [{
        xtype: 'list',
        store: app.stores.category,
        itemTpl: '{name}',
        onItemDisclosure: function (record) {
            Ext.dispatch({
                controller: 'channel',
                action: 'index',
                category_id: record.getId(),
                historyUrl: Ext.util.Format.format('channel/{0}/', record.getId())
            });
        }
    }]
});


app.views.ChannelList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'View channels',
        items: [{
            text: 'Back',
            ui: 'back',
            listeners: {
                'tap': function () {
                    window.history.back();
                }
            }
        }]
    }],
    layout: 'fit',
    items: [{
        xtype: 'list',
        store: app.stores.channel,
        itemTpl: '<div class="channel">' +
            '<img class="channel" src="{thumbnail_url}"' +
            'onerror="this.onerror=null; ' +
            'this.src=\'/static/app/img/missing.jpeg\';"></img>' +
            '<h4 class="channel">{name}</h4>' +
            '<p class="channel">{publisher}</p>' +
            '<p class="channel">{item.length} Episodes</p>' +
            '</div>',
        onItemDisclosure: function (record) {
            Ext.dispatch({
                controller: 'item',
                action: 'index',
                channel_id: record.getId(),
                historyUrl: Ext.util.Format.format('item/{0}/', record.getId())
            })
        },
    }],
    setTitle: function(title) {
        var toolbar = this.getDockedItems()[0];
        toolbar.setTitle(title);
    }
});


app.views.ItemList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'View items',
        items: [{
            text: 'Back',
            ui: 'back',
            listeners: {
                'tap': function () {
                    window.history.back();
                }
            }
        }]
    }],
    layout: 'fit',
    items: [{
        xtype: 'list',
        store: app.stores.item,
        itemTpl: new Ext.XTemplate('<div class="item">' +
                '<img class="item" ' +
                'src={[ this.channelThumbnail(values.channel_id) ]} ' +
                'onerror="this.onerror=null; ' +
                'this.src=\'/static/app/img/missing.jpeg\';"></img>' +
                '<h4 class="item">{name}</h4>' +
                '<p class="item">{[ this.formatDate(values.date) ]}</p>' + 
                '</div>', {
            formatDate: function(date){
                return new Date(date).format('Y-m-d H:i:s');
            },
            channelThumbnail: function(channel_id){
                //FIXME this sucks, have to fix belongsto from item to channel
                var channel = app.stores.channel.getById(channel_id);
                if (channel) {
                    return channel.get('thumbnail_url');
                }
            }
        }),
        onItemDisclosure: function (record) {
            Ext.dispatch({
                controller: 'player',
                action: 'index',
                item_id: record.getId(),
                historyUrl: Ext.util.Format.format('player/{0}/', record.getId())
            })
        }
    }],
    setTitle: function(title) {
        var toolbar = this.getDockedItems()[0];
        toolbar.setTitle(title);
    }
});


app.views.PlayerDetail = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Player',
        items: [{
            text: 'Back',
            ui: 'back',
            listeners: {
                'tap': function () {
                    window.history.back();
                }
            }
        }]
    }],
    layout: 'fit',
    items: [{
        xtype: 'video',
        loop: true,
    }],
    setTitle: function(title) {
        var toolbar = this.getDockedItems()[0];
        toolbar.setTitle(title);
    }
});


Ext.regController('category', {
    index: function(options) {
        this.list(options)
    },
    list: function(options){
        app.views.viewport.setActiveItem(
            app.views.categoryList, options.animation);
    }
});


Ext.regController('channel', {
    index: function(options) {
        this.list(options);
    },
    list: function(options) {
        var category_id = options.category_id,
                category = app.stores.category.getById(category_id);
        if (category){
            app.stores.channel.clearFilter();
            app.stores.channel.load({
                'limit': 10, 
                'category': category_id,
            });
            app.views.channelList.setTitle(category.get('name'));
            app.views.viewport.setActiveItem(
                    app.views.channelList, options.animation);

            //TODO implement offline support and notification
            //FIXME: not sure if it is right placten to put this
            //app.stores.channel.proxy.on('exception', function(proxy, request, operation){
            //    operation.setException('Error fetching data!');
            //    Ext.Msg.alert('Error', 'Error fetching data!', Ext.emptyFn);
            //    app.controllers.category.index(options);
            //});
        }
    }
});


Ext.regController('item', {
    index: function(options) {
        this.list(options);
    },
    list: function(options) {
        var channel_id = options.channel_id,
                channel = app.stores.channel.getById(parseInt(channel_id));
        if (channel){
            app.stores.item.clearFilter();
            app.stores.item.load({
                'limit': 10, 
                'channel': channel_id,
            });
            //FIXME
            app.views.itemList.items.items[0].channel_thumbnail = channel.get('thumbnail_url');
            app.views.itemList.setTitle(channel.get('name'));
            app.views.viewport.setActiveItem(
                    app.views.itemList, options.animation);
        }
    }
});


Ext.regController('player', {
    index: function(options) {
        this.load(options)
    },
    load: function(options){
        var item_id = options.item_id,
                item = app.stores.item.getById(parseInt(item_id));
        if (item) {
            //FIXME
            app.views.playerDetail.items.items[0].url = item.data.url;
            app.views.playerDetail.items.items[0].posrterUrl = item.data.thumbnail_url;

            app.views.playerDetail.setTitle(item.get('name'));
            app.views.viewport.setActiveItem(
                    app.views.playerDetail, options.animation);
        }
    }
});

