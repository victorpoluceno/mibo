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

