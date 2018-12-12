import { Observable } from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class VariablesService {

  public login:boolean = false;
  public navbarState:string = "nav-minimized";
  public selectedMenu:string="City Overview";
  data: any;
  public hideChart1: boolean;
  public hideChart2: boolean;
  public hideChart3: boolean;
  public hideTable: boolean;
  public disableMinimize: boolean =true;
  public disableMaximize: boolean;
  public maximizeChart1: boolean;
  public maximizeChart2: boolean;
  public maximizeChart3: boolean;

  public name: string;
  public email: string;
  public companyName: string;
  public password: string;
  public confirm: string;
  public hidePassword: boolean=false;
  public addOrUpdate: string;
  public id: string;
  public filteredReportsData: any;

  public isFromGateway: boolean;
  public selctedSiteGateway: boolean = false;

  public editGateway: boolean;
  public addGateway: boolean;
  public addDevice: boolean;
  public editDevice: boolean;

  public selctedSiteName: string;
  public selctedDeviceName: string;

 public isFromOverview: boolean = false;
 public homeSelectedSiteName: string;
 //public homeSelectedDeviceName: string;
 public homeSelectedRow: any;
 public selctedDeviceDisplayName: string;

 public selctedSiteNameForReports: string;


  //dataChange: Observable<any>;

  constructor() {
   /* this.dataChange = new Observable((observer:Observer) {
      this.dataChange = observer;
    });*/
  }

  setData(data:any) {
    this.data = data;
   // this.dataChange.next(this.data);
  }
}