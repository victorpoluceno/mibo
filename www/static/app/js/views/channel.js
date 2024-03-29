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

