import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var jQuery: any;
declare var NProgress: any;
var energyGeneration: any[] = [];
var energyConsumption: any[] = [];
var lightStatus: Object;
var dates: string[] = [];

@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/smartstreet/smartstreet.component.html'
})

export class SmartStreetComponent implements OnInit  {
	public smart_street: any[];
	overallSiteDevices:number = 0;
	overallOnlineDevices: number = 0;
	overallOfflineDevices: number = 0;
	dailyDatas: any[]=[];
	liveDatas: any[]=[];
	alarm_histories: any[]=[];
	constructor(private ajaxService: AjaxService, private variablesService:VariablesService){
		
		this.variablesService.selectedMenu ="Smart Public Space";
	}

    ngOnInit() {
    	NProgress.start();
    	this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"live_data"}).subscribe(liveDatas => {

			this.liveDatas = liveDatas;
			let energyGenerationDatas: number[] = [],
			energyConsumptionDatas: number[] = [],
			on: number = 0,
			off: number = 0;
			for(let liveData of liveDatas) {
				if (moment(liveData.ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(10, 'hours').subtract(30, 'minutes')){
					console.log(liveData.ts);
					this.overallOfflineDevices +=1;

				}else{
					this.overallSiteDevices +=1;
				}
				/*liveData.ts = moment(liveData.ts).format("YYYY-MM-DD HH:mm:ss");
				this.liveDatas.push(liveData)*/
			}
			console.log('liveDatas',this.liveDatas)
			for(let liveData of this.liveDatas) {
				if(liveData.lightStatus == 0){
					off +=1;
				}else if(liveData.lightStatus == 1){
					on +=1;
				}
			}
			lightStatus = {
				"On" : on,
				"Off": off
			}
			


			loadChart();

		});

		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"isAssigned" : false},"collection":"alarm_history"}).subscribe(alarm_history => {
			console.log(alarm_history);
			for (let currentValue of alarm_history) {
				if(currentValue.occuredTime != "-"){
				  	let dateTime = new Date(currentValue.occuredTime);
					let currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
					currentValue.ts = currentData;
				}
				if(currentValue.clearedTime != "-"){
				  	let dateTime = new Date(currentValue.clearedTime);
					let currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
					currentValue.ts = currentData;
				}
				this.alarm_histories.push(currentValue);
			}
			//this.alarm_histories = alarm_history;
			this.alarm_histories = this.alarm_histories.reverse();
			console.log('his.alarm_histories',this.alarm_histories);
			

		});


		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"day_wise_data"}).subscribe(dayWiseData => {
			
			let flags = [], l = dayWiseData.length, i;
			for( i=0; i<l; i++) {
			    if( flags[dayWiseData[i].dateString]) continue;
			    flags[dayWiseData[i].dateString] = true;
			    this.dailyDatas.push(dayWiseData[i]);
			}
			dayWiseData = dayWiseData.sort((a:any, b:any) => ('' + a.dateString).localeCompare(b.dateString));

			let dataArray:string[] = [];
			function formatDate(subtractDate:number){
			 	let datestring;
			 	 datestring = moment().subtract(6 - subtractDate, 'days').format('YYYY'+'MM'+'DD')
			 	 dataArray.push(datestring)
		    	return moment().subtract(6 - subtractDate, 'days').format('YYYY-MM-DD');
		    }
	     	
	     	let lastSevenDaysArray = [];
			for(let i=0; i<7; i++){
				let date = formatDate(i);
				lastSevenDaysArray.push(date)
				let weekDayName =  moment(date).format('dddd');
				dates.push(weekDayName.substring(0, 2))
			}

			this.dailyDatas = this.dailyDatas.sort((a:any, b:any) => ('' + a.dateString).localeCompare(b.dateString));
			energyGeneration = ['Energy Generation (kWh)'];
 			energyConsumption = ['Energy Consumption (kWh)'];
 			//energySaved = ['Energy Saved'];
 			let index = 0;
			for(let dailyData of this.dailyDatas) {
				//energySaved.push(dailyData.EGeneration - dailyData.EConsumption)
				//let datestring = dailyData._id.year+'-'+dailyData._id.month+'-'+dailyData._id.day;
				energyGeneration.push(dailyData.EGeneration)
				energyConsumption.push(dailyData.EConsumption)
				
				index++;
			}
			console.log('energyConsumption', energyGeneration, energyConsumption, dates, this.dailyDatas);
			
			loadEnergyChart();
		});


    	
     	function loadEnergyChart(){
     		
			let chart1 = c3.generate({
		    	bindto: '#chart1',
			    data: {
			        columns: [energyGeneration],
			         types: {
				            'Energy Generation (kWh)': 'bar'
				        },
				         colors: {
				            'Energy Generation (kWh)': '#008000'
				        },
			    },
			    zoom: {
			        enabled: true
			    },
			    axis: {
			        x: {
			            type: 'category',
			            categories: dates
			        }
			    }
			});
			let char2 = c3.generate({
		    	bindto: '#chart2',
			    data: {
			        columns: [energyConsumption],
			         types: {
				            'Energy Consumption (kWh)': 'bar'
				        },
				         colors: {
				            'Energy Consumption (kWh)': '#b36b00'
				        },
			    },
			    zoom: {
			        enabled: true
			    },
			    axis: {
			        x: {
			            type: 'category',
			            categories: dates
			        }
			    }
			});
		}

		function loadChart(){
			var chart3 = c3.generate({
				bindto: '#chart3',
			    data: {
			        json:lightStatus,
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
				}
			});
     	}

			
      	
    	NProgress.done();
    }

    demoSubmit(){
    	
    }

    
}
