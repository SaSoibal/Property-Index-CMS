import { Component,ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { BadInput } from '../../core_classes/bad-input';
import { AppError } from '../../core_classes/app-error';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';

import Chart from 'chart.js';


// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

export interface DialogData {
  leads:[];
  show_filter:string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  total_users_count = 0;
  total_leads_count = 0;
  success_leads_count = 0;
  failed_leads_count = 0;
  total_property = 0;
  total_residential = 0;
  total_commercial = 0;
  total_buildings = 0;
  report_month = [];
  report_count = [];
  show_user = false;

  constructor(private fb: FormBuilder, 
    private common: CommonService, 
    private dataService: DataService, 
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.leadModel();
    this.dashBoardData();
    this.calculatePercentage(this.chartOptions);
    // this.datasets = [
    //   [0, 20, 10, 30, 15, 40, 20, 60, 60],
    //   [0, 20, 5, 25, 10, 30, 15, 40, 40]
    // ];
    // this.data = this.datasets[0];
    // var chartOrders = document.getElementById('chart-orders');
    // parseOptions(Chart, chartOptions());
    // var ordersChart = new Chart(chartOrders, {
    //   type: 'bar',
    //   options: chartExample2.options,
    //   data: chartExample2.data
    // });

    // var chartSales = document.getElementById('chart-sales');
    // this.salesChart = new Chart(chartSales, {
		// 	type: 'line',
    //   options: {},
    //   data: {
    //     labels: this.report_month,
    //     datasets: [{
    //       label: 'Performance',
    //       data: this.report_count
    //     }]
    //   }
		// });

 
  }
  // =============== Funnel Chart start =====================
    chartOptions = {
      animationEnabled: true,
      data: [{
          type: "funnel",
          indexLabel: "{label} - {y}",
          toolTipContent: "{label}: {y} ({percentage}%)",
          neckWidth: 20,
          neckHeight: 0,
          valueRepresents: "area",
          dataPoints: [
              { y: 0, label: "Applications" },
              { y: 0, label: "Screened" },
              { y: 0, label: "Qualified" },
              { y: 0, label: "Interviewed" },
              { y: 0, label: "Offers Extended" },
              { y: 0, label: "Filled" }
          ]
      }]
  }

  calculatePercentage = (chartOptions: any) => {
      let dataPoint = chartOptions.data[0].dataPoints;
      let total = dataPoint[0].y;
      for (let i = 0; i < dataPoint.length; i++) {
          if (i == 0) {
              chartOptions.data[0].dataPoints[i].percentage = 100;
          } else {
              chartOptions.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
          }
      }
  }
  // =============== Funnel Chart end =====================
  // =============== average Lead Maturity Time Bar Chart start =====================
  averageLeadMaturityTime  = {
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "K"
    },
    dataPointMaxWidth: 45,
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###K",
      dataPoints: [
        { label: "1", y: 15 },
        { label: "2", y: 20 },
        { label: "3", y: 24 },
      ]
    }]
  }	
  // =============== average Lead Maturity Time Bar Chart end =====================
  // =============== active Lead Board Bar Chart start =====================
  activeLeadBoard  = {
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "K"
    },
    dataPointWidth: 15,
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###K",
      dataPoints: [
        { label: "1", y: 15 },
        { label: "2", y: 20 },
        { label: "3", y: 24 },
        { label: "4", y: 29 },
        { label: "5", y: 32 },
        { label: "6", y: 15 },
        { label: "7", y: 20 },
        { label: "8", y: 24 },
        { label: "9", y: 29 },
        { label: "10", y: 32 },
        { label: "11", y: 24 },
        { label: "12", y: 29 },
      ]
    }]
  }	
  // =============== active Lead Board Bar Chart end =====================
  // =============== token Receive Leader Board Bar Chart start =====================
  tokenReceiveLeaderBoard  = {
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "K"
    },
    dataPointWidth: 15,
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###K",
      dataPoints: [
        { label: "1", y: 15 },
        { label: "2", y: 20 },
        { label: "3", y: 24 },
        { label: "4", y: 29 },
        { label: "5", y: 32 },
        { label: "6", y: 15 },
        { label: "7", y: 20 },
        { label: "8", y: 24 },
        { label: "9", y: 29 },
        { label: "10", y: 32 },
        { label: "11", y: 24 },
        { label: "12", y: 29 },
      ]
    }]
  }	
  // =============== token Receive Leader Board Bar Chart end =====================
  // =============== sales Leader Board Bar Chart start =====================
  salesLeaderBoard  = {
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "K"
    },
    dataPointMaxWidth: 30,
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###K",
      dataPoints: [
        { label: "1", y: 15 },
        { label: "2", y: 20 },
        { label: "3", y: 24 },
        { label: "4", y: 29 },
        { label: "4", y: 25 },
      ]
    }]
  }	
  // =============== sales Leader Board Bar Chart end =====================
  // =============== lead Win Leader Board Bar Chart start =====================
  leadWinLeaderBoard  = {
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "K"
    },
    dataPointMaxWidth: 35,
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###K",
      dataPoints: [
        { label: "1", y: 15 },
        { label: "2", y: 20 },
        { label: "3", y: 24 },
        { label: "4", y: 29 },
      ]
    }]
  }	
  // =============== lead Win Leader Board Bar Chart end =====================
  // =============== lead Loss Leader Board Bar Chart start =====================
  leadLossLeaderBoard  = {
    animationEnabled: true,
    axisY: {
      includeZero: true,
      suffix: "K"
    },
    dataPointMaxWidth: 35,
    data: [{
      type: "bar",
      indexLabel: "{y}",
      yValueFormatString: "#,###K",
      dataPoints: [
        { label: "1", y: 15 },
        { label: "2", y: 20 },
        { label: "3", y: 24 },
        { label: "4", y: 29 },
      ]
    }]
  }	
  // =============== lead Loss Leader Board Bar Chart end =====================
  // =============== lead Win Factors pie Chart start =====================
  leadWinFactors  = {
	  animationEnabled: true,
	  data: [{
		type: "pie",
		startAngle: -90,
		indexLabel: "{name}: {y}",
		yValueFormatString: "#,###.##'%'",
      dataPoints: [
        { y: 14.1, name: "Toys" },
        { y: 28.2, name: "Electronics" },
        { y: 14.4, name: "Groceries" },
        { y: 43.3, name: "Furniture" }
		  ]
	  }]
  }	
  // ===============  lead Win Factors pie Chart end =====================
  // ===============  Lead Loss Factors pie Chart start =====================
  leadLossFactors  = {
	  animationEnabled: true,
	  data: [{
		type: "pie",
		startAngle: -90,
		indexLabel: "{name}: {y}",
		yValueFormatString: "#,###.##'%'",
      dataPoints: [
        { y: 14.1, name: "Toys" },
        { y: 15.1, name: "Electronics" },
        { y: 16.4, name: "Groceries" },
        { y: 17.3, name: "Furniture" },
        { y: 18.3, name: "yurniture" }
		  ]
	  }]
  }	
  // ===============   Lead Loss Factors pie Chart end =====================
  // ===============  prospect Leads Sales By Product Type Chart start =====================
  prospectLeadsSalesByProductType  = {
	  animationEnabled: true,
    dataPointMaxWidth: 15,
	  data: [{
      type: "column",
      dataPoints: [
        { x: 10, y: 71 },
        { x: 20, y: 55 },
        { x: 30, y: 50 },
        { x: 40, y: 65 },
        { x: 50, y: 95 },
        { x: 60, y: 68 },
        { x: 70, y: 28 },
        { x: 80, y: 34 },
        { x: 90, y: 14 }
      ]
	  }]
  }	
  // ===============   Lead Loss Factors pie Chart end =====================
  // ===============  prospect Leads Sales By Stage Chart start =====================
  prospectLeadsSalesByStage  = {
	  animationEnabled: true,
    dataPointMaxWidth: 15,
	  data: [{
      type: "column",
      dataPoints: [
        { x: 10, y: 71 },
        { x: 20, y: 55 },
        { x: 30, y: 50 },
        { x: 40, y: 65 },
        { x: 50, y: 95 },
        { x: 60, y: 68 },
        { x: 70, y: 28 },
        { x: 80, y: 34 },
        { x: 90, y: 14 }
      ]
	  }]
  }	
  // ===============   prospect Leads Sales By Stage Chart end =====================
  // ===============  prospect Leads Source Chart start =====================
  prospectLeadsSource  = {
	  animationEnabled: true,
    dataPointMaxWidth: 15,
	  data: [{
      type: "column",
      dataPoints: [
        { x: 10, y: 71 },
        { x: 20, y: 55 },
        { x: 30, y: 50 },
        { x: 40, y: 65 },
        { x: 50, y: 95 },
        { x: 60, y: 68 },
        { x: 70, y: 28 },
        { x: 80, y: 34 },
        { x: 90, y: 14 }
      ]
	  }]
  }	
  // ===============   prospect Leads Source Chart end =====================
  // ===============  designation Wise Prospect Contact Person start ============
  designationWiseProspectContactPerson = {
	  animationEnabled: true,
	  data: [{
      type: "pie",
      showInLegend: true, 
      indexLabel: "{name}: {y}",
      yValueFormatString: "#,###.##'%'",
      dataPoints: [
        { y: 14.1, name: "Toys" },
        { y: 28.2, name: "Electronics" },
        { y: 14.4, name: "Groceries" },
        { y: 43.3, name: "Furniture" },
        { y: 53.3, name: "Furniture" },
        { y: 63.3, name: "Furniture" },
        { y: 73.3, name: "Furniture" },
        { y: 83.3, name: "Furniture" },
        { y: 93.3, name: "Furniture" }
      ]
	  }]
	}	
  // ===============  designation Wise Prospect Contact Person end =============
  // ===============  lead Closing Forecast ============
  leadClosingForecast = {
	  animationEnabled: true,
    dataPointMaxWidth: 50,
	  data: [{
      type: "column",
      dataPoints: [
        { y: 14.1, name: "Toys" },
        { y: 28.2, name: "Electronics" },
        { y: 14.4, name: "Groceries" },
        { y: 43.3, name: "Furniture" },
        { y: 53.3, name: "Furniture" },
        { y: 63.3, name: "Furniture" },
        { y: 73.3, name: "Furniture" },
        { y: 83.3, name: "Furniture" },
        { y: 93.3, name: "Furniture" }
      ]
	  }]
	}	
  // ===============  lead Closing Forecast =============
  // ===============  lead Closing Target Actual Pending Loss ============
  leadClosingTargetActualPendingLoss = {
	  animationEnabled: true,
	  data: [{
      type: "column",
      dataPointMaxWidth: 15,
      dataPoints: [
        { x: 10, y: 0 },
        { x: 20, y: 0 },
        { x: 30, y: 0 },
        { x: 40, y: 0 },
        { x: 50, y: 0 },
        { x: 60, y: 0 },
        { x: 70, y: 0 },
        { x: 80, y: 0 },
        { x: 90, y: 0 }
      ]
	  }]
	}	
  // ===============  designation Wise Prospect Contact Person end =============


  // report_month = [];
  // report_count = [];
  dashBoardData() {
    this.common.onMainEvent.emit(true);
    const postdate={
      'api_token': this.tokenId,
    }
    this.dataService.create(postdate, 'dashboard-data-list')
    .subscribe(
      data => {
        if (data.response === 200) {
            this.common.onMainEvent.emit(false);
            this.total_users_count = data.data_list.total_users;
            this.total_leads_count = data.data_list.total_leads;
            this.success_leads_count = data.data_list.success_leads;
            this.failed_leads_count = data.data_list.failed_leads;
            this.total_property = data.data_list.total_property;
            this.total_residential = data.data_list.total_residential;
            this.total_commercial = data.data_list.total_commercial;
            this.total_buildings = data.data_list.total_buildings;
            this.show_user = data.show_user;

            var chartSales = document.getElementById('chart-sales');
            parseOptions(Chart, chartOptions());
            this.salesChart = new Chart(chartSales, {
              type: 'line',
              options: {},
              data: {
                labels: data.data_list.report_month,
                datasets: [{
                  label: 'Lead',
                  data: data.data_list.report_count
                }]
              }
            });

            var chartOrders = document.getElementById('chart-orders');
            parseOptions(Chart, chartOptions());
            var ordersChart = new Chart(chartOrders, {
              type: 'bar',
              options: {},
              data: {
                labels: data.data_list.report_success_month,
                datasets: [
                  {
                    label: "Lead",
                    data: data.data_list.report_success_count,
                    maxBarThickness: 10
                  }
                ]
              }
            });
        } 
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }


  leadModel() {
    const dialogRef = this.dialog.open( LeadDetail, {
      width: '800px',
      data: {
        leads: [],
        show_filter: ''
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  


}


@Component({
  selector: 'lead-details-model',
  templateUrl: './lead-details-model.html',
  styleUrls: ['./dashboard.component.scss']
})
export class LeadDetail {
  tokenId = this.common.mycookie.bearertoken ;
  branch_list =[];
  changeBranch = '';
  team_list = [];
  team_member = [];
  team_id = '';
  member_id = '';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<LeadDetail>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    public dialog: MatDialog,
    private common: CommonService) {
  }

  ngOnInit() {
    this.getBranch();
    this.leadModels();
  }




  getBranch(){
    const postdatet = {
      'api_token': this.tokenId,
    }
    this.dataService.create(postdatet, 'sys-branch-list')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.branch_list = data.branch;
          if(data.branch.length > 0){
            this.changeBranch = data.branch[0].id;
            this.onBranch(this.changeBranch)
          }  
        } else if (data.response === 400) {
          this.branch_list =[];
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

  onBranch(event){
    this.changeBranch = event;
    const postdatet = {
      'api_token': this.tokenId,
      'branch_id': event
    };
    this.dataService.create(postdatet, 'common/branch-wise-team-list')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.team_list = data.list;
            if(data.list.length > 0){
              this.team_id = data.list[0].id;
              this.teamWiseMember(data.list[0].id);
            }
          } else {
            this.team_list = [];
            this.team_id = '';
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  teamWiseMember(event) {
    if(event){
      const postdatet = {
        'api_token': this.tokenId,
        'team_id': event,
      };
      this.dataService.create(postdatet, 'common/team-member')
        .subscribe(
          data => {
            if (data.response === 200) {
              this.team_member = data.team_member;
              this.leadModels();
            } else {
              this.team_member = [];
            }
          },
          (error: AppError) => {
            this.common.openTost('error', 'ERROR', 'Please try again later');
            if (error instanceof BadInput) {
            } else { throw error; }
          });
    }
  }

  clickMemberData(event){
    this.member_id = event?event:'';
    this.leadModels();
  }

  leadModels() {
    const postdate={
      'api_token': this.tokenId,
      'branch_id': this.changeBranch,
      'team_id': this.team_id,
      'member_id': this.member_id,
    }
    this.dataService.create(postdate, 'dashboard-lead-list')
    .subscribe(
      data => {
        if (data.response === 200) {
            this.data.leads = data.step;
            this.data.show_filter = data.show_filter;
        } 
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }


}