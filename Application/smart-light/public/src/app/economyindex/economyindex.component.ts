import {Component, OnInit } from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;



@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/economyindex/economyindex.component.html'

})

export class EconomyIndexComponent implements OnInit  {

  public polygons: any[];
  constructor(private ajaxService: AjaxService, private variablesService:VariablesService) {
   
  		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"_id.solution":"EconomyIndex"},"collection":"area_comparison"}).subscribe(economy_area => {
			//fetchSelectedObjects
            this.polygons = economy_area;


        });

		this.variablesService.selectedMenu ="Economy";

  }

     ngOnInit(){


         let chart = c3.generate({
          bindto: '#pichart1',
          data: {
             x: 'x',
              columns: [
                 // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
                  ['x', 2010,2011,2012,2013,2014,2015],
                  ['GDPper Capita(USD)',  34341,34454, 35933, 37123, 38622,39543]
              ],
              types: {
                  'GDPper Capita(USD)': 'bar'
              },
               colors: {
                  'GDPper Capita(USD)': '#5DADE2'
              }
              
          },
          legend: {
                  show: false
            }
      });

       let chart1 = c3.generate({
         bindto: '#pichart2',
        data: {
          x: 'x',
            columns: [
              ['x', '2006', '2007', '2008', '2009', '2010', '2011'],
                ['Compensation of Employees', 79.80, 77.49, 77.22, 72.82, 72.63, 76.03],
                ['Tax', 0.7, 1.5, 1.6, 2.1, 1.09,0.87],
                ['Operating surplus', 19.44, 21.01, 21.71, 26.09, 26.29,23.10]
            ],
            groups: [
                ['Compensation of Employees', 'Tax','Operating surplus']
            ],
            type: 'bar',
            labels: true
        },
        legend: {
            show: false
        }
    });


       let chart3 = c3.generate({
          bindto: '#pichart3',
          data: {
             x: 'x',
              columns: [
                 // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
                  ['x', '2010','2011','2012','2013','2014','2015','2016'],
                  ['Money Value(AED Million)', 40100, 43100,50300, 57200, 66100, 76600,81300]
              ],
              types: {
                  'Money Value(AED Million)': 'bar'
              },
               colors: {
                  'Money Value(AED Million)': '#F5B041'
              }
              
          },
          bar: {
              width: {
                  ratio: 0.2 // this makes bar width 50% of length between ticks
              }
              // or
              //width: 100 // this makes bar width 100px
          },
          legend: {
                  show: false
            },
            axis: {

              y:{
             
                  tick: {
                      count: 4
                      
                  }
                },//end of y
                x: {
                  tick: {
                      count: 3
                      
                  }

            }
          }
      });


       let chart6 = c3.generate({
       bindto: '#pichart4',
        data: {
            columns: [
                ['Oil Production(BBL/D/1K)', 2345,2401,2511,2567,2877,2467,3004,3201],
               
            ],
           type: 'area-spline',
           colors: {
                  'Oil Production(BBL/D/1K)': '#5D6D7E'
              }
        },
       legend: {
             show: false
        },
        axis: {
              y: {
             
              tick: {
                  count: 4
                  
              }
            },//end of y
            x: {
              tick: {
                  count: 3
                  
              },
                type: 'category',
                categories: [ '2009', '2010','2011','2012','2013','2014','2015','2016']
            }

        }
    });




     }

}
