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

