import {Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {AjaxService} from './../shared/services/ajax.service';
import {VariablesService} from './../shared/services/variables.service';
declare var c3: any;
declare var d3: any;
declare var NProgress: any;




@Component({
    selector: 'energy-index',
    templateUrl: './assets/src/app/overview/overview.component.html'

})

export class OverviewComponent implements OnInit {

    constructor(private ajaxService: AjaxService, private variablesService: VariablesService) {
        this.variablesService.selectedMenu = "Home";
    }

    ngOnInit() {
        NProgress.start();

        function formatDate(subtractDate: number) {
            return moment().subtract(subtractDate, 'days').format('YYYY-MM-DD');
        }

        var today = formatDate(0);
        var beforeDay = formatDate(1);
        var beforeTwoDays = formatDate(2);
        var beforeThreeDays = formatDate(3);
        var beforeFourDays = formatDate(4);
        var beforeFiveDays = formatDate(5);
        var beforeSixDays = formatDate(6);

        let chart = c3.generate({
            bindto: '#chart1',
            data: {
                x: 'x',
                columns: [
                    // ['x', '6', '7AM', '8M', '9AM', '10AM', '11AM','12AM','1PM','2PM','3PM','4PM','5PM','6PM'],
                    ['x', beforeSixDays, beforeFiveDays, beforeFourDays, beforeThreeDays, beforeTwoDays, beforeDay, today],
                    ['Energy Generation', 407.2, 437.8, 479.2, 499.8, 510.3, 563.6, 582.8]
                ],
                types: {
                    'Energy Generation': 'bar'
                },
                colors: {
                    'Energy Generation': '#32CD32'
                },
                labels: true

            },
            bar: {
                width: {
                    ratio: 0.25 
                }
            },
            legend: {
                show: false
            },
            axis: {

                y: {

                    tick: {
                        count: 0

                    }
                },
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d',
                        count: 3
                    }


                }
            }
        });

        let chart1 = c3.generate({
            bindto: '#chart2',
            data: {
                x: 'x',
                columns: [
                    ['x', beforeSixDays, beforeFiveDays, beforeFourDays, beforeThreeDays, beforeTwoDays, beforeDay, today],
                    ['Zone1', 130.2, 146.29, 120.74, 84.26, 129.04, 109.57, 169.26],
                    ['Zone2', 156.816, 119.346, 129.876, 150.124, 144.959, 147.018, 150.124],
                    ['Zone3', 104.54, 159.56, 114.58, 163.42, 105.31, 112.01, 108.42]
                ],
                groups: [
                    ['Zone1', 'Zone2', 'Zone3']
                ],
                type: 'bar',
                labels: false
            },
            bar: {
                width: {
                    ratio: 0.25
                }
            },
            legend: {
                show: false
            },
            axis: {
                y: {
                    tick: {
                        count: 0
                    }
                },
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d',
                        count: 3
                    }
                }
            }
        });


        let chart2 = c3.generate({
            bindto: '#chart3',
            data: {
                columns: [
                    ['Ambient ', 23.2, 23.6, 23.5, 24.5, 24.6, 25.8, 25.6, 24.7, 25.6, 24.8, 25.9, 24.7, 24.3],
                    ['Module', 23.2, 23.5, 24.8, 29.6, 32.9, 37.1, 39.4, 41.2, 34.6, 32.6, 29.6, 27.8, 26.6],

                ],
                type: 'spline'
            },
            legend: {
                show: false
            },
            axis: {
                y: {

                    tick: {
                        count: 3

                    }
                },
                x: {
                    tick: {
                        count: 3

                    },
                    type: 'category',
                    categories: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
                }

            }
        });

        let chart3 = c3.generate({
            bindto: '#chart4',
            data: {
                columns: [
                    ['Inverter Generation', 97.13, 64.75, 72.5, 52.4, 63.6]
                ],
                types: {
                    'Inverter Generation': 'bar'
                },
                colors: {
                    'Inverter Generation': '#157DEC'
                },
                labels: true

            },
            bar: {
                width: {
                    ratio: 0.5
                }
            },
            axis: {
                y: {

                    tick: {
                        count: 0

                    }
                },
                x: {
                    tick: {
                        count: 3

                    },
                    type: 'category',
                    categories: ['Inverter-1', 'Inverter-2', 'Inverter-3', 'Inverter-4', 'Inverter-5']
                }

            }
        });


        let chart5 = c3.generate({
            bindto: '#chart5',
            data: {
                columns: [
                    ['Active Power ', 23.2, 23.6, 23.5, 24.5, 24.6, 25.8, 25.6, 24.7, 25.6, 24.8, 25.9, 24.7, 24.3],
                    ['POA', 23.2, 23.5, 24.8, 29.6, 32.9, 33.1, 34.4, 35.2, 34.6, 32.6, 29.6, 27.8, 26.6],

                ],
                type: 'spline'
            },
            colors: {
                'POA': '#57CC1C'
            },
            legend: {
                show: false
            },
            axis: {
                y: {

                    tick: {
                        count: 0

                    }
                },
                x: {
                    tick: {
                        count: 3

                    },
                    type: 'category',
                    categories: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
                }

            }

        });
        let chart4 = c3.generate({
            bindto: '#chart6',
            data: {

                columns: [
                    ['Warning', 5],
                    ['Alarms', 8],
                    ['Info', 10]
                ],
                type: 'pie'

            },
            legend: {
                show: true
            }
        });


        let chart6 = c3.generate({
            bindto: '#chart7',
            data: {
                columns: [
                    ['wind Speed', 21.7, 22.0, 23.1, 23.4, 24.7, 25.0, 24.9, 23.8, 22.9, 22.2, 21.6],

                ],
                type: 'spline',
                colors: {
                    'wind Speed': '#9A7D0A'
                }
            },
            legend: {
                show: false
            },
            axis: {
                y: {

                    tick: {
                        count: 3

                    }
                },
                x: {
                    tick: {
                        count: 3

                    },
                    type: 'category',
                    categories: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
                }

            }
        });


        var chart7 = c3.generate({
            bindto: '#chart9',
            data: {
                columns: [
                    ['IRR Energy', 50, 250, 551, 751, 1052, 1571, 2102, 2532, 3072, 3503, 3903],

                ],
                type: 'area-spline',
                colors: {
                    'IRR Energy': '#57CC1C'
                }
            },
            legend: {
                show: false
            },
            axis: {
                y: {

                    tick: {
                        count: 0

                    }
                },
                x: {
                    tick: {
                        count: 3

                    },
                    type: 'category',
                    categories: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
                }

            }
        });

        var chart8 = c3.generate({
            bindto: '#chart8',
            data: {
                x: 'x',
                columns: [
                    ['x', beforeSixDays, beforeFiveDays, beforeFourDays, beforeThreeDays, beforeTwoDays, beforeDay, today],
                    ['Savings', 2443.2, 2626.8, 2874.2, 2994.8, 3060.3, 3378.6, 3497.8]
                ],
                type: 'bar',
                colors: {
                    'Savings': '#008000'
                },
            },

            bar: {
                width: {
                    ratio: 0.25
                }
            },
            legend: {
                show: true
            },
            axis: {

                y: {

                    tick: {
                        count: 0

                    }
                },
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d',
                        count: 3
                    }


                }
            }


        });



        let chart10 = c3.generate({
            bindto: '#chart10',
            data: {
                x: 'x',
                columns: [
                    ['x', beforeSixDays, beforeFiveDays, beforeFourDays, beforeThreeDays, beforeTwoDays, beforeDay, today],
                    ['Energy Export', 437.6, 456.3, 509.4, 526.8, 545.4, 586.4, 602.1],
                    ['Energy import', 407.2, 437.8, 479.2, 499.8, 510.3, 563.6, 582.8]
                ],
                groups: [
                    ['Energy Export', 'Energy import']
                ],
                type: 'bar',
                labels: false
            },
            bar: {
                width: {
                    ratio: 0.25
                }
            },
            legend: {
                show: false
            },
            axis: {

                y: {

                    tick: {
                        count: 0

                    }
                },
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d',
                        count: 3
                    }


                }
            }
        });


        let chart9 = c3.generate({

            bindto: '#chart11',
            data: {

                columns: [
                    ['Wind Speed', 50],
                    ['AHU', 45],
                    ['Amp Temperature', 5],
                ],
                type: 'pie'

            },
            legend: {
                position: 'right'

            }
        });

        NProgress.done();
    }

}
