import {Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var $: any;

@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/smarttransportation/smarttransportation.component.html'
})

export class SmartTransportationComponent implements OnInit  {

	public smart_transportation: any[];
	public lightControlDevices: any[];
	f_sl:any = 1;
	f_nm: any = 1;
	selectedColumn: number;
  disableSwitch: boolean;
  minutes = new Array(24);
  seconds = new Array(60);
  lightControlData: any;
  firstAlarmTime : number = 0;
  secondAlarmTime : number = 0;
  thirdAlarmTime : number = 0;
  firstAlarmMinute : number = 0;
  secondAlarmMinute : number = 0;
  thirdAlarmMinute : number = 0;
  firstAlarmIndensity: number = 0;
  secondAlarmIndensity: number = 0;
  thirdAlarmIndensity: number = 0;
  pirTimeout: number = 0;
  popupStatusMessage: string;
  popupResponseMessage: any ={};
  selectedSiteName: string;
  timeIntervalForRefresh: any;
  isAscending: boolean;
  pirTimeOutLError: boolean;
  thisSiteGateway: boolean;

	constructor(private ajaxService: AjaxService, private variablesService:VariablesService, private route: ActivatedRoute){
		/*let siteName = this.route.snapshot.params.id;*/
    
   
		
	}
    ngOnInit() {
      let that  = this;
      let siteName = this.variablesService.selctedSiteName;
      this.selectedSiteName = siteName;
      console.log(siteName);

      this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName},"collection":"gateway_details"}).subscribe(gateway_details => {
         console.log(gateway_details.length);
         if(gateway_details.length <= 0){console.log('gateway_details',gateway_details);
           this.thisSiteGateway = true
            this.popupStatusMessage = "No gateways for this Site";
            document.getElementById("openModalButton").click();
         }
      
      });

      this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName},"collection":"light_controls"}).subscribe(light_controls => {
        this.lightControlData = light_controls[0];

        let firstAlarmTimeArray = this.lightControlData.firstAlarmTime.split(':')
        this.firstAlarmTime = Number(firstAlarmTimeArray[0]);
        this.firstAlarmMinute =  Number(firstAlarmTimeArray[1]);

        let secondAlarmArray = this.lightControlData.secondAlarmTime.split(':');
        this.secondAlarmTime = Number(secondAlarmArray[0]);
        this.secondAlarmMinute =  Number(secondAlarmArray[1]);

        let thirdAlarmTimeArray = this.lightControlData.thirdAlarmTime.split(':');
        this.thirdAlarmTime = Number(thirdAlarmTimeArray[0]);
        this.thirdAlarmMinute =  Number(thirdAlarmTimeArray[1]);

        this.firstAlarmIndensity = this.lightControlData.firstAlarmIndensity;
        this.secondAlarmIndensity = this.lightControlData.secondAlarmIndensity;
        this.thirdAlarmIndensity = this.lightControlData.thirdAlarmIndensity;
        this.pirTimeout = this.lightControlData.pirTimeout;
      });

      function autoRefresh(){
        that.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName},"collection":"live_data"}).subscribe(light_control_devices => {

          that.lightControlDevices = light_control_devices;
          let i = 0;
          for(let lightControlDevice of that.lightControlDevices){
            //console.log(moment(lightControlDevice._id.ts)+' date '+moment())
            if (moment(lightControlDevice._id.ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(10, 'hours').subtract(30, 'minutes')){
             
              that.lightControlDevices[i].registerStatus = false;
            }else{
              that.lightControlDevices[i].registerStatus = true;
            } 
            i++;
          }
          console.log('lightControlDevices',that.lightControlDevices)


        });
      }

      autoRefresh()

      this.timeIntervalForRefresh = setInterval(function(){
        autoRefresh()
      },60000)
      
      this.variablesService.selectedMenu ="Smart Transportation";

    }

    timeScheduler(){
   		setTimeout(function(){ alert("Hello"); }, 3000);
   }

    scheduleTime(data:any){
    	console.log(data)
    	setTimeout(function(){ alert("Data Sent"); }, data*1000);
    	//this.timeScheduler();
    }

    getSelectedColumn(selectedColumn:number){
       this.selectedColumn = selectedColumn;
     }

    /* filterLightControl(event:any) {
    var filter = event.target.value.toUpperCase();
    var rows = document.querySelector("#lightControlTable tbody").rows;
    
    for (var i = 0; i < rows.length; i++) {
        var firstCol = rows[i].cells[0].textContent.toUpperCase();
        var secondCol = rows[i].cells[1].textContent.toUpperCase();
        var thirdCol = rows[i].cells[2].textContent.toUpperCase();
        if (firstCol.indexOf(filter) > -1 || secondCol.indexOf(filter) > -1 || thirdCol.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }      
    }
}*/

	/*sortTable(f:any,n:number,sortingOrder:string){
        var rows = $('#lightControlTable tbody  tr').get();

            rows.sort(function(a:any, b:any) {

              var A = getVal(a);
              var B = getVal(b);

              if (sortingOrder == 'descending') {
               if(A < B) {
                return -1*f;
              }
              }
             
             if (sortingOrder == 'ascending') {
              if(A > B) {
                return 1*f;
              }
            }
              return 0;
            });

            function getVal(elm:any){
              var v = $(elm).children('td').eq(n).text().toUpperCase();
              if($.isNumeric(v)){
                v = parseInt(v,10);
              }
              return v;
            }

            $.each(rows, function(index:any, row:any) {
              $('#lightControlTable').children('tbody').append(row);
            });
     }
     sorting(sortingOrder:string){
        this.f_sl *= -1;
              var n = this.selectedColumn //$(this).prevAll().length;
              this.sortTable(this.f_sl,n,sortingOrder);
     }*/

    sorting(sortingOrder: string, property: string) {
      this.isAscending = !this.isAscending; 
      let direction = (sortingOrder == 'ascending') ? 1 : -1;
      this.lightControlDevices.sort(function(a, b){
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
  getSiteName(event:any){
    var filter = event.target.value.toUpperCase();
    var rows = (<HTMLTableElement>document.querySelector("#lightControlTable tbody")).rows;
    
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

        if (this.selectedColumn == 2) {
         if (thirdCol.indexOf(filter) > -1) {
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

  /* updateConfiguredLight(){
     let firstAlarmTimeString = this.firstAlarmTime+':'+this.firstAlarmMinute
     let secondAlarmTimeString = this.secondAlarmTime+':'+this.secondAlarmMinute
     let thirdAlarmTimeString = this.thirdAlarmTime+':'+this.thirdAlarmMinute
     console.log(thirdAlarmTimeString)
    let updatedData = {
      "_id" : this.lightControlData._id,
      "siteName" : this.lightControlData.siteName,
      "firstAlarmTime" : firstAlarmTimeString,
      "secondAlarmTime" : secondAlarmTimeString,
      "thirdAlarmTime" : thirdAlarmTimeString,
      "firstAlarmIndensity" : this.firstAlarmIndensity,
      "secondAlarmIndensity" : this.secondAlarmIndensity,
      "thirdAlarmIndensity" : this.thirdAlarmIndensity,
      "pirTimeout" : this.pirTimeout
    }
    this.ajaxService.saveObject(updatedData,'light_controls').subscribe(light_controls => {
      console.log("light_controls",light_controls)
      this.popupStatusMessage = "Configuration Command Sent Successfully"
      document.getElementById("openModalButton").click();
    });
   }*/

   registerCommand(lightControlDevice:any, event:any, i:number){
     $.blockUI(this.cssObjectForblockUI());
     console.log(lightControlDevice);
     if(event.target.disabled != true){
       document.getElementById("switch-label-id"+i).style.backgroundColor = "orange";
       document.getElementById("switch-label-id"+i).classList.add('disabled');
       event.target.disabled = true; 

      /* setTimeout(function(){
       document.getElementById("switch-label-id"+i).style.backgroundColor = "green";
      }, 5000);*/

         let regData = { //"CommandID": new Date().getTime(), //Unix format as a Unique id 
                        "CommandID":Math.floor(100000000 + Math.random() * 900000000),
                       "Command":"Register", 
                       "MacAddress":lightControlDevice.deviceMacAddress,
                       "SN":lightControlDevice._id.deviceId,
                       //"Status":lightControlDevice.lightStatus,
                       "gatewayMac":lightControlDevice.gatewayName
                     }
       console.log(regData);      
       let regTopic = "HTS/"+lightControlDevice.gatewayName+"/COMMAND/Register";

          this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(register =>{
            this.popupStatusMessage = "Command Sent "+register;
            document.getElementById("openModalButton").click();
            console.log(this.popupStatusMessage);
            if(register == 'Successful'){
              this.ajaxService.registration('registration', {'regData':regData,'regTopic':regTopic}).subscribe(register =>{
               
                  this.popupResponseMessage = register;
                  console.log(this.popupResponseMessage);
                  document.getElementById("openModalResponseButton").click();
                  $.unblockUI();
                  this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":this.selectedSiteName},"collection":"live_data"}).subscribe(light_control_devices => {

                    this.lightControlDevices = light_control_devices;
                    let i = 0;
                    for(let lightControlDevice of this.lightControlDevices){
                      if (moment(lightControlDevice._id.ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(10, 'hours').subtract(30, 'minutes')){
                       
                        this.lightControlDevices[i].registerStatus = false;
                      }else{
                        this.lightControlDevices[i].registerStatus = true;
                      } 
                      i++;
                    }
                    console.log('lightControlDevices',this.lightControlDevices)


                  });
                  if(register == 'Successful'){
                    document.getElementById("switch-label-id"+i).style.backgroundColor = "green";
                  }
               })
            }else{
              $.unblockUI();
            }
          })

         
     }
     
   }

   changeStatusCommand(lightControlDevice:any, event:any, i:number){
     $.blockUI(this.cssObjectForblockUI());
     let selector = '.switch-input'+i+':checked';
     var checkedValue= $(selector).val();
     let status: number;
     checkedValue == 'on' ? status = 1 : status = 0;
     console.log('checkedValue',checkedValue);

     let regData = { //"CommandID": new Date().getTime(), //Unix format as a Unique id
     
                        "CommandID":Math.floor(100000000 + Math.random() * 900000000),
                       "Command":"LEDCONTROL", 
                       "MacAddress":lightControlDevice.deviceMacAddress,
                       "SN":lightControlDevice._id.deviceId,
                       "Status":status,
                       "gatewayMac":lightControlDevice.gatewayName
                     }

                     console.log(lightControlDevice.gatewayName);
       let regTopic = "HTS/"+lightControlDevice.gatewayName+"/COMMAND/LEDCONTROL"; 
       if(lightControlDevice.deviceMacAddress != undefined || lightControlDevice.gatewayName != undefined){

           this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(register =>{
              this.popupStatusMessage = "Command Sent "+register;
              document.getElementById("openModalButton").click();
              console.log(this.popupStatusMessage);

              if(register == 'Successful'){
                this.ajaxService.registration('registration', {'regData':regData,'regTopic':regTopic}).subscribe(register =>{
                 
                   this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":this.selectedSiteName},"collection":"live_data"}).subscribe(light_control_devices => {

                    this.lightControlDevices = light_control_devices;
                    let i = 0;
                    for(let lightControlDevice of this.lightControlDevices){
                      if (moment(lightControlDevice._id.ts).subtract(5, 'hours').subtract(30, 'minutes') < moment().subtract(10, 'hours').subtract(30, 'minutes')){
                       
                        this.lightControlDevices[i].registerStatus = false;
                      }else{
                        this.lightControlDevices[i].registerStatus = true;
                      } 
                      i++;
                    }
                    console.log('lightControlDevices',this.lightControlDevices)


                  });
                  $.unblockUI();
                  this.popupResponseMessage = register;
                  console.log(this.popupResponseMessage);
                    document.getElementById("openModalResponseButton").click();
                })
              }else{
                $.unblockUI();
              }
            })
          
       }else{
         this.popupStatusMessage = "Check Gateway or Device MAC Address";
          document.getElementById("openModalButton").click();
       }
       
   }


  updateConfiguredLight(){
    if(this.pirTimeout > 100 || this.pirTimeout < 30){
      this.pirTimeOutLError = true;
      let that= this;
      setTimeout(function(){ that.pirTimeOutLError = true; }, 3000);
    }else{
     $.blockUI(this.cssObjectForblockUI());
     let firstAlarmTimeString = (this.firstAlarmTime < 10 ? 0+''+this.firstAlarmTime : this.firstAlarmTime)+''+(this.firstAlarmMinute < 10 ? 0+''+this.firstAlarmMinute :this.firstAlarmMinute);
     let secondAlarmTimeString = (this.secondAlarmTime < 10 ? 0+''+this.secondAlarmTime : this.secondAlarmTime)+''+(this.secondAlarmMinute < 10 ? 0+''+this.secondAlarmMinute :this.secondAlarmMinute)
     let thirdAlarmTimeString = (this.thirdAlarmTime < 10 ? 0+''+this.thirdAlarmTime : this.thirdAlarmTime)+''+(this.thirdAlarmMinute < 10 ? 0+''+this.thirdAlarmMinute :this.thirdAlarmMinute)
    
    /*let updatedData = {
      "_id" : this.lightControlData._id,
      "siteName" : this.lightControlData.siteName,
      "firstAlarmTime" : firstAlarmTimeString,
      "secondAlarmTime" : secondAlarmTimeString,
      "thirdAlarmTime" : thirdAlarmTimeString,
      "firstAlarmIndensity" : this.firstAlarmIndensity,
      "secondAlarmIndensity" : this.secondAlarmIndensity,
      "thirdAlarmIndensity" : this.thirdAlarmIndensity,
      "pirTimeout" : this.pirTimeout
    }*/

    //this.popupStatusMessage = "Command Sent Successfully ";
    //document.getElementById("openModalButton").click();
    this.ajaxService.registration('mqttOnlineStatus', {}).subscribe(register =>{
      this.popupStatusMessage = "Command Sent "+register;
      document.getElementById("openModalButton").click();
      console.log(this.popupStatusMessage);
      if(register == 'Successful'){
          let thisSiteGateways: any[];
          this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName" : this.selectedSiteName},"collection":"gateway_details"}).subscribe(gateway_details => {

            thisSiteGateways = gateway_details;
                console.log('gateway_details',gateway_details)

             for (let thisSiteGateway of thisSiteGateways){

                let regData = { //"CommandID": new Date().getTime(), //Unix format as a Unique id

                                  "CommandID":Math.floor(100000000 + Math.random() * 900000000),
                                   "Command":"DeviceConfiguration", 
                                   "SetDimTimeOne":firstAlarmTimeString,
                                   "SetDimPercentageOne": this.firstAlarmIndensity,
                                   "SetDimTimeTwo " : secondAlarmTimeString,
                                   "SetDimPercentageTwo" : this.secondAlarmIndensity,
                                   "SetDimTimeThree " : thirdAlarmTimeString,
                                    "SetDimPercentageThree" : this.thirdAlarmIndensity,
                                    "SetPIRTimeOut" : this.pirTimeout,  
                                   //"MacAddress":lightConfigurationData._id.deviceMacAddress,
                                   //"DeviceId":lightConfigurationData._id.deviceId,
                                   //"Status":lightConfigurationData.lightStatus,
                                   "gatewayMac": thisSiteGateway.gatewayName
                                 }

                                 
                console.log('updatedData',regData)

               let regTopic = "HTS/"+thisSiteGateway.gatewayName+"/COMMAND/CONFIG"; 
               this.ajaxService.registration('registration', {'regData':regData,'regTopic':regTopic}).subscribe(register =>{
                 $.unblockUI();
                  this.popupResponseMessage = register;
                  console.log(this.popupResponseMessage);
                  document.getElementById("openModalResponseButton").click();
               })
          }
          });     
      }else{
        $.unblockUI();
      }
    })
   
   }
  } 

   preventInput(event:any){
    /*let value=this.pirTimeout;
    if (value >= 101){
      event.preventDefault()
      this.pirTimeout = 100;
    }else if (value <= 29){
      event.preventDefault()
      this.pirTimeout = 30;
    }*/

     if(this.pirTimeout > 100 || this.pirTimeout < 30){
      this.pirTimeOutLError = true;
    }else{
      this.pirTimeOutLError = false;
    }
  }

  cssObjectForblockUI(){
    return { 
      css: { 
        border: 'none', 
        padding: '15px', 
        backgroundColor: '#000', 
        '-webkit-border-radius': '10px', 
        '-moz-border-radius': '10px', 
        opacity: .5, 
        color: '#fff' 
      } 
    }
  }

  ngOnDestroy(){
    clearInterval(this.timeIntervalForRefresh);
  } 
}
