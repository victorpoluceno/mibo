app.views.ItemList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'View items',
        items: [{
            text: 'Back',
            ui: 'back',
            listeners: {
                'tap': function () {
                    Ext.dispatch({
                        controller: app.controllers.item,
                        action: 'back',
                        animation: {type:'slide', direction:'right'},
                    });
                }
            }
        }]
    }],
    layout: 'fit',
    items: [{
        xtype: 'list',
        store: app.stores.item,
        //FIXME: it there is no thumbnail get from channel
        //FIXME save this as a external file?
        itemTpl: new Ext.XTemplate('<div class="item">' +
                '<img class="item" width=50 height=50 ' +
                'src={[ this.channelThumbnail(values.channel_id) ]}>' +
                '</img><h4 class="item">{name}</h4>' +
                '<p class="item">{date}</p>' + 
                '</div>', {
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
                controller: app.controllers.item,
                action: 'show',
                id: record.getId()
            })
        }
    }],
    updateByChannel: function(record) {
        this.items.items[0].channel_thumbnail = record.get('thumbnail_url');
        this.getDockedItems()[0].items.items[0].channelId = record.getId();
        //FIXME find a way to avoi load every time
        app.stores.item.load({'limit': 10, 'channel': record.getId()});
        var toolbar = this.getDockedItems()[0];
        toolbar.setTitle(record.get('name'));
    },
});

