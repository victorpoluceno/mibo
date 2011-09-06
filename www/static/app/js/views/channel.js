app.views.ChannelList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'View channels',
        items: [{
            text: 'Back',
            ui: 'back',
            listeners: {
                'tap': function () {
                    Ext.dispatch({
                        controller: app.controllers.channel,
                        action: 'back',
                        animation: {type:'slide', direction:'right'}
                    });
                }
            }
        }]
    }],
    layout: 'fit',
    items: [{
        xtype: 'list',
        store: app.stores.channel,
        //FIXME save this as a external file?
        //FIXME need to isolate this and check performance of onerror code
        //TODO add item_count value
        itemTpl: '<div class="channel">' +
            '<img class="channel" src="{thumbnail_url}"' +
            'alt="{name}" onerror="this.onerror=null; ' +
            'this.src=\'/static/app/img/missing.jpeg\';"></img>' +
            '<h4 class="channel">{name}</h4>' +
            '<p class="channel">{publisher}</p>' +
            '<p class="channel">{item.length} Episodes</p>' +
            '</div>',
        onItemDisclosure: function (record) {
            Ext.dispatch({
                controller: app.controllers.channel,
                action: 'show',
                id: record.getId()
            })
        },
    }],
    updateByCategory: function(record) {
        //FIXME find a way to avoi load every time
        app.stores.channel.load({
            'limit': 10, 
            'category': record.getId(),
        });
        var toolbar = this.getDockedItems()[0];
        toolbar.setTitle(record.get('name'));
    },
});

