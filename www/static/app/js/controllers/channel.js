Ext.regController('channel', {
    index: function(options) {
        this.list(options);
    },
    list: function(options) {
        var category_id = options.category_id,
                category = app.stores.category.getById(category_id);
        if (category){
            app.stores.channel.clearFilter();
            app.stores.channel.load({
                'limit': 10, 
                'category': category_id,
            });
            app.views.channelList.setTitle(category.get('name'));
            app.views.viewport.setActiveItem(
                    app.views.channelList, options.animation);

            //TODO implement offline support and notification
            //FIXME: not sure if it is right placten to put this
            //app.stores.channel.proxy.on('exception', function(proxy, request, operation){
            //    operation.setException('Error fetching data!');
            //    Ext.Msg.alert('Error', 'Error fetching data!', Ext.emptyFn);
            //    app.controllers.category.index(options);
            //});
        }
    }
});

