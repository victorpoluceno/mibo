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
                controller: 'channel',
                action: 'index',
                category_id: record.getId(),
                historyUrl: Ext.util.Format.format('channel/{0}/', record.getId())
            });
        }
    }]
});

