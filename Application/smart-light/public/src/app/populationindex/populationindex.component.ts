import {Component, OnInit } from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;





@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/populationindex/populationindex.component.html'

})

export class PopulationIndexComponent implements OnInit  {

  public polygons: any[];
  constructor(private ajaxService: AjaxService, private variablesService:VariablesService) {
   
  		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"_id.solution":"PeopleIndex"},"collection":"area_comparison"}).subscribe(people_area => {

            this.polygons = people_area;


        });

		this.variablesService.selectedMenu ="People";

  }

     ngOnInit(){

     	let chart = c3.generate({
     		bindto: '#pichart2',
	    	data: {
		    	x: 'x',
		        columns: [
		        	['x', '2011', '2012', '2013', '2014', '2015', '2016'],
		            ['Male(%)', 55, 57, 52, 59, 55, 60],
		            ['Female(%)', 45, 48, 41, 45, 50,40]
		        ],
		        groups: [
		            ['Male(%)', 'Female(%)']
		        ],
		        type: 'bar',
		        labels: true
		    }
		});


     	var chart1 = c3.generate({
				bindto: '#pichart1',
			    data: {
			        columns: [
			            ['Marriage', 89],
			            ['Divorce', 11]
			        ],
			        type : 'donut',
			        colors: {
		            	'Marriage': '#008000',
		            	'Divorce' : '#E41B17'
		        	},
			    }
			});

     	let chart2 = c3.generate({
			 bindto: '#pichart3',
		    data: {

		        columns: [
		            ['Emirati', 18],
		            ['Other Arab Nations', 10.2],
		            ['Indian', 27],
		            ['Pakistani', 15.3],
		            ['Bangladeshi', 7.5],
		            ['Filipino', 12.7],
		            ['America', 0.3],
		            ['Other Counteries', 6.5]
		           
		        ],
		        type: 'pie'
		        
		    },
		    legend: {
				  show: false
				}
		});



     	 let chart3 = c3.generate({
				bindto: '#pichart4',
			    data: {
			        columns: [
			            ['Permenant Residents', 2213845, 2327350, 2446675],
			            ['Temporary Residents', 1073375, 1081000, 1105500]
			           
			        ],
			        type: 'bar',
			        colors: {
		            	'Permenant Residents': '#808080',
		            	'Temporary Residents' : '#2ca02c'
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
	    		 rotated: true,
	       		 y: {
		            tick: {
		                count: 2
		                
		            }
	        	 },//end of y
		        x: {
		            type: 'category',
		            categories: ['2013', '2014', '2015']
		        }

	    	}
		});

    


     }

}
