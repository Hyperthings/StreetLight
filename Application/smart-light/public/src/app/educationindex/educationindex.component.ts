import {Component, OnInit } from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;



@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/educationindex/educationindex.component.html'

})

export class EducationIndexComponent implements OnInit  {

  public polygons: any[];
  constructor(private ajaxService: AjaxService, private variablesService:VariablesService) {
   
  		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"_id.solution":"EducationIndex"},"collection":"area_comparison"}).subscribe(education_area => {

            this.polygons = education_area;


        });

		this.variablesService.selectedMenu ="Education";

  }

     ngOnInit(){


     	var chart = c3.generate({
    		bindto: '#pichart1',
		    data: {
		        columns: [
		            ['Male', 87, 89, 90, 92.2, 93.6],
		            ['Female', 88, 89.5, 91, 94, 97],
		           
		        ],
		        types: {
		            'Male': 'spline',
		            'Female' : 'spline',
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


		var chart2 = c3.generate({
				bindto: '#pichart2',
			    data: {
			        columns: [
			            ['Preschools', 93.40],
			            ['Upper Secondary', 93.10]
			        ],
			        type : 'pie'
			    },
			    donut: {
			        title: "EnrollmentRate"
			    }
			});

		let chart3 = c3.generate({
     		bindto: '#pichart3',
	    	data: {
		    	x: 'x',
		        columns: [
		        	['x', 2013, 2014,2015,2016],
		            ['Government', 60,69,79,80],
		            ['Private', 160,165,172,173]
		        ],
		        groups: [
		            ['Government', 'Private']
		        ],
		        type: 'bar',
		        labels: true,
		        colors: {
		            	'Government': '#157DEC',
		            	'Private' : '#1D8348'
		        	}
		    }
		});

		let chart4 = c3.generate({
	    		bindto: '#pichart4',
			    data: {
			    	 x: 'x',
			        columns: [
			           // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
			            ['x', 2008,2009,2010,2011,2012,2013,2014],
			            ['Unemployment Rate',  3.45,3.71, 4.2, 4.3, 4.6,4.2,4.1]
			        ],
			        types: {
			            'Unemployment Rate': 'bar'
			        },
			         colors: {
			            'Unemployment Rate': '#32CD32'
			        }
			        
			    },
			    legend: {
					        show: false
		    		}
			});


     }

}
