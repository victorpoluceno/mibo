app.views.CategoryList = Ext.extend(Ext.Panel, {
    dockedItems: [{
        xtype: 'toolbar',
        title: 'Mibo'
    }],
    layout: 'fit',
    items: [{
        xtype: 'list',
        store: app.stores.category,
        itemTpl: '{name}',
        onItemDisclosure: function (record) {
            Ext.dispatch({
                controller: app.controllers.category,
                action: 'show',
                id: record.getId()
            });
        }
    }],
});

