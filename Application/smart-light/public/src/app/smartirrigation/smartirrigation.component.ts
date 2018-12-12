import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import * as moment from 'moment';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var NProgress: any;
var lightData: Object;
var batteryVoltage: Object;
var solarVoltage: Object;
var batteryCharging: Object;
var batteryCurrent: Object;
var solarCurrent: Object;
var batteryDischarging: Object;
var lightStatus: Object;
var deviceHealth: Object;
var ledIndensity: Object;

var chart1: any;
var chart2: any;
var chart5: any;
var chart6: any;


@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/smartirrigation/smartirrigation.component.html'
})

export class SmartIrrigationComponent implements OnInit  {
	public totalTodaydatas: any = {};
	allSitesData: any = {};
	deviceName: string = "home";
	widgetNamesValues: any = {
		thirdWidgetName :"",
		thirdWidgetValue : '',
		fourthWidgetName : "",
		fourthWidgetValue : '',
		fifthWidgetName : " ",
		fifthWidgetValue : 0,
		statusOrIndensityName: ""
	};
	selectedDeviceName: string;
	selectedSiteName: string;
	energyGeneration: number = 0;
	energyConsumed: number = 0;
	enableMaximizeClass: boolean;
	hideChart1: boolean;
	hideChart2: boolean;
	hideChart3: boolean;
	hideChart4: boolean;
	setInnerHeight: number;
	setHeaderHeight: string;
	timeIntervalForRefresh: any;

	constructor(private ajaxService: AjaxService, private router: Router, private route: ActivatedRoute, 
		private variablesService: VariablesService, private location: Location){//"_id.siteName":"site-2"
		this.ajaxService.fetchSelectedObjects('overallFormattedSites',{"query": {},"collection":"today_datas"}).subscribe(totalTodaydatas => {
			this.totalTodaydatas = totalTodaydatas;
		});

	}

	ngOnInit() {
	    NProgress.start();
	    let that  = this;
	    this.variablesService.isFromOverview = true;
		/*let siteName = this.route.snapshot.params.id;
		let deviceName = this.route.snapshot.params.id2;*/

		let siteName = this.variablesService.selctedSiteName;
		let deviceName = this.variablesService.selctedDeviceName;
		this.selectedSiteName = siteName;
		this.selectedDeviceName = this.variablesService.selctedDeviceDisplayName;
		console.log('Device Name : ', this.variablesService.selctedDeviceName);
		let collectionName;
		let siteQueryName: string;
		let deviceHealthData: any;
		if(siteName == undefined && deviceName == undefined) {
			collectionName = "all_sites_data";
		}

		else if(siteName != undefined && deviceName == undefined) {
			collectionName = "site_wise_data";
			siteQueryName = "siteName";
			this.ajaxService.fetchSelectedObjects('getCounts',{"query": {},"collection":"device_details"}).subscribe(totalDeviceCount => {
				
				this.widgetNamesValues.thirdWidgetName = ' No. of Street Lights Installed';
				this.widgetNamesValues.thirdWidgetValue = totalDeviceCount;
			});

			this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName" : siteName},"collection":"live_data"}).subscribe(siteLiveData => {
				calcuateDeviceHealthCount(siteLiveData)
			});
		}

		else if(siteName != undefined && deviceName != undefined) {
			collectionName = "today_data";
			siteQueryName = "siteName";
			console.log('deviceName',deviceName);
			this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"_id.deviceId" : deviceName},"collection":"live_data"}).subscribe(deviceLiveData => {
				calcuateDeviceHealthCount(deviceLiveData);
				this.widgetNamesValues.thirdWidgetName = 'Light Status';
				this.widgetNamesValues.thirdWidgetValue = deviceLiveData[0].lightStatus == '1' ? 'On' : 'Off';

				that.widgetNamesValues.fourthWidgetName = 'Solar Charging';
				that.widgetNamesValues.fourthWidgetValue = deviceLiveData[0].SolarCharging == '1' ? 'On' : 'Off';
			});
		}

		function calcuateDeviceHealthCount(deviceHealthDatas:any){
			let deviceHealthError = 0,
			deviceHealthWarning = 0,
			lightStatusOn = 0,
			lightStatusOff = 0,
			SolarCharging = 0;
			for(let deviceHealthData of deviceHealthDatas ){
				deviceHealthError  += Number(deviceHealthData.Tamper) + Number(deviceHealthData.DeviceTamper) + Number(deviceHealthData.RTCHealth)
												Number(deviceHealthData.SolarHealth) + Number(deviceHealthData.BatteryHelath)+
												Number(deviceHealthData.ledHealth) + Number(deviceHealthData.LDRHealth);
				//deviceHealthWarning += Number(deviceHealthData.ledHealth) + Number(deviceHealthData.LDRHealth);
				
				

				if (deviceHealthData.lightStatus == '1') {
					lightStatusOn += 1;
				}else if ( deviceHealthData.lightStatus == '0' ) {
					lightStatusOff += 1;
				}
			}

			deviceHealth = {
				'Error' : deviceHealthError,
				'Warning' : deviceHealthWarning
			}

			lightStatus = {
				'On' : lightStatusOn,
				'Off' : lightStatusOff,
				'Unknown' : 1
			}

			if(siteName != undefined && deviceName == undefined){
				that.widgetNamesValues.fourthWidgetName = 'No. of Street Lights Online';
				that.widgetNamesValues.fourthWidgetValue = 0;
				for(let liveData of deviceHealthDatas) {
				if (moment(liveData._id.ts).subtract(5, 'hours').subtract(30, 'minutes') > moment().subtract(10, 'hours').subtract(30, 'minutes')){
					console.log(liveData._id.ts);
					that.widgetNamesValues.fourthWidgetValue +=1;

				}
				//console.log('offline',this.overallOfflineDevices);
			}

				//that.widgetNamesValues.fourthWidgetValue = lightStatusOn;
			}else if(siteName != undefined && deviceName != undefined){	
				
			}
			
		}//'siteName' : siteName,"_id.deviceId" : deviceName

		function autoRefresh(){
		    that.ajaxService.fetchSelectedObjects('getFormattedObjects',{"query": {'siteName' : siteName,"_id.deviceId" : deviceName},"collection": collectionName}).subscribe(today_datas => {
				lightData = today_datas;
				console.log('Today data',lightData);

				if(lightData['batteryVoltage'].length > 0 && lightData['ts'].length > 0){

					//that.energyConsumed = Math.trunc(lightData['totalEnergyConsumption']);
					//that.energyGeneration = Math.trunc(lightData['totalEnergyGeneration']);
					that.energyConsumed = lightData['totalEnergyConsumption'].toFixed(2);
					that.energyGeneration = lightData['totalEnergyGeneration'].toFixed(2);

					batteryVoltage = {
						'TimeStamp' : lightData['ts'],
						'Battery Voltage(V)' : lightData['batteryVoltage']
					}
					solarVoltage = {
						'TimeStamp' : lightData['ts'],
						'Solar Voltage(V)' : lightData['solarVoltage']
					}
					batteryCharging = {
						'TimeStamp' : lightData['ts'],
						'Battery Charging' : lightData['batteryCharging']
					}
					batteryCurrent = {
						'TimeStamp' : lightData['ts'],
						'Battery Current(A)' : lightData['batteryCurrent']
					}
					solarCurrent = {
						'TimeStamp' : lightData['ts'],
						'Solar Current(A)' : lightData['solarCurrent']
					}
					batteryDischarging = {
						'TimeStamp' : lightData['ts'],
						'Battery Discharging' : lightData['batteryDischarging']
					}
					
					ledIndensity = {
						'Off' : 100 - lightData['ledIndensity'],
						"On" : lightData['ledIndensity']
					}
					//console.log('energyConsumed', this.energyConsumed);
					loadCharts();
				}
				
			});
		}
		autoRefresh();
		this.timeIntervalForRefresh = setInterval(function(){autoRefresh()},60000)

	    function loadCharts(){
			chart1 = c3.generate({
				bindto: '#chart1',
			    data: {
			    	x:'TimeStamp',
			    	xFormat : '%Y-%m-%d %H:%M:%S',
			        json: batteryVoltage,
			       	type: 'spline',
			       	colors: {
			       		'Battery Voltage(V)':'#00cc00'
			       	}
			    },
			    zoom: {
			        enabled: true
			    },
				legend: {
					show: true
			    },
	    		axis: {
		    		y:{
			            tick: {
			            	count: 0
			            }
				    },
				    x: {
				        type: 'timeseries',
			            tick: {
			                format: '%Y-%m-%d %H:%M:%S',
			                count: 3
			            },
		    		}
		    	}
			});

			chart2 = c3.generate({
				bindto: '#chart2',
			    data: {
			    	x:'TimeStamp',
			    	xFormat : '%Y-%m-%d %H:%M:%S',
			        json: solarVoltage,
			       	type: 'spline',
			       	colors: {
			       		'Solar Voltage(V)': '#00cc00'
			       	}
			    },
			    zoom: {
			        enabled: true
			    },
				legend: {
					show: true
			    },
	    		axis: {
		    		y:{
			            tick: {
			            	count: 0
			            }
				    },
				    x: {
				        type: 'timeseries',
			            tick: {
			                format: '%Y-%m-%d %H:%M:%S',
			                count: 3
			            },
		    		}
		    	}
			});

			let chart3 = c3.generate({
				bindto: '#chart3',
			    data: {
			    	x:'TimeStamp',
			    	xFormat : '%Y-%m-%d %H:%M:%S',
			        json: batteryCharging,
			       	type: 'spline',
			       	colors: {
			       		'Battery Charging': '#4040bf'
			       	}
			    },
			    zoom: {
			        enabled: true
			    },
				legend: {
					show: true
			    },
	    		axis: {
		    		y:{
			            tick: {
			            	count: 0
			            }
				    },
				    x: {
				        type: 'timeseries',
			            tick: {
			                format: '%Y-%m-%d %H:%M:%S',
			                count: 3
			            },
		    		}
		    	}
			});

			chart5 = c3.generate({
				bindto: '#chart5',
			    data: {
			    	x:'TimeStamp',
			    	xFormat : '%Y-%m-%d %H:%M:%S',
			        json: batteryCurrent,
			       	type: 'spline'
			    },
			    zoom: {
			        enabled: true
			    },
				legend: {
					show: true
			    },
	    		axis: {
		    		y:{
			            tick: {
			            	count: 0
			            }
				    },
				    x: {
				        type: 'timeseries',
			            tick: {
			                format: '%Y-%m-%d %H:%M:%S',
			                count: 3
			            },
		    		}
		    	}
			});

			chart6 = c3.generate({
				bindto: '#chart6',
			    data: {
			    	x:'TimeStamp',
			    	xFormat : '%Y-%m-%d %H:%M:%S',
			        json: solarCurrent,
			       	type: 'spline',
					colors: {
					    'Solar Current(A)': '#8c1aff'
					}
			    },
			    zoom: {
			        enabled: true
			    },
				legend: {
					show: true
			    },
	    		axis: {
		    		y:{
			            tick: {
			            	count: 0
			            }
				    },
				    x: {
				        type: 'timeseries',
			            tick: {
			                format: '%Y-%m-%d %H:%M:%S',
			                count: 3
			            },
		    		}
		    	}
			});

			let chart7 = c3.generate({
				bindto: '#chart7',
			    data: {
			    	x:'TimeStamp',
			    	xFormat : '%Y-%m-%d %H:%M:%S',
			        json: batteryDischarging,
			       	type: 'spline',
					colors: {
					    'Battery Discharging': '#b36b00'
					}
			    },
			    zoom: {
			        enabled: true
			    },
				legend: {
					show: true
			    },
	    		axis: {
		    		y:{
			            tick: {
			            	count: 0
			            }
				    },
				    x: {
				        type: 'timeseries',
			            tick: {
			                format: '%Y-%m-%d %H:%M:%S',
			                count: 3
			            },
		    		}
		    	}
			});

			if(siteName != undefined && deviceName != undefined) {
				that.widgetNamesValues.statusOrIndensityName = "LED Intensity";
				let chart8 = c3.generate({
					bindto: '#chart8',
					data: {
						json: ledIndensity,
						type : 'pie',
						colors: {
						    'On': 'green',
						    'Off': 'orange'
						}
					},
					pie: {
					    label: {
					      format: function(value:any, ratio:any, id:any) {
					        return value;
					      }
					    }
					},
				    legend: {
				        position: 'right'
				    }
				});
			}else if(siteName != undefined && deviceName == undefined) {
				that.widgetNamesValues.statusOrIndensityName = "Street Light Status";
				let chart8 = c3.generate({
					bindto: '#chart8',
					data: {
						json: lightStatus,
						type : 'pie'
					},
					pie: {
					    label: {
					      format: function(value:any, ratio:any, id:any) {
					        return value;
					      }
					    }
					},
				    legend: {
				        position: 'right'
				    }
				});
			}
			
	    

		var chart4 = c3.generate({
			bindto: '#chart4',
			data: {
				json: deviceHealth,
				type : 'pie'
			},
			color: {
				pattern: ['#634688', '#7E9C38', '#26829B']
			},
			pie: {
			    label: {
			      format: function(value:any, ratio:any, id:any) {
			        return value;
			      }
			    }
			},
		    legend: {
		        position: 'right'
		    }
		});

		}
		/*var chart8 = c3.generate({
			bindto: '#chart8',
			data: {
				columns: [
				    ['On', 9],
				    ['Off', 45],
				    ['Unknown', 1]
				],
				type : 'pie'
			}
		});*/
	    NProgress.done();
      	
   }

   maximizeChart1(){
    	this.enableMaximizeClass = true;
    	this.hideChart1= false;
    	this.hideChart2= true;
    	this.hideChart3= true;
    	this.hideChart4= true;
    	this.setInnerHeight = 420
    	this.setHeaderHeight = '6%'
    	chart1.resize({height:380, width:1200});   
	}

	maximizeChart2(){
    	this.enableMaximizeClass = true;
    	this.hideChart1= true;
    	this.hideChart2= false;
    	this.hideChart3= true;
    	this.hideChart4= true;
    	this.setInnerHeight = 420
    	this.setHeaderHeight = '6%'
    	chart2.resize({height:380, width:1200});   
	}
	maximizeChart3(){
    	this.enableMaximizeClass = true;
    	this.hideChart1= true;
    	this.hideChart2= true;
    	this.hideChart3= false;
    	this.hideChart4= true;
    	this.setInnerHeight = 420
    	this.setHeaderHeight = '6%'
    	chart5.resize({height:380, width:1200});   
	}
	maximizeChart4(){
    	this.enableMaximizeClass = true;
    	this.hideChart1= true;
    	this.hideChart2= true;
    	this.hideChart3= true;
    	this.hideChart4= false;
    	this.setInnerHeight = 420
    	this.setHeaderHeight = '6%'
    	chart6.resize({height:380, width:1200});   
	}

	mninimize(){
    	this.enableMaximizeClass = false;
    	this.hideChart1= false;
    	this.hideChart2= false;
    	this.hideChart3= false;
    	this.hideChart4= false;
    	this.setInnerHeight = 208
    	this.setHeaderHeight = '12%'
		chart1.resize({height:180, width:300});
		chart2.resize({height:180, width:300});
		chart5.resize({height:180, width:300});
		chart6.resize({height:180, width:300});
	}

	backToPreviousPage(){
		this.location.back();
	}

	ngOnDestroy(){
		clearInterval(this.timeIntervalForRefresh);
	}
    
}
