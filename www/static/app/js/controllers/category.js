app.controllers.category = new Ext.Controller({
    index: function(options) {
        app.views.viewport.setActiveItem(
            app.views.categoryList, options.animation);
    },
    show: function(options) {
        app.controllers.channel.index(options);
    },
});

