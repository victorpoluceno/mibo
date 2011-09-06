app.controllers.item = new Ext.Controller({
    index: function(options) {
        this.categoryId = options.categoryId;
        var id = options.id,
            channel = app.stores.channel.getById(id);
        if (channel) {
            app.views.itemList.updateByChannel(channel);
            app.views.viewport.setActiveItem(
                app.views.itemList, options.animation);
        }
    },
    show: function(options){    
        app.controllers.player.index(options);
    },
    back: function(options){
        options.id = this.categoryId;
        app.controllers.channel.index(options);
    }
});

