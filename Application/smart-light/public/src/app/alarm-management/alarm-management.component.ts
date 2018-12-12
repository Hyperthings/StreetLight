import { Component,OnInit } from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import * as moment from 'moment';
declare var c3:any;
declare var NProgress: any;
declare var $: any;


@Component({
	selector: 'alarm-management',
	templateUrl: './assets/src/app/alarm-management/alarm-management.html'
})


export class AlarmManagementComponent implements OnInit{
	//public alarm_histories: any;
	public alarm_histories: Object[] = [];
	public AlarmsDetails: Object[] = [];
	public inchargeDetails: any;
	public alarmHistory: any;
	public selectedInchargeDetails: any;
	  f_sl:any = 1;
	  f_nm: any = 1;
	  selectedColumn: number; 
	  inchargeId: string;
	  inchargeName: string;
	  inchargePhone: string;
	  inchargeEmail: string;
	  popupStatusMessage: string;
	isAlarmHistoryAscending: boolean;
	isInchargeSelected: boolean = true;
	
	constructor(private ajaxService: AjaxService){
		NProgress.start();
		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"isAssigned" : false},"collection":"alarm_history"}).subscribe(alarm_history => {
			//this.alarm_histories = alarm_history
			for (let currentValue of alarm_history) {
				if(currentValue.clearedTime != "-"){
				  	
					let clrearedDateTime = new Date(currentValue.clearedTime);
					let clrearedCurrentData = moment(clrearedDateTime).format("YYYY-MM-DD HH:mm:ss");
					currentValue.clearedTime = clrearedCurrentData;
				}
				if(currentValue.occuredTime != "-"){
				  	let dateTime = new Date(currentValue.occuredTime);
					let currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
					currentValue.occuredTime = currentData;
				}

				this.alarm_histories.push(currentValue);
			}
			this.alarm_histories.reverse()
		});

		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"assignedAlarmDetails"}).subscribe(assignedAlarms => {
			
			for (let currentValue of assignedAlarms) {
				if(currentValue.clearedTime != "-"){
					let clrearedDateTime = new Date(currentValue.clearedTime);
					let clrearedCurrentData = moment(clrearedDateTime).format("YYYY-MM-DD HH:mm:ss");
					currentValue.clearedTime = clrearedCurrentData;
				}
				if(currentValue.occuredTime != "-"){
				  	let dateTime = new Date(currentValue.occuredTime);
					let currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
					currentValue.occuredTime = currentData;
				}
				this.AlarmsDetails.push(currentValue);
			}
			this.AlarmsDetails.reverse()
		});
		NProgress.done();
	}

	

	ngOnInit(){
		
		var alarmOverviewOpen = 0,
			alarmOverviewClosed = 0,
			alarmOverviewAck = 0;
		var alarmSeverityCritical = 0,
			alarmSeverityMajor = 0,
			alarmSeverityMinor = 0,
			alarmSeverityWarning = 0;

		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"alarm_history"}).subscribe(alarm_history => {
		
			var alarmSeverity;
			for (let currentValue of alarm_history) {
				if(currentValue.status == 'Open'){
					alarmOverviewOpen ++;
				}else if(currentValue.status == 'Close'){
					alarmOverviewClosed ++;
				}else{ //Acknowledge
					alarmOverviewAck ++;
				}
				
				if(currentValue.severity == 'Critical'){
					alarmSeverityCritical ++;
				}else if (currentValue.severity == 'Major') {
					alarmSeverityMajor ++;
				}else if (currentValue.severity == 'Minor') {
					alarmSeverityMinor ++;
				}else {
					alarmSeverityWarning ++;
				}
			}
				console.log(alarmOverviewOpen);
			let chart1 = c3.generate({
				bindto: '#chart1',
			    data: {
			        columns: [
			            ['Open', alarmOverviewOpen],
			            ['Closed', alarmOverviewClosed],
			            ['Acknowledge', alarmOverviewAck]
			        ],
			        type: 'pie',
			        colors:{
			        	'Open':'#CC2127',
			        	'Closed':'#5CC44C',
			        	'Acknowledge':'#5C407B'
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

			let chart2 = c3.generate({
				bindto: '#chart2',
			    data: {
			        columns: [
			            ['Critical', alarmSeverityCritical],
			            ['Major', alarmSeverityMajor],
			            ['Minor ', alarmSeverityMinor],
			            ['Warning', alarmSeverityWarning]
			        ],
			        type: 'pie',
			         colors:{
			        	'Critical':'#CC2127',
			        	'Major':'orange',
			        	'Warning':'#FFCC66',
			        	'Minor':'blue'
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

		});

	}

	showIncharge(alarmHistory:any){
		this.alarmHistory = alarmHistory;
		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"incharge_details"}).subscribe(incharge_details => {
			
			this.inchargeDetails = incharge_details;
		});
		this. isInchargeSelected = true;
		$('#myModal').modal('show');
	}

	getInchargeDetails(inchargeDetails:any){
		this.selectedInchargeDetails = inchargeDetails;
		this. isInchargeSelected = false;
	}

	saveAssignedAlarms(inchargeGroup: any){
		var merged = {};
		var _id ={
			"_id" : this.alarmHistory._id,
			"isAssigned" : true,
			"alarmId" : this.alarmHistory.alarmId,
			"alarmName" : this.alarmHistory.alarmName,
			"severity" : this.alarmHistory.severity,
			"description" : this.alarmHistory.description,
			"occuredTime" : this.alarmHistory.occuredTime,
			"clearedTime" : this.alarmHistory.clearedTime,
			"status" : this.alarmHistory.status,
		    "siteName" : this.alarmHistory.siteName,
		    "deviceName" : this.alarmHistory.deviceName,
		}
		var assignedAlarmDetails = {
			"alarmId" : this.alarmHistory.alarmId,
			"alarmName" : this.alarmHistory.alarmName,
			"severity" : this.alarmHistory.severity,
			"occuredTime" : this.alarmHistory.occuredTime,
			"clearedTime" : this.alarmHistory.clearedTime,
			"description" : this.alarmHistory.description,
			"status" : this.alarmHistory.status,
		    "siteName" : this.alarmHistory.siteName,
		    "deviceName" : this.alarmHistory.deviceName,
			"inchargePersonName" : this.selectedInchargeDetails.name,
			"inchargePersonPhNo" : this.selectedInchargeDetails.phNumber,
			"inchargePersonMail" : this.selectedInchargeDetails.mail
		};
		
		this.ajaxService.saveObject(assignedAlarmDetails,"assignedAlarmDetails").subscribe(assignedAlarmDetails => {
	      this.popupStatusMessage = 'Assigned Alarm '+assignedAlarmDetails.message;
	      console.log("_details",assignedAlarmDetails.message);
	      document.getElementById("openAlarmModalButton").click();
	   });

		this.ajaxService.saveObject(_id,"alarm_history").subscribe(alarm_history => {
	      //this.popupStatusMessage = 'Site '+alarm_history.message;
	      console.log("_details",alarm_history.message);
	      //document.getElementById("openModalButton").click();
	   });
		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"assignedAlarmDetails"}).subscribe(assignedAlarms => {
			
			this.AlarmsDetails = [];
			for (let currentValue of assignedAlarms) {
			  	var dateTime = new Date(currentValue.occuredTime);
				var currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
				currentValue.occuredTime = currentData;
				console.log("Cleared ",currentValue.clearedTime);
				if(currentValue.clearedTime != "-"){
					var clrearedDateTime = new Date(currentValue.clearedTime);
					var clrearedCurrentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
					currentValue.clearedTime = clrearedCurrentData;
				}
				

				this.AlarmsDetails.push(currentValue);
				this.AlarmsDetails.reverse()
			}

		});
		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"isAssigned" : false},"collection":"alarm_history"}).subscribe(alarm_history => {
			
			this.alarm_histories = [];
			for (let currentValue of alarm_history) {
			  	var dateTime = new Date(currentValue.occuredTime);
				var currentData = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
				currentValue.occuredTime = currentData;
				this.alarm_histories.push(currentValue);
			}
			this.alarm_histories.reverse()

		});
		this. isInchargeSelected = true;
	}



	getSelectedColumn(selectedColumn:number){
       this.selectedColumn = selectedColumn - 1;
    }

    sortingAlarmHistory(sortingOrder: string, property: string) {
    	this.isAlarmHistoryAscending = !this.isAlarmHistoryAscending; 
    	let direction = (sortingOrder == 'ascending') ? 1 : -1;
	  	this.alarm_histories.sort(function(a, b){
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

	 sortingAssignedAlarm(sortingOrder: string, property: string) {
    	this.isAlarmHistoryAscending = !this.isAlarmHistoryAscending; 
    	let direction = (sortingOrder == 'ascending') ? 1 : -1;
	  	this.AlarmsDetails.sort(function(a, b){
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

  //search..
  	getSiteName(event:any, selectedTable:string){
	    var filter = event.target.value.toUpperCase();
	    let selectedbody =  selectedTable+" tbody";
	    var rows =(<HTMLTableElement> document.querySelector(selectedbody)).rows;
	    
	    for (var i = 0; i < rows.length; i++) {
	        var firstCol = rows[i].cells[0].textContent.toUpperCase();
	        var secondCol = rows[i].cells[1].textContent.toUpperCase();
	        var thirdCol = rows[i].cells[2].textContent.toUpperCase();
	        var fourthCol = rows[i].cells[3].textContent.toUpperCase();
	        var fifthCol = rows[i].cells[4].textContent.toUpperCase();
	        var ninththCol = rows[i].cells[8].textContent.toUpperCase();
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

	        if (this.selectedColumn == 2) {
		        if (thirdCol.indexOf(filter) > -1) {
		            rows[i].style.display = "";
		        } else {
		            rows[i].style.display = "none";
		        }  
	        }

	        if (this.selectedColumn == 3) {
		        if (fourthCol.indexOf(filter) > -1) {
		            rows[i].style.display = "";
		        } else {
		            rows[i].style.display = "none";
		        }  
	        }
	        
	        if (this.selectedColumn == 4) {
		        if (fifthCol.indexOf(filter) > -1) {
		            rows[i].style.display = "";
		        } else {
		            rows[i].style.display = "none";
		        }  
	        }

	        if (this.selectedColumn == 8) {
		        if (ninththCol.indexOf(filter) > -1) {
		            rows[i].style.display = "";
		        } else {
		            rows[i].style.display = "none";
		        }  
	        }       
	    }
   	}

   addIncharge(){
		$('#addIncharge').modal('show');
	}

	/*closeDropdown(){
		let dropDownn = document.getElementsByClassName('dropdown-menu')
		console.log(dropDownn);
		$(dropDownn).hide();
	}*/

	addInchargeDetails(){
		let inchargeDetail = {
			'id': this.inchargeId,
	  		'name': this.inchargeName,
	  		'phNumber': this.inchargePhone,
	 		'mail': this.inchargeEmail
		};
		console.log('inchargeDetail',inchargeDetail);
	 	this.ajaxService.saveObject(inchargeDetail,"incharge_details").subscribe(incharge_details => {
	      	this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"incharge_details"}).subscribe(incharge_details => {
				this.inchargeDetails = incharge_details;
				$('#myModal').modal('show');
			});
	   	});
	 	this.inchargeId = '';
	  	this.inchargeName = '';
	  	this.inchargePhone = '';
	 	this.inchargeEmail = '';
	}

}
