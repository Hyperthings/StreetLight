import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
//import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker';
import * as moment from 'moment';
import {AjaxService} from './../shared/services/ajax.service'
import {VariablesService} from './../shared/services/variables.service'
declare var NProgress: any;
declare var $: any;



@Component({
	selector: 'reports-filter',
	templateUrl: './assets/src/app/reports-filter/reports-filter.components.html'
})

export class ReportsFilterComponent implements OnInit {
	ts: any;
	siteName: string = 'All Sites';
	deviceName: string = 'All Devices';
	category: string = 'Day';
	selectedCategory: string;
	isDaySelected: boolean = true;
	isMonthSelected: boolean;
	isYearSelected: boolean;
	startDate: any;
	endDate: any;
	liveDatas:any[] = [];
	AllDevices:any[] = [];
	allSites:any[] = [];
		

	/*myDateRangePickerOptions: IMyDrpOptions = {
        dateFormat: 'dd/mm/yyyy'
    };*/

	constructor(private ajaxService: AjaxService, private varService: VariablesService, private _router:Router){
		this.ajaxService.fetchSelectedObjects('getDistinctObjects',{"query": "_id.deviceId","collection":"live_data"}).subscribe(allDevices => {
			this.AllDevices = allDevices;
			this.AllDevices.sort();
		});

		this.ajaxService.fetchSelectedObjects('getDistinctObjects',{"query": "siteName","collection":"live_data"}).subscribe(allSites => {
			this.allSites = allSites;
			this.allSites.sort();
		});


	}

	ngOnInit(){
		NProgress.start();
		/*this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"live_data"}).subscribe(live_data => {
			//this.liveDatas = live_data;

			//for get distinct objects
			var flags = [], l = live_data.length, i;
			for( i=0; i<l; i++) {
			    if( flags[live_data[i]._id.siteName]) continue;
			    flags[live_data[i]._id.siteName] = true;
			    this.allSites. push(live_data[i]._id.siteName);
				this.allSites.sort();
			}

			var deviceFlags = [], l = live_data.length, i;
			for( i=0; i<l; i++) {
			    if( deviceFlags[live_data[i]._id.deviceId]) continue;
			    deviceFlags[live_data[i]._id.deviceId] = true;
			    this.AllDevices. push(live_data[i]._id.deviceId);
				this.AllDevices.sort();
			}
		});*/
		
		let that = this;
		
		$("input").daterangepicker({
		  minDate: moment().subtract(2, 'years'),
		  ranges: {
			  'Last 7 days': [moment().subtract(6, 'days'), moment()],
			  'Last 15 days': [moment().subtract(14, 'days'), moment()],
			  'Last 30 days': [moment().subtract(29, 'days'), moment()]
			},
			periods: ['day','month','quarter','year']
		}, function (startDate:any, endDate:any, period:any) {
		  $(this).val(startDate.format('L') + ' – ' + endDate.format('L'))
		  that.ts =  {
	        	
			    'startDate' : startDate,
			    'endDate' : endDate
			}

		  console.log('startDate',that.ts);
		});

		NProgress.done();
	}


    getSiteName(selectedSitName: string){
    	this.siteName = selectedSitName;
    	//alert(this.siteName);
    	let getSiteDetailsQuery = {}
    	if (this.siteName == 'All Sites') {
    		getSiteDetailsQuery = {};
    	 }else{
    	 	getSiteDetailsQuery = {"siteName": selectedSitName};
    	 } 
    	this.ajaxService.fetchSelectedObjects('getObjects',{"query": getSiteDetailsQuery,"collection":"live_data"}).subscribe(live_data => {
			//this.liveDatas = live_data;

			console.log(live_data)
			this.AllDevices = [];
			var deviceFlags = [], l = live_data.length, i;
			for( i=0; i<l; i++) {
			    if( deviceFlags[live_data[i].deviceName]) continue;
			    deviceFlags[live_data[i].deviceName] = true;
			    this.AllDevices. push(live_data[i].deviceName);
				this.AllDevices.sort();
			}
		});
    }
    getSelectedReports(){
    	
		NProgress.start();
		document.getElementById("openModalButton").click();
		this.varService.selctedSiteNameForReports = this.siteName
	    if(this.siteName == 'All Sites'){
	    	this.siteName = undefined;
	    }
	    if(this.deviceName == 'All Devices'){
	    	this.deviceName = undefined;
	   	}
	    	

	    let selectedCatecories = {
	    	"_id.ts":this.ts,
	    	"siteName" : this.siteName,
			"deviceName" : this.deviceName	
	    }
			console.log(selectedCatecories);

	    this.ajaxService.fetchSelectedObjects('reportsData',{"query": selectedCatecories,"collection":"history"}).subscribe(history => {
			
			console.log(history);
			this.varService.filteredReportsData = history;
			$('#exampleModal').modal('hide');
			this._router.navigate(['/reports']);
		});
		
		NProgress.done();
    }
}																					