app.controllers.channel = new Ext.Controller({
    index: function(options) {
        var id = options.id,
            category = app.stores.category.getById(id);
        if (category) {
            app.views.channelList.updateByCategory(category);
            app.views.viewport.setActiveItem(
                app.views.channelList, options.animation);
            this.category = category;
        }
        //FIXME: not sure if it is right placten to put this
        app.stores.channel.proxy.on('exception', function(proxy, request, operation){
            operation.setException('Error fetching data!');
            Ext.Msg.alert('Error', 'Error fetching data!', Ext.emptyFn);
            app.controllers.category.index(options);
        });
    },
    show: function(options) {
        options.categoryId = this.category.getId();
        app.controllers.item.index(options);
    },
    back: function(options){
        app.controllers.category.index(options);
    }
});

