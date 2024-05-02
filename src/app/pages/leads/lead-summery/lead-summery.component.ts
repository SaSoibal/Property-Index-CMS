import { Component, OnInit, Inject } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../../variables/charts";


@Component({
  selector: 'app-lead-dashboard',
  templateUrl: './lead-summery.component.html',
  styleUrls: ['./lead-summery.component.scss']
})
export class LeadSummeryComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  new_lead = 0;
  first_call = 0;
  kyc = 0;
  follow_up_call = 0;
  viewing = 0;
  re_viewing = 0;
  negotiation_metting = 0;
  token_receive = 0;
  sales_permission = 0;
  registration = 0;
  deal_close = 0;

  total_lead = 0;
  pageBuffer = false;
  // monthly_report_labels;
  // monthly_report_data;

  filter_no = '';
  createLeadsForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.dashboardData();
    this.common.aClickedEvent
    .subscribe((data: string) => {
      this.dashboardData();
    });
    parseOptions(Chart, chartOptions());

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    // var chartOrders = document.getElementById('lead-stage');
    // parseOptions(Chart, chartOptions());
    // var ordersChart = new Chart(chartOrders, {
    //   type: 'line',
    //   options: chartExample2.options,
    //   data: chartExample2.data
    // });

  }

  permission(type) {
    return this.common.permission('leads/dashboard', type);
  }

  dashboardData() {
    this.pageBuffer = true;
    const postdate = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdate, 'lead-dashboard/index')
    .subscribe(
      async(data) => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.new_lead = await data.count.new_lead;
          this.first_call = await data.count.first_call;
          this.kyc = await data.count.kyc;
          this.follow_up_call = await data.count.follow_up_call;
          this.negotiation_metting = await data.count.negotiation_metting;
          this.viewing = await data.count.viewing;
          this.re_viewing = await data.count.re_viewing;
          this.token_receive = await data.count.token_receive;
          this.sales_permission = await data.count.sales_permission;
          this.registration = await data.count.registration;
          this.deal_close = await data.count.deal_close;
          this.total_lead = await data.total_lead;
          // this.monthly_report_labels = await data.report.monthly_report_labels;
          // this.monthly_report_data = await data.report.monthly_report_data;
          // bar chart
          var chartOrders = document.getElementById('chart-orders');
          var ordersChart = new Chart(chartOrders, {
            type: 'bar',
            data: {
              labels:  data.report.monthly_report_labels,
              datasets: [
                {
                  label: "Leads",
                  data: data.report.monthly_report_data,
                  maxBarThickness: 8
                }
              ]
            }
          });
          // line chart
          // var chartSales = document.getElementById('chart-sales');
          // this.salesChart = new Chart(chartSales, {
          //   type: 'line',
          //   options: {
          //     scales: {
          //       yAxes: [{
          //         gridLines: {
          //           color: '#212529',
          //           zeroLineColor: '#212529',
          //           drawOnChartArea: false
          //         },
          //         ticks: {
          //           callback: function(value) {
          //             if (!(value % 10)) {
          //               return '$' + value + 'k';
          //             }
          //           }
          //         }
          //       }]
          //     }
          //   },
          //   data: {
          //     labels: data.report.report_sales_labels,
          //     datasets: [{
          //       label: 'Sales',
          //       data: data.report.report_sales_data
          //     }]
          //   }
          // });
        } else {}
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

}



