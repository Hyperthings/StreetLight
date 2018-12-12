import {Component, OnInit} from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;

@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/smartbuilding/smartbuilding.component.html'
})

export class SmartBuildingComponent implements OnInit  {

	public smart_building: any[];

	constructor(private ajaxService: AjaxService, private variablesService:VariablesService){

		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"_id.solution":"SmartBuilding"},"collection":"live_data"}).subscribe(smart_building => {

			this.smart_building = smart_building;


		});
		this.variablesService.selectedMenu ="Smart Buildings";
		
	}
    ngOnInit() {
    	let chart1 = c3.generate({
			 bindto: '#chart1',
		    data: {
		        columns: [
		            ['HVAC', 40],
		             ['Lighting', 50],
		              ['Others', 10],
		           
		        ],
		        type: 'pie'
		    }
		});
    


    let chart2 = c3.generate({
			 bindto: '#chart2',
		    data: {
		        columns: [
		            ['AHU', 34, 25, 50],
		            ['Chiller', 30, 85, 20],
		            ['Other', 10, 45, 30],
		           
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
