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

