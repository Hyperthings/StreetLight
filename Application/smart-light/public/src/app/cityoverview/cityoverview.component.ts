import {Component, OnInit} from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var NProgress: any;

@Component({
    selector: 'city-overview',
    templateUrl: './assets/src/app/cityoverview/cityoverview.component.html'
})

export class CityOverviewComponent implements OnInit  {

	public devices: any[];

	constructor(private ajaxService: AjaxService, private variablesService:VariablesService){
		/*this.variablesService.selectedMenu ="City Overview";
		this.ajaxService.getObject('getAllObjects/devices').subscribe(devices => {

			this.devices = devices;


		});


		*/


	}

	ngOnInit() {
		NProgress.start();
	    	let chart2 = c3.generate({
	    		
			 bindto: '#chart1',
			  /*size: {
		        height: 370,
		    },*/
		    data: {
		        columns: [
		            ['ActivePower(kW)', 10,26,35,45,60,80,95,101,77,58,39,26,23,8,3],
		            ['POA(w/m2)', 20,90,120,230,350,440,530,520,430,340,250,140,80,20,10],
		            ['Energy(kWh)', 2,5,20,30,42,48,56,62,31,28,24,18,10,6,3],
		             
		           
		        ],
		       type: 'spline',
		       axes: {
		            //data1: 'y',
		            'POA(w/m2)': 'y2'
		        }
		    },
		    point: {
		        show: false
		    },
			 legend: {
					        show: true
		    },
	    	axis: {
	       		 y: {
	           
	            tick: {
	                count: 0
	                
	            }
		        },//end of y
		        y2: {
		            show: true
		        },
		        x: {
		        	tick: {
	                count: 3
	                
	            },
		            type: 'category',
		            categories: [ 6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
		        }

    		}
		});

    	NProgress.done();	
    }


    
}
