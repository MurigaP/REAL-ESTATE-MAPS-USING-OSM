
//specify the required resources
/*Ext.Loader.setConfig({
    enabled : true,
    disableCaching : false,
    paths : {
        GeoExt : "geoext/src/GeoExt",
        Ext : "extjs/src"
    }
});
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GeoExt: "http://geoext.github.com/geoext2/src/GeoExt/",
        Ext: "http://cdn.sencha.com/ext/gpl/4.2.1/src"
    }
});*/
Ext.require([
    'Ext.container.Viewport',
    'Ext.window.MessageBox',
    'GeoExt.panel.Map',
    'Ext.form.ComboBox',
    'GeoExt.data.FeatureStore',
    'GeoExt.selection.FeatureModel',
    'Ext.grid.GridPanel',
    'GeoExt.selection.FeatureModel',
    'Ext.layout.container.Accordion',
    'Ext.layout.container.Border',
    'GeoExt.container.WmsLegend',
    'GeoExt.data.reader.WfsCapabilities',
    'GeoExt.data.WfsCapabilitiesLayerStore',
    'GeoExt.container.LayerLegend',
    'GeoExt.container.VectorLegend',
    'GeoExt.panel.Legend',
    'Ext.tree.plugin.TreeViewDragDrop',
    'GeoExt.window.Popup',
    'GeoExt.data.proxy.Protocol',
    'GeoExt.data.MapfishPrintProvider',
    'GeoExt.plugins.PrintExtent',
    'GeoExt.data.PrintPage',
    'GeoExt.tree.LayerContainer',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
	'GeoExt.tree.LayerLoader',
    'GeoExt.data.LayerTreeModel',
    'GeoExt.data.ScaleStore',
    'GeoExt.Action',
    'GeoExt.form.Panel',
    'GeoExt.form.field.GeocoderComboBox'
]);
Ext.onReady(function () {
Ext.QuickTips.init();
Ext.BLANK_IMAGE_URL = "extjs/resources/themes/images/default/tree/s.gif";
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
var controls = [];
var extents = new OpenLayers.Bounds(409142.53926, -104404.17599, 4173940.7722, -38362.58357);
    var map = new OpenLayers.Map("map", {
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.ArgParser(),
            new OpenLayers.Control.Attribution(),
            //new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.OverviewMap(),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.PanZoomBar(),
			//new OpenLayers.Control.FullScreen(),
            new OpenLayers.Control.KeyboardDefaults()
        ],
		maxExtent: extents,
		minExtent: "auto",
		restrictedExtent: extents
    },
		{projection: new OpenLayers.Projection("EPSG:4326")},
		{displayProjection: new OpenLayers.Projection("EPSG:4326")},
        {units: 'm'},
		{maxResolution: 156543.0339},
		{allOverlays: true}
        );
		var scaleStore =  Ext.create('GeoExt.data.ScaleStore', {map: map});
		var scaleCombo = Ext.create('Ext.form.ComboBox', {
			width:150,
			emptyText:'Zoom level',
			displayField:'scale',
			store:scaleStore,
			listConfig:{
				getInnerTpl:function(){
					return "1:{scale:round(0)}";
				}
			},
			editable:false,
			triggerAction:'all',
			queryMode:'local'
			});
			scaleCombo.on('select',function(combo, record, index){
				map.zoomTo(record[0].get( "level"));
				},
				this
			);
			map.events.register('zoomend',this,function(){
				var scale = scaleStore.queryBy(function(record){
					return this.map.getZoom() == record.data.level;
				});
				if (scale.length > 0){
					scale = scale.items[0];
					scaleCombo.setValue("1:"+ parseInt(scale.data.scale));
				}else {
					if (!scaleCombo.rendered) return;
					scaleCombo.clearValue();
				}
			})
		var google = new OpenLayers.Layer.Google(
            'Google Map Layer',
            {layer: 'satellite'},
			{sphericalMercator:true},
            {isBasiclayer: true},
			{numZoomLevels: 20}
        );
		/*var mapQuest = new OpenLayers.Layer.OSM("MapQuest Open",                                                   
            ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
            "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
            "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
            "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"],
            {attribution: "&copy; <a href='http://www.openstreetmap.org/'>OpenStreetMap</a> and contributors, under an <a href='http://www.openstreetmap.org/copyright' title='ODbL'>open license</a>. Tiles Courtesy of <a href='http://www.mapquest.com/'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png'>"
		});*/
		var OSM = new OpenLayers.Layer.OSM("OpenStreetMap");
		var county = new OpenLayers.Layer.WMS (
		"dekut.nyeri County",
        "http://localhost:8080/geoserver/dekut.nyeri/wms",
        {layers:"dekut.nyeri:county",transparent: true, format: "image/gif"},
		{visibility: true}
        );
	var parcels = new OpenLayers.Layer.WMS (
		"dekut.nyeri County",
        "http://localhost:8080/geoserver/dekut.nyeri/wms",
        {layers:"dekut.nyeri:nyeri",transparent: true, format: "image/gif"},
		{visibility: true}
        );
	var health= new OpenLayers.Layer.WMS (
		"dekut.nyeri County",
        "http://localhost:8080/geoserver/dekut.nyeri/wms",
        {layers:"dekut.nyeri:health",transparent: true, format: "image/gif"},
		{visibility: true}
        );
	var roads= new OpenLayers.Layer.WMS (
		"dekut.nyeri County",
        "http://localhost:8080/geoserver/dekut.nyeri/wms",
        {layers:"dekut.nyeri:roads",transparent: true, format: "image/gif"},
		{visibility: true}
        );
    var schools= new OpenLayers.Layer.WMS (
		"dekut.nyeri County",
        "http://localhost:8080/geoserver/dekut.nyeri/wms",
        {layers:"dekut.nyeri:schools",transparent: true, format: "image/gif"},
		{visibility: true}
        );
  
    
	
		var locationLayer = new OpenLayers.Layer.Vector("Location", {
            styleMap: new OpenLayers.Style({
                externalGraphic: "http://openlayers.org/api/img/marker.png",
                graphicYOffset: -25,
                graphicHeight: 25,
                graphicTitle: "${name}"
            }),
			projection: new OpenLayers.Projection("EPSG:4326")
        });
		var healths = new OpenLayers.Layer.Vector(
            "vector",
            {
                strategies: [new OpenLayers.Strategy.Fixed()],
                projection: new OpenLayers.Projection("EPSG:4326"),
				//styleMap:style,
				styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "green",
                        strokeColor: '#000000',
                        strokeWidth: 1,
                    }),
					"hover":new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "grey",
                        strokeColor: 'black',
                        strokeWidth: 1,
						label:'${Name_of_Sc}',
						labelAlign:'lt',
						fontFamily:'Arial',
						fontSize:10,
                    }),
					"select":new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "grey",
                        strokeColor: 'black',
                        strokeWidth: 1,
						label:'${Name_of_Sc}',
						labelAlign:'lt',
						fontOpacity:0.9,
						fontFamily:'Arial',
						fontSize:10,
                    })
                }),
                protocol: new OpenLayers.Protocol.WFS({
                    version: "1.1.0",
                    url: "/geoserver/wfs",
                    featurePrefix: 'dekut.nyeri', //geoserver worspace name
                    featureType: "schools", //geoserver Layer Name
                    featureNS: "http://localhost:8080/geoserver/dekut.nyeri", // Edit Workspace Namespace URI
                })
			}
			//{visibility:false}
		);
		var pry = new OpenLayers.Layer.Vector("parcels",{
                strategies: [new OpenLayers.Strategy.Fixed()],
                projection: new OpenLayers.Projection("EPSG:4326"),
				//styleMap:style,
				styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "#FFFFFF",
                        strokeColor: '#000000',
                        strokeWidth: 1,
                    }),
					"hover":new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "yellow",
                        strokeColor: 'green',
                        strokeWidth: 1,
						label:'${id}',
						labelAlign:'lt',
						fontFamily:'Arial',
						fontSize:10,
                    }),
					"select":new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "yellow",
                        strokeColor: 'black',
                        strokeWidth: 1,
						label:'${id}',
						labelAlign:'lt',
						fontOpacity:0.9,
						fontFamily:'Arial',
						fontSize:10,
                    })
                }),
                protocol: new OpenLayers.Protocol.WFS({
                    version: "1.0.0",
                    url: "http://localhost:8080/geoserver/wfs",
                    featurePrefix: 'gegis', 
                    featureType: "roads", 
                    featureNS: "http://localhost:8080/geoserver/dekut.nyeri", 
                })
			}
			//{visibility:false}
		);
		var sec = new OpenLayers.Layer.Vector("Secondary",{
                strategies: [new OpenLayers.Strategy.Fixed()],
                projection: new OpenLayers.Projection("EPSG:4326"),
				//styleMap:style,
				styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "#000000",
                        strokeColor: '#FF0000',
                        strokeWidth: 1,
                    }),
					"hover":new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "purple",
                        strokeColor: 'black',
                        strokeWidth: 1,
						label:'${Name_of_Sc}',
						labelAlign:'lt',
						fontFamily:'Arial',
						fontSize:10,
                    }),
					"select":new OpenLayers.Style({
                        pointRadius: 6,
                        fillColor: "purple",
                        strokeColor: 'black',
                        strokeWidth: 1,
						label:'${Name_of_Sc}',
						labelAlign:'lt',
						fontOpacity:0.9,
						fontFamily:'Arial',
						fontSize:10,
                    })
                }),
                protocol: new OpenLayers.Protocol.WFS({
                    version: "1.0.0",
                    url: "http://localhost:8080/geoserver/wfs",
                    featurePrefix: '', //geoserver worspace name
                    featureType: "Secondary_Schools", //geoserver Layer Name
                    featureNS: "http://localhost:8080/geoserver/dekut.nyeri", // Edit Workspace Namespace URI
                })
			}
			//{visibility:false}
		);
        map.addLayers([OSM,county,parcels,health,schools,roads]);
        map.setCenter(new OpenLayers.LonLat(-0.56082,36.98256),13 );
		var priStore = Ext.create('GeoExt.data.FeatureStore', {
            layer: pry,
            fields: [
                {name: 'Name', type: 'string'},
                {name: 'ID', type: 'string'},
				{name: 'PARCEL TYPE', type: 'string'},
                {name: 'TYPE', type: 'string'},
            ],
            autoLoad: true
        });
		var secStore = Ext.create('GeoExt.data.FeatureStore', {
            layer: sec,
            fields: [
                {name: 'Name_of_Sc', type: 'string'},
                {name: 'Girls_Boys', type: 'string'},
				{name: 'School_Spo', type: 'string'},
                {name: 'Day_or_Boa', type: 'string'},
            ],
            autoLoad: true
        });
		var healthStore = Ext.create('GeoExt.data.FeatureStore', {
            layer: healths,
            fields: [
                {name: "Name_of_Sc", type: "string"}, 
				{name: "Status_of", type: "string"},
				{name: "Sponsor_of", type: "string"}, 
				{name: "School_Ins", type: "string"}
            ],
            autoLoad: true
        });
		var healthGrid = Ext.create('Ext.grid.GridPanel',{
			store: healthStore,
			autoScroll:true,
			layout:'fit',
			columns: [{header: "Name_of_Sc", flex:0.4, dataIndex: "Name_of_Sc"},
					//{header: "Facility", flex:0.2, dataIndex: "Facility_T"},
					{header: "Status_of", flex:0.2, dataIndex: "Status_of"},
					{header: "Sponsor_of", flex:0.2, dataIndex: "Sponsor_of"},
					{header: "School_Ins", flex:0.2, dataIndex: "School_Ins"}
					],
			stripeRows: true,
			sm: new GeoExt.selection.FeatureModel({
                autoPanMapOnSelection: true,
                mode: 'MULTI'
			}),
			columnLines:true,
			selType: 'featuremodel',
		});
		var secGrid = Ext.create('Ext.grid.GridPanel',{
			store: secStore,
			autoScroll:true,
			layout:'fit',
			columns: [{header: "Name", flex:0.4, dataIndex: "Name"},
					{header: "Donor", flex:0.2, dataIndex: "Donor"},
					{header: "Recipient", flex:0.2, dataIndex: "Recipient"},
					
					],
			tbar:[{
					xtype: 'textfield',
					width:100,
					margin: 2,
					enableKeyEvents: true,
					listeners: {
						keyup: function() {
							var store = this.up('grid').store;
							store.clearFilter();
							if (this.value) {
								store.filter({
									property     : 'Name_of_Sc',
									value         : this.value,
									anyMatch      : true,
									caseSensitive : false
								});
							}
						},
						buffer: 500
					}
				}
			],
			stripeRows: true,
			columnLines:true,
			sm: new GeoExt.selection.FeatureModel({
                autoPanMapOnSelection: true,
                mode: 'MULTI'
			}),
			selType: 'featuremodel',
		});
		var priGrid = Ext.create('Ext.grid.GridPanel',{
			store: priStore,
			autoScroll:true,
			layout:'fit',
			columns: [{header: "ParcelID", flex:0.4, dataIndex: "Facility_N"},
					{header: "ApprovalDate", flex:0.2, dataIndex: "Agency"},
					
					],
			tbar:[{
					xtype: 'textfield',
					width:100,
					margin: 2,
					enableKeyEvents: true,
					listeners: {
						keyup: function() {
							var store = this.up('grid').store;
							store.clearFilter();
							if (this.value) {
								store.filter({
									property     : 'id',
									value         : this.value,
									anyMatch      : true,
									caseSensitive : false
								});
							}
						},
						buffer: 500
					}
				}
			],
			stripeRows: true,
			columnLines:true,
			sm: new GeoExt.selection.FeatureModel({
                autoPanMapOnSelection: true,
                mode: 'MULTI'
			}),
			selType: 'featuremodel',
		});
		var dataPanel = Ext.create('Ext.tab.Panel', {
			activeTab: 0,
			//title:'Data Tables',
			autoHeight:true,
			//layout:'fit',
			items: [
				{
					xtype: 'panel',
					title: 'Land Parcels',
					//id: 'chartpanel',
					layout: 'fit',
					items:[priGrid],
					autoScroll:true,
				},
				{
					xtype: 'panel',
					title: 'HEALTH CENTRE',
					//id: 'chartpanel',
					layout: 'fit',
					items:[secGrid],
					autoScroll:true,
				},
				{
					xtype: 'panel',
					title: 'SCHOOLS',
					//id: 'chartpanel',
					layout: 'fit',
					items:[healthGrid],
					autoScroll:true,
				}
			],
			//renderTo : Ext.getBody()
		}); 
		var gridWindow = new Ext.Window({ 
			closeAction:'hide',
			width:550,
			height: 400,
			minHeight:300,
			minWidth:400,
			draggable: true,
			closable: true,
			titleCollapse:true,
			layout:'fit',
			title: 'Data Tables',
			//layout: 'anchor',
            items: [dataPanel],
			listeners: {
			    onClose: function(){
					map.removeLayers([healths,pry,sec]);
				}
			}
        });
		var legendPanel= Ext.create('Ext.panel.Panel',{
            title:'Map Legend',
            layout:'fit',
			autoScroll:true,
            border:false,
            items:[
                {
                    xtype: "gx_legendpanel",
                    //autoScroll: true,
                    border:false,
                    padding: 5
                }
            ]
        });
		var legend = Ext.create('Ext.window.Window',{
				title: "Layer legend",
				//collapsed: true,
				autoScroll: true,
				//renderTo: Ext.getBody(),
				x:1000,
				y:180,
				closeAction: 'hide',
				collapsible: true,
				titleCollapse:true,
				width:200,
				resizable:false,
				layout: "fit",
				maxHeight:600,
				autoheight: true,
				items: [{
                    xtype: "gx_legendpanel",
                    autoScroll: true,
                    border:false,
                    padding: 5
                }]
			});
        var ctrl, toolbarItems = [], action, actions = {};
        
        // ZoomToMaxExtent control, a "button" control
        action = Ext.create('GeoExt.Action', {
			text:'MaxExtent',
            control: new OpenLayers.Control.ZoomToMaxExtent(),
            map: map,
            icon: "app/icons/arrow_inout.png", 
            tooltip: "zoom to max extent"
        });
        actions["max_extent"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");
       /* //draw zoom box
        action = Ext.create('GeoExt.Action', {
            text:'Zoom',
            control: new OpenLayers.Control.ZoomBox(), 
            map: map, 
            allowDepress: false, 
            icon: "app/icons/zoom.png", 
            tooltip: "Zoom by drawing a box on map", 
            toggleGroup: "navigate", 
            group: "navigate" 
        }); 
        actions["zoom_box"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button', action)); */
        //toolbarItems.push("-"); 
        //zoom in control
        action = Ext.create('GeoExt.Action', {
            text:'Zoom In',
            control: new OpenLayers.Control.ZoomBox({out:false}), 
            map: map, 
            icon: "app/icons/zoom_in.png", 
			allowDepress: false,
            tooltip: "Zoom in" ,
			toggleGroup: "navigate", 
            group: "navigate" 
        }); 
        actions["zoom_box"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action)); 
        toolbarItems.push("-"); 
        //zoom out control
        action = Ext.create('GeoExt.Action', {
            text:'Zoom Out',
            control: new OpenLayers.Control.ZoomBox({out:true}), 
            map: map, 
            icon: "app/icons/zoom_out.png", 
            tooltip: "Zoom out",
			allowDepress: false,
			toggleGroup: "navigate", 
            group: "navigate" ,
			
        }); 
        actions["zoom_out"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action)); 
        toolbarItems.push("-");  
		//pan item
		action = Ext.create('GeoExt.Action', {
			text:'Pan',
            control: new OpenLayers.Control.Navigation(),
            map: map,
            toggleGroup: "navigate", 
            group: "navigate" ,
            icon: "app/icons/pan.png", 
            tooltip: "Pan Map",
			allowDepress:true,
            enableToggle: true
        });
        actions["pan_map"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        toolbarItems.push("-");
        // Navigation history - two "button" controls
        ctrl = new OpenLayers.Control.NavigationHistory();
        map.addControl(ctrl);
        action = Ext.create('GeoExt.Action', {
            text: "Previous",
            control: ctrl.previous,
            disabled: true,
            icon: "app/icons/arrow_left.png", 
            tooltip: "previous action"
        });
        actions["previous"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
        
        action = Ext.create('GeoExt.Action', {
            text: "Next",
            control: ctrl.next,
            disabled: true,
            icon: "app/icons/arrow_right.png", 
            tooltip: "next "
        });
        actions["next"] = action;
        toolbarItems.push(Ext.create('Ext.button.Button', action));
		//identify features
		action = Ext.create('GeoExt.Action', {
			text:'Identify',
			toggleGroup:"navigate",
			group: "navigate",
			icon:'app/icons/information.png',
			handler: function(toggled){
				if (toggled){
					featureinfo.activate();
				}else {
					featureinfo.deactivate();
				}
			},
			allowDepress:true,
            enableToggle: true,
            tooltip: "Click on features to identify"
        });
        actions["select"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action));
        toolbarItems.push("-");
        action = Ext.create('GeoExt.Action', {
            text: "Length",
            toggleGroup:"navigate",
            group: "navigate",
            enableToggle:true,
            allowDepress:false,
            icon:'app/icons/ruler.png',
            map: map,
            control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path , {
				persist:true,
				//immediate:true,
				displaySystem:'metric',
                eventListeners: {
                    measure: function(evt) {
                        Ext.MessageBox.show({
                            title: 'Length Measured',
                            buttons: Ext.MessageBox.OK,
                            width:200,
                            msg:evt.measure.toFixed(2) + " " + evt.units
                        });
                    }
                }
            })
        }); 
        actions["length"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action)); 
        toolbarItems.push("-"); 
        //measure area
        action = Ext.create('GeoExt.Action', {
            text: "area",
            toggleGroup:"navigate",
            group: "navigate",
            enableToggle:true,
            allowDepress:false,
            icon:'app/icons/ruler_square.png',
            map: map,
            control: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon , {
				persist:true,
				//immediate:true,
				displaySystem:'metric',
                eventListeners: {
                    measure: function(evt) {
						Ext.MessageBox.show({
                            title: 'Area Measured',
                            buttons: Ext.MessageBox.OK,
                            width:200,
                            msg:evt.measure.toFixed(2) + " " + evt.units + "²"
                        });
                    }
                }
            })
        }); 
        actions["area"] = action; 
        toolbarItems.push(Ext.create('Ext.button.Button',action)); 
        toolbarItems.push("-"); 
		toolbarItems.push(Ext.create('Ext.button.Button',{
			text: 'Legend',
			icon:'app/icons/legend.png',
			handler: function() {
				legend.show();
			}
		}
		));
		toolbarItems.push("-");
		toolbarItems.push(Ext.create('GeoExt.form.field.GeocoderComboBox',{
					xtype: "gx_geocodercombo",
					layer: locationLayer,
					width: 150
				}
		));
		toolbarItems.push("-");
		toolbarItems.push(Ext.create('Ext.button.Button',{
			text: 'Query',
			icon:'app/icons/query.png',
			handler: function() {
					map.addLayers([healths,pry,sec]);
					gridWindow.show();
			}
		}
		));
		//map panel
		var storeTree = Ext.create('Ext.data.TreeStore',{
            model:'GeoExt.data.LayerTreeModel',
			enableDD: true,
			plugins: [{
				ptype: "gx_treenodecomponent"
			}],
			root: new GeoExt.tree.LayerContainer({
				expanded: true,
                children:[{
					//plugins:['gx_layer'],
                    expanded:true,
					leaf:false,
					singleClickExpand: true,
					qtip: "Double Click to expand/Collapse",
                    text:'Administration',
					children:[{
						plugins:['gx_layer'],
						text:'Municipality',
						layer:county,
						leaf:true,
						onCheckChange:true,
					},

					]
                },
{
					//plugins:['gx_layer'],
                    expanded:true,
					leaf:false,
					singleClickExpand: true,
					qtip: "Double Click to expand/Collapse",
                    text:'Land PARCELS',
					children:[{
						plugins:['gx_layer'],
						text:'parcels',
						layer:parcels,
						leaf:true,
						onCheckChange:true
					}
					]
                },
					
				{
					//plugins:['gx_layer'],
                    expanded:true,
					leaf:false,
					singleClickExpand: true,
					qtip: "Double Click to expand/Collapse",
                    text:'HEALTH CENTRES',
					children:[{
						plugins:['gx_layer'],
						text:'health',
						layer:health,
						leaf:true,
						onCheckChange:true
					}
					]
                },
				{
					//plugins:['gx_layer'],
                    expanded:true,
					leaf:false,
					singleClickExpand: true,
					qtip: "Double Click to expand/Collapse",
                    text:'EDUCATION',
					children:[{
						plugins:['gx_layer'],
						text:'schools',
						layer:schools,
						leaf:true,
						onCheckChange:true
					}
					]
                },
				{
					//plugins:['gx_layer'],
                    expanded:true,
					leaf:false,
					singleClickExpand: true,
					qtip: "Double Click to expand/Collapse",
                    text:'ROADS',
					children:[{
						plugins:['gx_layer'],
						text:'roads',
						layer:roads,
						leaf:true,
						onCheckChange:true
					}
				
					]
                },

				{
                    plugins:['gx_baselayercontainer'],
                    expanded:true,
					singleClickExpand: true,
					qtip: "Double Click to expand/Collapse",
                    text:'BaseMaps'
                }
				]
            })
        });
        var tree = Ext.create('Ext.tree.Panel',{
			title:'Map Layers',
            viewConfig:{
                plugins:[{
                    ptype:'treeviewdragdrop',
                    //appendOnly:false,
					allowDD:true
                }]
            },
            store:storeTree,
			border:false,
            rootVisible:false,
            lines:false
        });
		var mapPanel = Ext.create('GeoExt.panel.Map', {
            title: 'Map Viewer',
            map: map,
            //fallThrough: true,
            region:'center',
			//msg:"Please wait...",
			//plugins:[printExtent],
            tbar:toolbarItems,
			zoom: 4,
			bbar:[scaleCombo,'->',
				{
					xtype:'label',
					text:'Copyright © All Rights Reserved '
				}
			]
        });
		var mywest = new Ext.Panel({
            region:'west',
            split:true,
            collapsible:true,
			animCollapse:true,
            width:'20%',
            layout: 'accordion',
            items:[tree,legendPanel]
        });
		var popup;
        var control = new OpenLayers.Control.WMSGetFeatureInfo({
            autoActivate: true,
            infoFormat: "application/vnd.ogc.gml",
			queryVisible:true,
			//highlightOnly: true,
			maxFeatures:1,
			panMapIfOutOfView:true,
            eventListeners: {
                "getfeatureinfo": function(e) {
					//deletePopup();
						var items = [];
						Ext.each(e.features, function(feature) {
							items.push({
								xtype: "propertygrid",
								title: feature.fid,
								source: feature.attributes
							});
						});
						if (e.features && e.features.length){
						//get all existing popups
						var popups = Ext.WindowMgr.getBy(function(win){return (win instanceof GeoExt.Popup)});
						//kill all existing popups
						popups.forEach(function(popup){popup.destroy()});
						popup = Ext.create('GeoExt.Popup',{
							title: "Feature Information",
							width: 300,
							height: 200,
							//autoSize:true,
							panIn: true,
							autoHeight: true,
							panMapIfOutOfView:true,
							//autoHeight: true,
							maximizable:true,
							//unpinnable:true,
							anchored: true,
							draggable: 'true',
							vertical: true,
							shadow: true,
							layout: "accordion",
							map: mapPanel.map,
							location: e.xy,
							lonlat: mapPanel.map.getLonLatFromPixel(e.xy),
							items:items
						}).show();
					}
                }
            }
        });
		map.addControl(control);
		control.activate();
		Ext.create('Ext.container.Viewport', {
            layout: 'border',
            renderTo: Ext.getBody(),
            items: [mapPanel,mywest,{
                   region:'north',
                    height:120,
                    xtype: 'container',
                    //html: '<h1>MapHero County</h1>',
                    style:"background:url()no-repeat;font-size: 18px; color:#FFFFFF;text-align:center;!important"
                }
                ]  
                    
        });
    
    }
);
