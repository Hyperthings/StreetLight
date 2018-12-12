import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var NProgress: any;

@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/environmentindex/environmentindex.component.html'
})

export class EnvironmentIndexComponent implements OnInit  {

	public liveDatas: any;
	selectedDeviceInfo: any = {_id:{}};
	deviceStatusIcon: boolean;
	selectedDeviceName: string;
	timeIntervalForRefresh: any;

	constructor(private ajaxService: AjaxService, private route: ActivatedRoute, private variablesService: VariablesService){
		
		
	}


	ngOnInit() {
		let that = this

		NProgress.start();
		function autoRefresh(){
			let selectedLiveDataDevice = JSON.parse(localStorage.getItem('selectedLiveDataDevice'));
			console.log('selectedLiveDataDevice',selectedLiveDataDevice)
			let siteName = selectedLiveDataDevice.siteName;
			let deviceName = selectedLiveDataDevice.deviceId;
			//that.selectedSiteName = siteName;
			that.selectedDeviceName = selectedLiveDataDevice.deviceName;
			
			that.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName,"_id.deviceId" : deviceName},"collection":"live_data"}).subscribe(selectedSite => {
				
				if (moment(selectedSite[0].ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(6, 'hours')){
					that.deviceStatusIcon = true;
				}
				that.selectedDeviceInfo = selectedSite[0];
				
	        });
		}

		autoRefresh();
		this.timeIntervalForRefresh = setInterval(function(){
			autoRefresh();
		},60000)
		
	    this.variablesService.isFromOverview = true;

      	NProgress.done();
   	}
   
   	ngOnDestroy(){
   		clearInterval(this.timeIntervalForRefresh);
   	}
    
}
