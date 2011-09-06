Ext.regApplication({name:"app",api_server:document.API_SERVER,launch:function(){this.views.viewport=new this.views.Viewport()},});app.views.Viewport=Ext.extend(Ext.Panel,{fullscreen:true,layout:"card",cardSwitchAnimation:"slide",initComponent:function(){Ext.apply(app.views,{categoryList:new app.views.CategoryList(),channelList:new app.views.ChannelList(),itemList:new app.views.ItemList(),playerDetail:new app.views.PlayerDetail()});Ext.apply(this,{items:[app.views.categoryList,app.views.channelList,app.views.itemList,app.views.playerDetail]});app.views.Viewport.superclass.initComponent.apply(this,arguments)}});app.models.Category=Ext.regModel("app.models.Category",{idProperty:"name",fields:["id","name","url"]});app.stores.category=new Ext.data.Store({autoLoad:true,model:"app.models.Category",proxy:{type:"scripttag",url:app.api_server+"/api/list_categories/",callbackParam:"callback",extraParams:{datatype:"json"},noCache:false,reader:{type:"json",idProperty:"name"}},});app.models.Channel=Ext.regModel("app.models.Channel",{fields:["id","name","description","thumbnail_url","publisher","rating"],associations:[{type:"hasMany",model:"app.models.Item",name:"item"}]});app.stores.channel=new Ext.data.Store({model:"app.models.Channel",proxy:{type:"scripttag",url:app.api_server+"/api/get_channels/",callbackParam:"callback",noCache:false,reader:{type:"json"}},});app.stores.channel.on("beforeload",function(b,a){Ext.data.ScriptTagProxy.TRANS_ID=1000;b.proxy.extraParams={filter:"category",filter_value:a.category,sort:"rating",datatype:"json"}});app.stores.channel.on("load",function(b,a,c){if(c){b.each(function(d){if(d.get("item")==null||d.get("item").length==0){b.remove(d)}})}});app.models.Item=Ext.regModel("app.models.Item",{fields:["id","name","description","channel_id","url","playback_url","date","size"],associations:[{type:"belongsTo",model:"app.models.Channel",name:"channel"}]});app.stores.item=new Ext.data.Store({model:"app.models.Item",proxy:{type:"scripttag",url:app.api_server+"/api/get_channel/",callbackParam:"callback",noCache:false,reader:{type:"json",root:"item"}},});app.stores.item.on("beforeload",function(b,a){Ext.data.ScriptTagProxy.TRANS_ID=1000;b.proxy.extraParams={id:a.channel,datatype:"json"}});app.views.CategoryList=Ext.extend(Ext.Panel,{dockedItems:[{xtype:"toolbar",title:"Mibo"}],layout:"fit",items:[{xtype:"list",store:app.stores.category,itemTpl:"{name}",onItemDisclosure:function(a){Ext.dispatch({controller:app.controllers.category,action:"show",id:a.getId()})}}],});app.views.ChannelList=Ext.extend(Ext.Panel,{dockedItems:[{xtype:"toolbar",title:"View channels",items:[{text:"Back",ui:"back",listeners:{tap:function(){Ext.dispatch({controller:app.controllers.channel,action:"back",animation:{type:"slide",direction:"right"}})}}}]}],layout:"fit",items:[{xtype:"list",store:app.stores.channel,itemTpl:'<div class="channel"><img class="channel" src="{thumbnail_url}"alt="{name}" onerror="this.onerror=null; this.src=\'/static/app/img/missing.jpeg\';"></img><h4 class="channel">{name}</h4><p class="channel">{publisher}</p><p class="channel">{item.length} Episodes</p></div>',onItemDisclosure:function(a){Ext.dispatch({controller:app.controllers.channel,action:"show",id:a.getId()})},}],updateByCategory:function(a){app.stores.channel.load({limit:10,category:a.getId(),});var b=this.getDockedItems()[0];b.setTitle(a.get("name"))},});app.views.ItemList=Ext.extend(Ext.Panel,{dockedItems:[{xtype:"toolbar",title:"View items",items:[{text:"Back",ui:"back",listeners:{tap:function(){Ext.dispatch({controller:app.controllers.item,action:"back",animation:{type:"slide",direction:"right"},})}}}]}],layout:"fit",items:[{xtype:"list",store:app.stores.item,itemTpl:new Ext.XTemplate('<div class="item"><img class="item" width=50 height=50 src={[ this.channelThumbnail(values.channel_id) ]}></img><h4 class="item">{name}</h4><p class="item">{date}</p></div>',{channelThumbnail:function(a){var b=app.stores.channel.getById(a);if(b){return b.get("thumbnail_url")}}}),onItemDisclosure:function(a){Ext.dispatch({controller:app.controllers.item,action:"show",id:a.getId()})}}],updateByChannel:function(a){this.items.items[0].channel_thumbnail=a.get("thumbnail_url");this.getDockedItems()[0].items.items[0].channelId=a.getId();app.stores.item.load({limit:10,channel:a.getId()});var b=this.getDockedItems()[0];b.setTitle(a.get("name"))},});app.views.PlayerDetail=Ext.extend(Ext.Panel,{dockedItems:[{xtype:"toolbar",title:"Player",items:[{text:"Back",ui:"back",listeners:{tap:function(){Ext.dispatch({controller:app.controllers.player,action:"back",animation:{type:"slide",direction:"right"},id:this.id,})}}}]}],layout:"fit",items:[{xtype:"video",loop:true,}],updateByItem:function(a){console.log(a.data.url);console.log(a.data.thumbnail_url);this.getDockedItems()[0].items.items[0].id=a.get("channel_id");this.items.items[0].url=a.data.url;this.items.items[0].posrterUrl=a.data.thumbnail_url;var b=this.getDockedItems()[0];b.setTitle(a.get("name"))},});app.controllers.category=new Ext.Controller({index:function(a){app.views.viewport.setActiveItem(app.views.categoryList,a.animation)},show:function(a){app.controllers.channel.index(a)},});app.controllers.channel=new Ext.Controller({index:function(a){var c=a.id,b=app.stores.category.getById(c);if(b){app.views.channelList.updateByCategory(b);app.views.viewport.setActiveItem(app.views.channelList,a.animation);this.category=b}app.stores.channel.proxy.on("exception",function(e,f,d){d.setException("Error fetching data!");Ext.Msg.alert("Error","Error fetching data!",Ext.emptyFn);app.controllers.category.index(a)})},show:function(a){a.categoryId=this.category.getId();app.controllers.item.index(a)},back:function(a){app.controllers.category.index(a)}});app.controllers.item=new Ext.Controller({index:function(a){this.categoryId=a.categoryId;var c=a.id,b=app.stores.channel.getById(c);if(b){app.views.itemList.updateByChannel(b);app.views.viewport.setActiveItem(app.views.itemList,a.animation)}},show:function(a){app.controllers.player.index(a)},back:function(a){a.id=this.categoryId;app.controllers.channel.index(a)}});app.controllers.player=new Ext.Controller({index:function(a){var c=a.id,b=app.stores.item.getById(c);if(b){app.views.playerDetail.updateByItem(b);app.views.viewport.setActiveItem(app.views.playerDetail,a.animation)}},back:function(a){app.controllers.item.index(a)}});