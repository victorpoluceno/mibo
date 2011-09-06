app.views.PlayerDetail = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Player',
        items: [{
            text: 'Back',
            ui: 'back',
            listeners: {
                'tap': function () {
                    Ext.dispatch({
                        controller: app.controllers.player,
                        action: 'back',
                        animation: {type:'slide', direction:'right'},
                        id: this.id,
                    });
                }
            }
        }]
    }],
    layout: 'fit',
    items: [{
        xtype: 'video',
        loop: true,
    }],
    updateByItem: function(record) {
        console.log(record.data.url);
        console.log(record.data.thumbnail_url);
        this.getDockedItems()[0].items.items[0].id = record.get('channel_id');
        this.items.items[0].url = record.data.url;
        this.items.items[0].posrterUrl = record.data.thumbnail_url;
        var toolbar = this.getDockedItems()[0];
        toolbar.setTitle(record.get('name'));
    },
});

