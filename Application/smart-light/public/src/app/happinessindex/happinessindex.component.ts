import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;

@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/happinessindex/happinessindex.component.html'
})

export class HappinessIndexComponent implements OnInit, AfterViewInit  {

	public polygons: any[];

	constructor(private ajaxService: AjaxService, private variablesService:VariablesService){
			this.variablesService.selectedMenu ="Happiness";
			this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"_id.solution":"HappinessIndex"},"collection":"area_comparison"}).subscribe(happiness_area => {

            this.polygons = happiness_area;


        });

		
		
	}


	    ngOnInit() {

	    	
      	
    }

    ngAfterViewInit(){
    	let chart1 = c3.generate({
			 bindto: '#chart1',
		    data: {
		        columns: [
		            ['Happy', 60],
		             ['Unhappy', 30],
		              ['Ideal', 10],
		           
		        ],
		        type: 'pie'
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
            categories: ['cat1', 'cat2', 'cat3']
        }

    }
		});

    


    let chart2 = c3.generate({
			 bindto: '#chart2',
		    data: {
		        columns: [
		            ['Happiness Index', 50,30,60],
		           

		           
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
            categories: ['2014', '2015', '2016']
        }

    }
		});

//#2CA02C

    var chart = c3.generate({
    	bindto: '#chart3',
    data: {
        columns: [
            ['Income Level', 40, 60, 50, 55, 65],
           
        ],
        types: {
            'Income Level': 'spline'
        },
        colors: {
                        'Income Level': '#2ca02c'
                 }
    },axis: {
       		 y: {
           
            tick: {
                count: 2
                
            }
        },//end of y
        x: {
            type: 'category',
            categories: ['2012','2013','2014', '2015', '2016']
        }
    }
});



    }
   

    
}
