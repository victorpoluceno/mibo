Ext.Router.draw(function(map) {
    // index url
    map.connect('', {controller: 'category', action: 'index'});
    map.connect('channel/:category_id/', {controller: 'channel', action: 'index'})
    map.connect('item/:channel_id/', {controller: 'item', action: 'index'})
    map.connect('player/:item_id/', {controller: 'player', action: 'index'})
    // fallback route
    map.connect(':controller/:action');
});

