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

