import {Component, OnInit,OnDestroy } from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import { Router } from '@angular/router';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var $: any;



@Component({
    selector: 'infrastructure-index',
    templateUrl: './assets/src/app/infrastructureindex/infrastructureindex.component.html'

})

export class InfrastructureIndexComponent implements OnInit  {

  public polygons: any[];
  public tableDatas: any;
  public showCaretSymbol : boolean = true;
  public liveDatas: any[] = [];
  thisSitsDevices: any;
  f_sl:any = 1;
  f_nm: any = 1;
  selectedColumn: number;
  showExpandedDevices: boolean;
  existingSiteName: string;
  prevSelectedRow: any;
  timeIntervalForRefresh: any; 
  timeIntervalForDeviceRefresh: any;
  privilegeDetails: any;
  isAscending: boolean;
  showErrorMsg: boolean = true;
  
  constructor(private ajaxService: AjaxService, private variablesService:VariablesService, private router: Router) {
    this.privilegeDetails = JSON.parse(localStorage.getItem('privilegeDetails'));
   /* this.ajaxService.fetchSelectedObjects('getObjects',{"query": {},"collection":"live_data"}).subscribe(live_data => {
      //this.liveDatas = live_data;
      live_data = live_data.reverse();
      var flags = [], l = live_data.length, i;
      for( i=0; i<l; i++) {
          if( flags[live_data[i].siteName]) continue;
          flags[live_data[i].siteName] = true;
          this.liveDatas.push(live_data[i]);
      }
    });
*/
		this.variablesService.selectedMenu ="Infrastructure";

  }

    ngOnInit(){
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
      },60000)

      if (this.variablesService.isFromOverview) {
        if(this.variablesService.homeSelectedSiteName != undefined && this.variablesService.selctedDeviceName != undefined){
          this.expandDevice(this.variablesService.homeSelectedSiteName, this.variablesService.homeSelectedRow)
          
          //this.variablesService.homeSelectedRow = undefined;      
          }
        this.variablesService.isFromOverview = false;
      }
       
    }

     expandDevice(siteName:string, event:any){
       let that =this;
        this.showExpandedDevices = !this.showExpandedDevices;
        this.showExpandedDevices ? event.target.className = 'caret-rotate-animation' : event.target.className = 'caret-rerotate-animation';
        if (this.showExpandedDevices == true) {
          this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName},"sortingKey":"deviceName","sortingOrder":1,"collection":"live_data"}).subscribe(live_data => {
            this.thisSitsDevices = live_data;
            //this.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));
          });

          this.timeIntervalForDeviceRefresh = setInterval(function(){
            that.ajaxService.fetchSelectedObjects('getObjects',{"query": {"siteName":siteName},"sortingKey":"deviceName","sortingOrder":1,"collection":"live_data"}).subscribe(live_data => {
              this.thisSitsDevices = live_data;
              /*that.thisSitsDevices = [];;
              console.log('live_data',live_data);
              let flags = [], l = live_data.length, i;
              for( i=0; i<l; i++) {
                  if( flags[live_data[i]._id.deviceId]) continue;
                  flags[live_data[i]._id.deviceId] = true;
                  that.thisSitsDevices.push(live_data[i]);
              }
              that.thisSitsDevices.sort((a:any, b:any) => ('' + a.deviceName).localeCompare(b.deviceName));*/
            });
          },60000)
        }
        else if(this.existingSiteName == siteName && !this.showExpandedDevices){
          this.thisSitsDevices=[];
          clearInterval(this.timeIntervalForDeviceRefresh)
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

  //search..
  getSiteName(event:any){
    var filter = event.target.value.toUpperCase();
    var rows = (<HTMLTableElement>document.querySelector("#mytable tbody")).rows;
    
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

  deviceLiveData(siteName:string, deviceId:string, deviceName:string){
    let selectedDevice = {
      'siteName':siteName, 'deviceId':deviceId, 'deviceName':deviceName
    }
    localStorage.setItem('selectedLiveDataDevice', JSON.stringify(selectedDevice))
    this.router.navigateByUrl('liveData');
      
  }

   ngOnDestroy(){
    clearInterval(this.timeIntervalForRefresh);
    clearInterval(this.timeIntervalForDeviceRefresh);

  } 
}
