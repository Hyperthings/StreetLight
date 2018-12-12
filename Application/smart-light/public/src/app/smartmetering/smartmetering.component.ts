import {Component, OnInit, OnDestroy} from '@angular/core';
import * as moment from 'moment';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var d3: any;
declare var NProgress: any;
declare var $:any;
var chart1: any;
var chart2: any;
var chart3: any;
//var genarationData: Object;
var energyGeneration: any[] = [];
var energyConsumption: any[] = [];
var energySaved: any[] = [];
var months: string[] = [];
@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/smartmetering/smartmetering.component.html'
})

export class SmartMeteringComponent implements OnInit  {
	public tableDatas:any;
	public liveDatas: any[]=[];
	public monthlyDatas: any;
	public thisSitsDevices: any[]=[];
	showExpandedDevices: boolean = false;
  	f_sl:any = 1;
  	f_nm: any = 1;
  	selectedColumn: number; 
  	existingSiteName: string;
	prevSelectedRow: any;
	timeIntervalForRefresh: any;
	timeIntervalForDeviceRefresh: any;
	privilegeDetails: any;
	isAscending: boolean;
	//selectedSite: string;
	//selectedRow:any;
		
	constructor(private ajaxService: AjaxService, private variablesService:VariablesService){
		this.privilegeDetails = JSON.parse(localStorage.getItem('privilegeDetails'));
		console.log(this.privilegeDetails);
	}

    ngOnInit() {
    	NProgress.start();
    	let that = this;
    	function autoRefresh(){
			that.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"live_data"}).subscribe(live_data => {
				
				//for get distinct objects
        		that.liveDatas = [];
				//live_data = live_data.reverse();
				let flags = [], l = live_data.length, i;
				for( i=0; i<l; i++) {
				    if( flags[live_data[i].siteName]) continue;
				    flags[live_data[i].siteName] = true;
				    that.liveDatas.push(live_data[i]);
				}
				console.log(that.liveDatas);
			});
		}

      	autoRefresh()

     	this.timeIntervalForRefresh = setInterval(function(){
	    	autoRefresh()
	    	/*that.expandDevice(that.selectedSite, that.selectedRow);
	    	this.showExpandedDevices = false*/
	    	/*that.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":that.selectedSite},"collection":"live_data"}).subscribe(live_data => {
				//this.thisSitsDevices = live_data;
				that.thisSitsDevices = [];
				console.log('live_data',live_data);
				let flags = [], l = live_data.length, i;
			for( i=0; i<l; i++) {
			    if( flags[live_data[i]._id.deviceId]) continue;
			    flags[live_data[i]._id.deviceId] = true;
			    that.thisSitsDevices.push(live_data[i]);
			}
			that.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));
			});*/
	    },60000)

    	console.log('URL history',this.variablesService.homeSelectedSiteName, this.variablesService.homeSelectedRow);
    	//Auto expand of previus selected device
    	if (this.variablesService.isFromOverview) {
    		if(this.variablesService.homeSelectedSiteName != undefined && this.variablesService.selctedDeviceName != undefined){
				this.expandDevice(this.variablesService.homeSelectedSiteName, this.variablesService.homeSelectedRow)
				
				//this.variablesService.homeSelectedRow = undefined;			
    		}
			this.variablesService.isFromOverview = false;
		}

    	
    	$('.collapse').on('show.bs.collapse', function () {
		    $('.collapse.in').collapse('hide');
		});

		function formatDate(subtractDate:number){
     		return moment().subtract(subtractDate, 'days').format('YYYY-MM-DD');
     	}

     	var today = formatDate(0);
     	var beforeDay = formatDate(1);
     	var beforeTwoDays = formatDate(2);
     	var beforeThreeDays = formatDate(3);
     	var beforeFourDays = formatDate(4);
     	var beforeFiveDays = formatDate(5);
     	var beforeSixDays = formatDate(6);

     	/*this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"monthly_datas"}).subscribe(monthly_datas => {
			this.monthlyDatas = monthly_datas;
			this.monthlyDatas.reverse();
			energyGeneration = ['Energy Generation'];
 			energyConsumption = ['Energy Consumption'];
 			energySaved = ['Energy Saved'];
 			months = [];
			for(let monthlyData of this.monthlyDatas) {
				energyGeneration.push(monthlyData.energyGeneration)
				energyConsumption.push(monthlyData.energyConsumption)
				energySaved.push(monthlyData.energyGeneration - monthlyData.energyConsumption)
				//let date = moment(monthlyData.date)['_i'];
				months.push(monthlyData.month.slice(0, 3))
			}
			loadChart();
		});*/

		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"month_wise_data"}).subscribe(month_wise_data => {
			
			month_wise_data.sort((a:any, b:any) => parseFloat(a.dateString) - parseFloat(b.dateString));
			/*month_wise_data.sort(function(a:any,b:any) {
			    a = a.dateString.split("-");
			    b = b.dateString.split("-")
			    return new Date(a[1], a[0], 1) - new Date(b[1], b[0], 1)
			});*/
			console.log(month_wise_data);
			let monthString = [
					    'Jan', 'Feb', 'Mar', 'Apr', 'May',
					    'Jun', 'Jul', 'Aug', 'Sep',
					    'Oct', 'Nov', 'Dec'
				    ];
			energyGeneration = ['Energy Generation'];
 			energyConsumption = ['Energy Consumption'];
 			energySaved = ['Energy Saved'];
 			months=[];
			for(let monthlyData of month_wise_data) {
				energyGeneration.push(monthlyData.EGeneration)
				energyConsumption.push(monthlyData.EConsumption)
				energySaved.push(monthlyData.EGeneration - monthlyData.EConsumption)
				console.log(monthString[0]);
				months.push(monthString[monthlyData._id.month - 1])
			}
			//months.reverse();
			console.log('months',months)
			loadChart();
		});

		function loadChart(){
			chart1 = c3.generate({
		    	bindto: '#chart1',
			    data: {
			        columns: [energyGeneration],
			         types: {
				            'Energy Generation': 'bar'
				        },
				         colors: {
				            'Energy Generation': '#008000'
				        },
			    },
			    zoom: {
			        enabled: true
			    },
			    axis: {
			        x: {
			            type: 'category',
			            categories: months
			        }
			    }
			});

			chart2 = c3.generate({
		    	bindto: '#chart2',
			    data: {
			        columns: [energyConsumption],
			         types: {
				            'Energy Consumption': 'area-spline'
				        },
				         colors: {
				           'Energy Consumption': '#00a3cc'
				        },
			    },
			    zoom: {
			        enabled: true
			    },
			    axis: {
			        x: {
			            type: 'category',
			            categories: months
			        }
			    }
			});

			chart3 = c3.generate({
		    	bindto: '#chart3',
			    data: {
			        columns: [energySaved],
			         types: {
				            'Energy Saved': 'bar'
				        },
				         colors: {
				            'Energy Saved': '#0040ff'
				        },
			    },
			    axis: {
			        x: {
			            type: 'category',
			            categories: months
			        }
			    }
			});

		}

			
		NProgress.done();
	};
    
	maximizeChart1(){
    	this.variablesService.hideChart1= true;   	
    	this.variablesService.hideChart3= true;
    	this.variablesService.hideTable=true;
		this.variablesService.maximizeChart2= true;
		this.variablesService.disableMinimize= false;
		this.variablesService.disableMaximize= true;
		chart1.resize({height:530, width:1000});
	}
    maximizeChart2(){
    	this.variablesService.hideChart2= true;
    	this.variablesService.hideChart3= true;
    	this.variablesService.hideTable=true;
		this.variablesService.maximizeChart1= true;
		this.variablesService.disableMinimize= false;
		this.variablesService.disableMaximize= true;
		chart2.resize({height:530, width:1000});
	}

	maximizeChart3(){
    	this.variablesService.hideChart1= true;
    	this.variablesService.hideChart2= true;
    	this.variablesService.hideTable=true;
		this.variablesService.maximizeChart3= true;
		this.variablesService.disableMinimize= false;
		this.variablesService.disableMaximize= true;
		chart3.resize({height:530, width:1000});
	}
	
	mninimize(){
		this.variablesService.hideChart1= false;
    	this.variablesService.hideChart2= false;
    	this.variablesService.hideChart3= false;
    	this.variablesService.hideTable=false;
    	this.variablesService.maximizeChart1= false;
    	this.variablesService.maximizeChart2= false;
    	this.variablesService.maximizeChart3= false;
		this.variablesService.disableMinimize= true;
		this.variablesService.disableMaximize= false;
		//chart1.load({url: '/src/app/smartmetering/data/genaration.json'});
		chart1.resize({height:250, width:400});
		chart2.resize({height:250, width:400});
		chart3.resize({height:250, width:400});

	}

	expandDevice(siteName:string, event:any){
		let that = this;
		this.showExpandedDevices = !this.showExpandedDevices;
		if(event){
			this.showExpandedDevices ? event.target.className = 'caret-rotate-animation' : event.target.className = 'caret-rerotate-animation';
		}
		
		if (this.showExpandedDevices == true) {
			//function autoRefreshForDevice(){}
			this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName},"collection":"live_data"}).subscribe(live_data => {
				this.thisSitsDevices = live_data;
				/*console.log('live_data',live_data);
				let flags = [], l = live_data.length, i;
			for( i=0; i<l; i++) {
			    if( flags[live_data[i]._id.deviceId]) continue;
			    flags[live_data[i]._id.deviceId] = true;
			    this.thisSitsDevices.push(live_data[i]);
			}*/
			//this.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));
			});

			this.timeIntervalForDeviceRefresh = setInterval(function(){
				that.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName},"collection":"live_data"}).subscribe(live_data => {
					this.thisSitsDevices = live_data;
					/*that.thisSitsDevices = [];;
					console.log('live_data',live_data);
					let flags = [], l = live_data.length, i;
					for( i=0; i<l; i++) {
					    if( flags[live_data[i]._id.deviceId]) continue;
					    flags[live_data[i]._id.deviceId] = true;
					    that.thisSitsDevices.push(live_data[i]);
					}*/
					//that.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));
				});
			},60000)
		}
		else if(this.existingSiteName == siteName && !this.showExpandedDevices){
			this.thisSitsDevices=[];
			clearInterval(this.timeIntervalForDeviceRefresh);
		}

		if(this.showExpandedDevices == false && this.prevSelectedRow != event){
			this.thisSitsDevices=[];
			clearInterval(this.timeIntervalForDeviceRefresh)
        	this.variablesService.homeSelectedRow.target.className = 'caret-rerotate-animation';
        }
        this.prevSelectedRow = event;
		this.existingSiteName = siteName;
		this.variablesService.homeSelectedSiteName = siteName;
		this.variablesService.homeSelectedRow = event;
	}

	/*existingExpandedDevice(){
		this.expandDevice(this.existingSiteName, this.prevSelectedRow)
	}*/



	getSelectedColumn(selectedColumn:number){
       this.selectedColumn = selectedColumn - 1;
     }

    
    sorting(sortingOrder: string, property: string) {
    	this.isAscending = !this.isAscending; 
    	let direction = (sortingOrder == 'ascending') ? 1 : -1;
	  	this.liveDatas.sort(function(a, b){
	  		if(sortingOrder == 'descending'){
	  			if(a[property] < b[property]){
		            return -1 * direction;
		        } else{
		            return 0;
		        }
	  		}

	  		if(sortingOrder == 'ascending'){
	  			if( a[property] > b[property]){
		            return 1 * direction;
		        }else{
		            return 0;
		        }
	  		}
    	});
	}

	trackByUniqueId(index: number, value: any): any {
	  return value.siteName + value.ts; 
	}
  //search..
  getSiteName(event:any){
    var filter = event.target.value.toUpperCase();
    var rows =(<HTMLTableElement> document.querySelector("#portfolio-table tbody")).rows;
    
    for (var i = 0; i < rows.length; i++) {
        var firstCol = rows[i].cells[0].textContent.toUpperCase();
        var secondCol = rows[i].cells[1].textContent.toUpperCase();
        var thirdCol = rows[i].cells[2].textContent.toUpperCase();
        if (this.selectedColumn == 0) {
         if (firstCol.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }  
        }

        if (this.selectedColumn == 1) {
         if (secondCol.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }  
        }
/*
        if (this.selectedColumn == 0) {
         if (firstCol.indexOf(filter) > -1 || secondCol.indexOf(filter) > -1 || thirdCol.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }  
        }*/
            
    }
   }

   ngOnDestroy(){
    clearInterval(this.timeIntervalForRefresh);
  } 
}
