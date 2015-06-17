var routes;

	
Ext.define('routemodel',{
				extend: 'Ext.data.Model',
				fields: [					
					
					    {name: 'route', type: 'string'}	
						
				
				
				]
			});

var store = new Ext.data.ArrayStore({
        model:routemodel
    });
	
Ext.define('routing',{
	extend: 'Ext.panel.Panel',	
	title: 'Routing',
	alias: 'widget.routing',
	height: '100%',
	width: 300,		
	vHeight:'',
	display: function(route,index){
				
				console.log(route.routes[index]);
				
					var line = new OpenLayers.Geometry.LineString();
					var vectorLayer = new OpenLayers.Layer.Vector("vectorLayer");
					var x = this.mapContainer.map.getLayersByName('vectorLayer');
					
					
					
					
					if(x.length>0)
					{
						
						x[0].destroy();
					}
					
					var Origin
					console.log(route.routes[index].overview_path);
					for (var i in route.routes[index].overview_path) {
							var point = new OpenLayers.Geometry.Point(route.routes[index].overview_path[i].F,route.routes[index].overview_path[i].A).transform("EPSG:4326","EPSG:900913");																												
							line.addPoint(point);
							//console.log(point);																													
						  }
						//console.log('line-----', line) 
						
						var Origin = line.components[0]				
						var lastIndex = route.routes[index].overview_path.length	
						var destination = line.components[lastIndex-1]
						//console.log('ORIGIN----',);
						
						var steps = Ext.ComponentQuery.query('#panelDirections')[0];  
						var str ='';
					  for (var i in route.routes[index].legs[0].steps) {
						str=str +  route.routes[index].legs[0].steps[i].instructions  +  ' '  + route.routes[index].legs[0].steps[i].distance.text   + '<br>'
						
						}
						
						
						//steps.html=str;
						
						steps.update(str);
						
						
						
					var style = { 
					  strokeColor: '#0000ff', 				  
					  strokeWidth: 4
					};						
					
					var style2 = {
						externalGraphic: "./icons/origin.png",				
						graphicYOffset: -25,
						graphicHeight: 35,		
						graphicTitle:'Origin',						
					}
					
					var style3 = {
						externalGraphic: "./icons/destination.png",				
						graphicYOffset: -25,
						graphicHeight: 35,		
						graphicTitle:'Destination',						
					}
					
					var lineFeature = new OpenLayers.Feature.Vector(line, null, style);									
					Origin =new OpenLayers.Feature.Vector(Origin, null, style2);	
					destination =new OpenLayers.Feature.Vector(destination, null, style3);	
					//vectorLayer.addFeatures([lineFeature]);	  
					vectorLayer.addFeatures([lineFeature, Origin,destination]);	  

		
				this.mapContainer.map.addLayer(vectorLayer);
				this.mapContainer.map.zoomToExtent(vectorLayer.getDataExtent()); 	
	
	},	
	
	initComponent: function(){
		
		var me = this;
		var dHeight=this.vHeight-285;		
		Ext.apply(me,{
			
					items: 	[{
							xtype:'panel',
							name:'xcxx',
							height:135,
							padding: 10,
							border: false,
							layout: {
								type: 'vbox',
								align: 'stretch',
							},
							items:[
								{
									xtype: 'textfield',									
									fieldLabel: '<img STYLE="position:absolute; TOP:2px; LEFT:75px; WIDTH:25px; HEIGHT:25px" src="./icons/origin.png" class="info_image" data-qtip="your help text or even html comes here...."></img>Origin',																																													
									labelWidth: 100,										
									width: 70,									
									emptyText: 'NAMRIA, Taguig | 14.00 121.00 ',
									margin: 5,
									itemId: 'txtOrigin'
									
								},
								{
									xtype: 'textfield',
									fieldLabel: '<img STYLE="position:absolute; TOP:2px; LEFT:75px; WIDTH:25px; HEIGHT:25px" src="./icons/destination.png" class="info_image" data-qtip="your help text or even html comes here...."></img> Destination ',
									labelWidth: 100,
									width: 70,
									emptyText: 'UP Diliman, Quezon City | 14.00 121.00 ',
									margin: 5,
									itemId: 'txtDestination'
									
									
								}
							
							],
													
							
							buttons:[
								{
									text: 'Go',
									handler: function(){
										
										
										console.log( 'size----',Ext.getBody().getViewSize().height);		
										
										var x = me.mapContainer.map.getLayersByName('vectorLayer');
										if(x.length>0)
										{
											
											x[0].destroy();
										}
										//var map = new google.maps.Map(document.getElementById("map-canvas"),apOptions);
										//var directionsDisplay;	
										//directionsDisplay = new google.maps.DirectionsRenderer();	
										
										var directionsService = new google.maps.DirectionsService();	
										//directionsDisplay.setMap(map);
										// var namria ='NAMRIA, PH';//new google.maps.LatLng(14.535457,121.040864);
										// var market = 'Pinagsama, Taguig'//new google.maps.LatLng(14.55027, 121.055976);
										
										
										var origin = this.up('panel').down('#txtOrigin').getValue();	
										var destination=this.up('panel').down('#txtDestination').getValue();	
										var request = {
											origin:origin,
											destination:destination,
											travelMode: google.maps.TravelMode.DRIVING,
											optimizeWaypoints: true,
											provideRouteAlternatives: true
										  };
										  
										  directionsService.route(request, function(result, status) {											
											if (status == google.maps.DirectionsStatus.OK) {												
												 
												 var line = new OpenLayers.Geometry.LineString();
												 var vectorLayer = new OpenLayers.Layer.Vector("vectorLayer");
											
												
												
												
												var myarray =[];												
												for (var i in result.routes)
												{
													myarray.push([result.routes[i].summary]);
													
												}
												 
												 store.loadData(myarray);
												 
												 routes=result;
												 me.display(routes,0);
												  //for (var i in result.routes[0].overview_path) {
														//var point = new //OpenLayers.Geometry.Point(result.routes[0].overview_path[i].B,result.routes[0].overview_path[i].k).transform("EPS//G:4326","EPSG:900913");
														//line.addPoint(point);
														
													//  }
													  
												//var style = { 
												//  strokeColor: '#0000ff', 				  
												//  strokeWidth: 4
												//};						
												
												//var lineFeature = new OpenLayers.Feature.Vector(line, null, style);									
												//vectorLayer.addFeatures([lineFeature]);	  

												//me.mapContainer.map.addLayer(vectorLayer);
													//  me.mapContainer.map.zoomToExtent(vectorLayer.getDataExtent()); 	
												}
											
											else
											{
												Ext.Msg.alert("Result","no result");
											
											}
											
											
											
											
										  });
									}
									
								}
							]
							
				      },
					{
						xtype:'grid',
						title:'Alternate Routes',
						store:store,
						columns: [
							{id:'route',width: '100%', sortable: true, dataIndex: 'route'},
							
						],
						hideHeaders: true, 
						stripeRows: true,
						autoExpandColumn: 'route',
						height:150,
						width:600,
						listeners: {
							select: function(selModel, record, index, options) {
							
							  me.display(routes,index);    
							
						}
						}

						
					
					},
					{
						xtype:'panel',
						title:'Directions',						
						itemId:'panelDirections',
						//autoScroll:true,
						height:dHeight,
						overflowY:'scroll',						
						flex:1,
						layout:'fit',						
						border:true
						
					}
					
					
					]					  
					  
					  
					  
		}			  
		)
		
		this.callParent();
	}	
});			