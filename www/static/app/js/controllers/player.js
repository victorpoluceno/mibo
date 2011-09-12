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

