Ext.regApplication({
    name: 'app',
    api_server: document.API_SERVER,
    launch: function() {
        this.views.viewport = new this.views.Viewport();
    },
});

