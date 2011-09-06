app.controllers.player = new Ext.Controller({
    index: function(options) {
        var id = options.id,
            item = app.stores.item.getById(id);

        if (item) {
            app.views.playerDetail.updateByItem(item);
            app.views.viewport.setActiveItem(
                app.views.playerDetail, options.animation);
        }
    },
    back: function(options){
        app.controllers.item.index(options);
    }
});

