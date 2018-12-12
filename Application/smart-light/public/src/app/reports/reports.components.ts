import { Component, OnInit } from '@angular/core'
import {Router} from '@angular/router';
import {VariablesService} from './../shared/services/variables.service'
import * as moment from 'moment';
import {AjaxService} from './../shared/services/ajax.service'

declare var $: any;
declare var saveAs: any;
declare var NProgress: any;



@Component({
	selector: 'reports-comonent',
	templateUrl: './assets/src/app/reports/reports.components.html'
})

export class ReportsComponent implements OnInit {
	public dynamicReportDatas :any;
	public reportsData1 :any; 
	public reportsData2 :any; 
	public reportsData3 :any;

	public reportsHeader1 :any;
	public reportsHeader2 :any;
	public reportsHeader3 :any;
	public reportsHeaders :any;

	public showReportsData1 :boolean= true; 
	public showReportsData2 :boolean= false; 
	public showReportsData3 :boolean= false;
	public reportTitle: string = "Monthly Report";
	dailyDatas: any;
	currentTime: any;
	currentUser: string;

	constructor(private ajaxService: AjaxService, private varService: VariablesService, private _router:Router){
		this.dailyDatas = this.varService.filteredReportsData;
		console.log(this.varService.selctedSiteNameForReports);
		/*this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"daily_datas"}).subscribe(dailyDatas => {
			this.dailyDatas = dailyDatas;
		});*/
	}
	ngOnInit(){
		NProgress.start();
		this.currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
		this.currentUser = localStorage.getItem('currentUser');
		console.log(localStorage.getItem('currentUser'))
		//this.reportsHeader1 = ['Date','Energy Generation (kWh)', 'Energy Consumption', 'Solar Voltage', 'Solar Current', 'Battery Voltage', 'Battery Current', 'Battery Charging', 'Battery Consumption', 'Light Status', 'Alarm'];
		//this.reportsHeader2 = ['Year','Energy Generation (kWh)', 'Energy Consumption', 'Solar Voltage', 'Solar Current', 'Battery Voltage', 'Battery Current', 'Battery Charging', 'Battery Consumption', 'Light Status', 'Alarm'];
		this.reportsHeaders = this.reportsHeader1;
		NProgress.done();
	}

	dynamicReports(reportsDtata:string){
		if(reportsDtata == 'reportsDtata1'){
			this.reportsHeaders = this.reportsHeader1;
			this.showReportsData1 = true; 
			this.showReportsData2 = false; 
			this.showReportsData3 = false;
			this.reportTitle = "Monthly Report";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
		}
		else if(reportsDtata == 'reportsDtata2'){
		//this.dynamicReportDatas = this.reportsDtata2;
			this.reportsHeaders = this.reportsHeader2;
			this.showReportsData1 = false; 
			this.showReportsData2 = true; 
			this.showReportsData3 = false;
			this.reportTitle = "Yearly Report"; 
		}

		/*else if(reportsDtata == 'reportsDtata3'){
			this.reportsHeaders = this.reportsHeader3;
			this.showReportsData1 = false; 
			this.showReportsData2 = false; 
			this.showReportsData3 = true;
			this.reportTitle = "Report 3"; 
		}*/
		//console.log('reportsDtata',this.dynamicReportDatas);
		//$(document).ready(function(){
		    $('[data-toggle="tooltip"]').tooltip(); 
		//});
	}
   
   trackByIndex(index:any) {
	    return index;
	}

	exportData(e:any){
		  var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
         /* window.open('data:application/vnd.ms-excel,' + $('#exportable').html());
    	e.preventDefault(); */
	}
}																					