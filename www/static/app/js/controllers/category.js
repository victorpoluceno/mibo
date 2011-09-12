Ext.regController('category', {
    index: function(options) {
        this.list(options)
    },
    list: function(options){
        app.views.viewport.setActiveItem(
            app.views.categoryList, options.animation);
    }
});

