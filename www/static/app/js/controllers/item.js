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

