import {Component, OnInit} from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;

@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/smartparking/smartparking.component.html'
})

export class SmartParkingComponent implements OnInit  {

	public smart_parking: any[];

	constructor(private ajaxService: AjaxService, private variablesService:VariablesService){

		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"_id.solution":"SmartParking"},"collection":"live_data"}).subscribe(smart_parking => {

			this.smart_parking = smart_parking;


		});
		this.variablesService.selectedMenu ="Smart Parking";
		
	}
    ngOnInit() {
    	let chart = c3.generate({
			 bindto: '#chart1',
		    data: {
		        columns: [
		            ['Parking Occupency', 30, 85, 50,39,55],
		           
		        ],
		        type: 'bar',
		        colors: {
		            'Parking Occupency': '#0aa201'
		        },
		    },
		    bar: {
		        width: {
		            ratio: 0.5 // this makes bar width 50% of length between ticks
		        }
		        // or
		        //width: 100 // this makes bar width 100px
		    },

    	axis: {
       		 y: {
           
            tick: {
                count: 2
                
            }
        },//end of y
        x: {
            type: 'category',
            categories: ['Rex', 'Dubai', 'Abu Park','Jumeirah','HighCity']
        }

    }
		});

    


    let chart2 = c3.generate({
			 bindto: '#chart2',
		    data: {
		        columns: [
		            ['Commercial', 34, 25, 50],
		            ['Residence', 30, 85, 20],
		            ['Mall', 10, 45, 30],
		           
		        ],
		        type: 'bar'
		    },
		    bar: {
		        width: {
		            ratio: 0.5 // this makes bar width 50% of length between ticks
		        }
		        // or
		        //width: 100 // this makes bar width 100px
		    },

    	axis: {
       		 y: {
           
            tick: {
                count: 2
                
            }
        },//end of y
        x: {
            type: 'category',
            categories: ['Day 1', 'Day 2', 'Day 3']
        }

    }
		});

	    	
      	
    }

    
}
