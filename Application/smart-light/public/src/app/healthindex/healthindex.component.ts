import {Component, OnInit } from '@angular/core';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;



@Component({
    selector: 'health-index',
    templateUrl: './assets/src/app/healthindex/healthindex.component.html'

})

export class HealthIndexComponent implements OnInit  {

  public polygons: any[];
  constructor(private ajaxService: AjaxService, private variablesService:VariablesService) {
   
  		this.ajaxService.fetchSelectedObjects('getObjects',{"query": {"_id.solution":"HealthIndex"},"collection":"area_comparison"}).subscribe(health_area => {

            this.polygons = health_area;


        });

		this.variablesService.selectedMenu ="Health";

  }

     ngOnInit(){


       let chart1 = c3.generate({
       bindto: '#pichart2',
        data: {
            columns: [
                ['Cardiovascular Disease', 297.6],
                 [' Cancer', 99],
                  ['Others', 200],
               
            ],
            type: 'pie'
        }
    });



       let chart5 = c3.generate({
        bindto: '#pichart3',
          data: {
              columns: [
                  ['Prevalence of Smoking', 21.6, 1.9, 23.5]
                
                 
              ],
              type: 'bar',
               colors: {
                  'Prevalence of Smoking': '#1A5276',
                  
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
                    count: 3
                    
                }
             },//end of y
            x: {
              
              
                type: 'category',
                categories: ['Male', 'Female','Overall']
            }

        }
    });

    let chart3 = c3.generate({
          bindto: '#pichart4',
          data: {
             x: 'x',
              columns: [
                 // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
                  ['x', '2010','2011','2012','2013','2014','2015','2016'],
                  ['Fertility Ratio', 2, 1.98, 1.95, 1.9, 1.87, 1.62, 1.6]
              ],
              types: {
                  'Fertility Ratio': 'bar'
              },
               colors: {
                  'Fertility Ratio': '#157DEC'
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
                      count: 2
                      
                  }
                },//end of y
                x: {
                  tick: {
                      count: 3
                      
                  }

            }
          }
      });

    

     }

}
