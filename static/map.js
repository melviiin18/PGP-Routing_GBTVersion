Ext.Loader.setConfig({
	disableCaching: false,
	enabled: true,
	paths: {
	    GeoExt:'lib/geoext'
	} 
});


Ext.application({
    name: 'OL3EXT4',
	requires: ['routing'],
    launch: function () {
		
        var mappanel = Ext.create('Ext.panel.Panel', {
            title: 'PGP-Routing',
			width: 100,
			height: 100,
			layout: 'fit',
			region: 'center',
			map: null,
            listeners: {
                afterrender: function () {
					var wh = this.ownerCt.getSize();
					Ext.applyIf(this, wh);


					var pgp_basemap_cache = new OpenLayers.Layer.NAMRIA(
						'NAMRIA Basemap',
						'http://202.90.149.252/ArcGIS/rest/services/Basemap/PGS_Basemap/MapServer',
						{
							isBaseLayer: true
						}
					);


					

					this.map = new OpenLayers.Map(
						// render the map to the body of this panel
						this.body.dom.id,
						{ 
							controls: [
					        	new OpenLayers.Control.Navigation(),
					        	new OpenLayers.Control.LayerSwitcher(),
					        	new OpenLayers.Control.Zoom(),
								new OpenLayers.Control.MousePosition({
									displayProjection: 'EPSG:4326'
								})
							],
							fallThrough: true,
							projection: 'EPSG:900913'
						}
					);

					this.map.addLayers([pgp_basemap_cache]);
					this.map.zoomToMaxExtent();	
					
                },
                // The resize handle is necessary to set the map!
				resize: function () {
                    var size = [document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight];
                    this.map.updateSize(size);
                }
            },
			getMap: function(){
				console.log('getMap', this.map);
				return this.map;
			}
        });
		
		vHeight=Ext.getBody().getViewSize().height
		
		Ext.create('Ext.container.Viewport', {
		    layout: 'border',
		    items: [
				/* {
		        	region: 'north',
		        	html: '<h1 class="x-panel-header">Routing</h1>',
		        	border: false,
		        	margins: '0 0 5 0',
		    	}, */
				
				mappanel,
				
			{
				xtype: 'routing',
		        	region: 'east',
		        	title: 'Routing',
		        	width: 500,					
					split: true,
					mapContainer: mappanel,	
					vHeight:vHeight,					
					hidden: false
				},	
				
			]
		});
		
    }
});

