import { Component, ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import {
    FormGroup, FormBuilder, FormControl,
    Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    leads: [];
    show_filter: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    tokenId = this.common.mycookie.bearertoken;
    public datasets: any;
    public data: any;
    public salesChart;
    public clicked: boolean = true;
    public clicked1: boolean = false;
    currentYear: number = new Date()?.getFullYear();
    datePicker: Date = new Date();

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

    chartOptions: any = null;
    calculatePercentage: any = null;
    averageLeadMaturityTime: any = null;
    activeLeadBoard: any = null;
    tokenReceiveLeaderBoard: any = null;
    leadWinLeaderBoard: any = null;
    leadLossLeaderBoard: any = null;
    leadWinFactors: any = null;
    leadLossFactors: any = null;
    prospectLeadsSalesByProductType: any = null;
    prospectLeadsSalesByStage: any = null;
    prospectLeadsSource: any = null;
    designationWiseProspectContactPerson: any = null;
    leadClosingForecast: any = null;
    leadClosingTargetActualPendingLoss: any = null;

    constructor (private fb: FormBuilder,
        private common: CommonService,
        private dataService: DataService,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.initChart();
        this.leadModel();
        this.dashBoardData();
        this.getDashBoardReport();
        this.calculatePercentage(this.chartOptions);
    }

    initChart() {
        // =============== Funnel Chart start =====================
        this.chartOptions = {
            animationEnabled: true,
            data: [{
                type: "funnel",
                indexLabel: "{label} - {y}",
                toolTipContent: "{label}: {y} ({percentage}%)",
                neckWidth: 20,
                neckHeight: 10,
                valueRepresents: "area",
                dataPoints: [
                    { y: 8, label: "Applications" },
                    { y: 2, label: "Screened" },
                    { y: 5, label: "Qualified" },
                    { y: 1, label: "Interviewed" },
                    { y: 5, label: "Offers Extended" },
                    { y: 0, label: "Filled" }
                ]
            }]
        }

        this.calculatePercentage = (chartOptions: any) => {
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
        this.averageLeadMaturityTime = {
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
        this.activeLeadBoard = {
            animationEnabled: true,
            axisY: {
                includeZero: true,
                suffix: "K"
            },
            dataPointWidth: 25,
            data: [{
                type: "bar",
                indexLabel: "{y}",
                yValueFormatString: "#,###K",
                dataPoints: [
                    { label: "January", y: 0 },
                    { label: "February", y: 0 },
                    { label: "March", y: 0 },
                    { label: "April", y: 0 },
                    { label: "May", y: 0 },
                    { label: "June", y: 0 },
                    { label: "July", y: 0 },
                    { label: "August", y: 0 },
                    { label: "September", y: 0 },
                    { label: "October", y: 0 },
                    { label: "November", y: 0 },
                    { label: "December", y: 0 },
                ]
            }]
        }
        // =============== active Lead Board Bar Chart end =====================
        // =============== token Receive Leader Board Bar Chart start =====================
        this.tokenReceiveLeaderBoard = {
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
                    { label: "January", y: 0 },
                    { label: "February", y: 0 },
                    { label: "March", y: 0 },
                    { label: "April", y: 0 },
                    { label: "May", y: 0 },
                    { label: "June", y: 0 },
                    { label: "July", y: 0 },
                    { label: "August", y: 0 },
                    { label: "September", y: 0 },
                    { label: "October", y: 0 },
                    { label: "November", y: 0 },
                    { label: "December", y: 0 },
                ]
            }]
        }
        // =============== token Receive Leader Board Bar Chart end =====================

        // =============== lead Win Leader Board Bar Chart start =====================
        this.leadWinLeaderBoard = {
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
                    { label: "January", y: 0 },
                    { label: "February", y: 0 },
                    { label: "March", y: 0 },
                    { label: "April", y: 0 },
                    { label: "May", y: 0 },
                    { label: "June", y: 0 },
                    { label: "July", y: 0 },
                    { label: "August", y: 0 },
                    { label: "September", y: 0 },
                    { label: "October", y: 0 },
                    { label: "November", y: 0 },
                    { label: "December", y: 0 },
                ]
            }]
        }
        // =============== lead Win Leader Board Bar Chart end =====================
        // =============== lead Loss Leader Board Bar Chart start =====================
        this.leadLossLeaderBoard = {
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
                    { label: "January", y: 0 },
                    { label: "February", y: 0 },
                    { label: "March", y: 0 },
                    { label: "April", y: 0 },
                    { label: "May", y: 0 },
                    { label: "June", y: 0 },
                    { label: "July", y: 0 },
                    { label: "August", y: 0 },
                    { label: "September", y: 0 },
                    { label: "October", y: 0 },
                    { label: "November", y: 0 },
                    { label: "December", y: 0 },
                ]
            }]
        }
        // =============== lead Loss Leader Board Bar Chart end =====================
        // =============== lead Win Factors pie Chart start =====================
        this.leadWinFactors = {
            animationEnabled: true,
            data: [{
                type: "pie",
                startAngle: -90,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###.##'%'",
                dataPoints: [
                    { y: 0, name: "Offices" },
                    { y: 0, name: "Shops" },
                    { y: 0, name: "Open floor" },
                    { y: 0, name: "Office apartments" },
                    { y: 0, name: "Duplex" },
                    { y: 0, name: "Piazas" },
                    { y: 0, name: "Buildings" },
                    { y: 0, name: "Plots" },
                    { y: 0, name: "Warehouse" },
                    { y: 0, name: "Factory" },
                    { y: 0, name: "Apartments" },
                    { y: 0, name: "Rooms" },
                    { y: 0, name: "Penthouses" }
                ]
            }]
        }
        // ===============  lead Win Factors pie Chart end =====================
        // ===============  Lead Loss Factors pie Chart start =====================
        this.leadLossFactors = {
            animationEnabled: true,
            data: [{
                type: "pie",
                startAngle: -90,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###.##'%'",
                dataPoints: [
                    { y: 0, name: "Offices" },
                    { y: 0, name: "Shops" },
                    { y: 0, name: "Open floor" },
                    { y: 0, name: "Office apartments" },
                    { y: 0, name: "Duplex" },
                    { y: 0, name: "Piazas" },
                    { y: 0, name: "Buildings" },
                    { y: 0, name: "Plots" },
                    { y: 0, name: "Warehouse" },
                    { y: 0, name: "Factory" },
                    { y: 0, name: "Apartments" },
                    { y: 0, name: "Rooms" },
                    { y: 0, name: "Penthouses" }
                ]
            }]
        }
        // ===============   Lead Loss Factors pie Chart end =====================
        // ===============  prospect Leads Sales By Product Type Chart start =====================
        this.prospectLeadsSalesByProductType = {
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
        this.prospectLeadsSalesByStage = {
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
        this.prospectLeadsSource = {
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
        this.designationWiseProspectContactPerson = {
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
        this.leadClosingForecast = {
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
        this.leadClosingTargetActualPendingLoss = {
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

    }


    // report_month = [];
    // report_count = [];
    dashBoardData() {
        this.common.onMainEvent.emit(true);
        const postdate = {
            'api_token': this.tokenId
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
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error };
                });
    }

    changeYear(value: Date) {
        this.currentYear = value?.getFullYear();
        this.initChart();
        this.getDashBoardReport();
    }
    getDashBoardReport() {
        this.common.onMainEvent.emit(true);
        const postdate = {
            'api_token': this.tokenId,
            'year': this.currentYear
        }
        this.dataService.create(postdate, 'report/dashboard-report')
            .subscribe(
                data => {
                    if (data.code === 200) {
                        this.common.onMainEvent.emit(false);
                        this.updateLeadStageChart(data?.data)
                    }
                },
                (error: AppError) => {
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error };
                });
    }

    updateLeadStageChart(data) {
        const leadStage = data?.lead_stage;
        const activeLead = data?.active_lead;
        const tokenReceiveLead = data?.token_receive_lead;
        const successLead = data?.success_lead;
        const failedLead = data?.failed_lead;
        const leadWinFactor = data?.lead_win_factor;
        const leadLossFactor = data?.lead_loss_factor;

        //update lead stage
        this.chartOptions = {
            animationEnabled: true,
            data: [{
                type: "funnel",
                indexLabel: "{label} - {y}",
                toolTipContent: "{label}: {y} items",
                neckWidth: 20,
                neckHeight: 10,
                valueRepresents: "area",
                dataPoints: [
                    { y: leadStage?.NEW, label: "NEW" },
                    { y: leadStage?.FIRST_CALL, label: "FIRST CALL" },
                    { y: leadStage?.KYC, label: "KYC" },
                    { y: leadStage?.FOLLOW_UP_CALL, label: "FOLLOW UP CALL" },
                    { y: leadStage?.VIEWING, label: "VIEWING" },
                    { y: leadStage?.REVIEWING, label: "REVIEWING" },
                    { y: leadStage?.NEGOTIATION, label: "NEGOTIATION" },
                    { y: leadStage?.TOKEN_RECEIVE, label: "TOKEN RECEIVE" },
                    { y: leadStage?.SELL_PERMISSION, label: "SELL PERMISSION" },
                    { y: leadStage?.REGISTRATION, label: "REGISTRATION" },
                    { y: leadStage?.DEAL_CLOSE, label: "DEAL CLOSE" },
                ]
            }]
        }

        //update active lead board
        this.activeLeadBoard = {
            animationEnabled: true,
            axisY: {
                includeZero: true,
                suffix: "item"
            },
            dataPointWidth: 25,
            data: [{
                type: "bar",
                indexLabel: "{y}",
                yValueFormatString: "#,### item",
                dataPoints: [
                    { label: "January", y: activeLead?.JANUARY },
                    { label: "February", y: activeLead?.FEBRUARY },
                    { label: "March", y: activeLead?.MARCH },
                    { label: "April", y: activeLead?.APRIL },
                    { label: "May", y: activeLead?.MAY },
                    { label: "June", y: activeLead?.JUNE },
                    { label: "July", y: activeLead?.JULY },
                    { label: "August", y: activeLead?.AUGUST },
                    { label: "September", y: activeLead?.SEPTEMBER },
                    { label: "October", y: activeLead?.OCTOBER },
                    { label: "November", y: activeLead?.NOVEMBER },
                    { label: "December", y: activeLead?.DECEMBER },
                ]
            }]
        }

        //token receive lead
        this.tokenReceiveLeaderBoard = {
            animationEnabled: true,
            axisY: {
                includeZero: true,
                suffix: "item"
            },
            dataPointWidth: 15,
            data: [{
                type: "bar",
                indexLabel: "{y}",
                yValueFormatString: "#,### item",
                dataPoints: [
                    { label: "January", y: tokenReceiveLead?.JANUARY },
                    { label: "February", y: tokenReceiveLead?.FEBRUARY },
                    { label: "March", y: tokenReceiveLead?.MARCH },
                    { label: "April", y: tokenReceiveLead?.APRIL },
                    { label: "May", y: tokenReceiveLead?.MAY },
                    { label: "June", y: tokenReceiveLead?.JUNE },
                    { label: "July", y: tokenReceiveLead?.JULY },
                    { label: "August", y: tokenReceiveLead?.AUGUST },
                    { label: "September", y: tokenReceiveLead?.SEPTEMBER },
                    { label: "October", y: tokenReceiveLead?.OCTOBER },
                    { label: "November", y: tokenReceiveLead?.NOVEMBER },
                    { label: "December", y: tokenReceiveLead?.DECEMBER },
                ]
            }]
        }

        //success lead
        this.leadWinLeaderBoard = {
            animationEnabled: true,
            axisY: {
                includeZero: true,
                suffix: "item"
            },
            dataPointWidth: 15,
            data: [{
                type: "bar",
                indexLabel: "{y}",
                yValueFormatString: "#,### item",
                dataPoints: [
                    { label: "January", y: successLead?.JANUARY },
                    { label: "February", y: successLead?.FEBRUARY },
                    { label: "March", y: successLead?.MARCH },
                    { label: "April", y: successLead?.APRIL },
                    { label: "May", y: successLead?.MAY },
                    { label: "June", y: successLead?.JUNE },
                    { label: "July", y: successLead?.JULY },
                    { label: "August", y: successLead?.AUGUST },
                    { label: "September", y: successLead?.SEPTEMBER },
                    { label: "October", y: successLead?.OCTOBER },
                    { label: "November", y: successLead?.NOVEMBER },
                    { label: "December", y: successLead?.DECEMBER },
                ]
            }]
        }

        //failed lead
        this.leadLossLeaderBoard = {
            animationEnabled: true,
            axisY: {
                includeZero: true,
                suffix: "item"
            },
            dataPointWidth: 15,
            data: [{
                type: "bar",
                indexLabel: "{y}",
                yValueFormatString: "#,### item",
                dataPoints: [
                    { label: "January", y: failedLead?.JANUARY },
                    { label: "February", y: failedLead?.FEBRUARY },
                    { label: "March", y: failedLead?.MARCH },
                    { label: "April", y: failedLead?.APRIL },
                    { label: "May", y: failedLead?.MAY },
                    { label: "June", y: failedLead?.JUNE },
                    { label: "July", y: failedLead?.JULY },
                    { label: "August", y: failedLead?.AUGUST },
                    { label: "September", y: failedLead?.SEPTEMBER },
                    { label: "October", y: failedLead?.OCTOBER },
                    { label: "November", y: failedLead?.NOVEMBER },
                    { label: "December", y: failedLead?.DECEMBER },
                ]
            }]
        }

        //lead win factor
        const winDataPoints = [
            { y: leadWinFactor?.offices?.toFixed(2), name: "Offices" },
            { y: leadWinFactor?.shops?.toFixed(2), name: "Shops" },
            { y: leadWinFactor?.open_floor?.toFixed(2), name: "Open floor" },
            { y: leadWinFactor?.office_apartments?.toFixed(2), name: "Office apartments" },
            { y: leadWinFactor?.duplex?.toFixed(2), name: "Duplex" },
            { y: leadWinFactor?.piazas?.toFixed(2), name: "Piazas" },
            { y: leadWinFactor?.buildings?.toFixed(2), name: "Buildings" },
            { y: leadWinFactor?.plots?.toFixed(2), name: "Plots" },
            { y: leadWinFactor?.warehouse?.toFixed(2), name: "Warehouse" },
            { y: leadWinFactor?.factory?.toFixed(2), name: "Factory" },
            { y: leadWinFactor?.apartments?.toFixed(2), name: "Apartments" },
            { y: leadWinFactor?.rooms?.toFixed(2), name: "Rooms" },
            { y: leadWinFactor?.penthouses?.toFixed(2), name: "Penthouses" }
        ];
        console.log(winDataPoints, 'winDataPoints');
        this.leadWinFactors = {
            animationEnabled: true,
            data: [{
                type: "pie",
                startAngle: -90,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###.##'%'",
                dataPoints: winDataPoints?.filter(item => parseFloat(item.y) !== 0)
            }]
        }

        //lead loss factor
        const lossDataPoints = [
            { y: leadLossFactor?.offices?.toFixed(2), name: "Offices" },
            { y: leadLossFactor?.shops?.toFixed(2), name: "Shops" },
            { y: leadLossFactor?.open_floor?.toFixed(2), name: "Open floor" },
            { y: leadLossFactor?.office_apartments?.toFixed(2), name: "Office apartments" },
            { y: leadLossFactor?.duplex?.toFixed(2), name: "Duplex" },
            { y: leadLossFactor?.piazas?.toFixed(2), name: "Piazas" },
            { y: leadLossFactor?.buildings?.toFixed(2), name: "Buildings" },
            { y: leadLossFactor?.plots?.toFixed(2), name: "Plots" },
            { y: leadLossFactor?.warehouse?.toFixed(2), name: "Warehouse" },
            { y: leadLossFactor?.factory?.toFixed(2), name: "Factory" },
            { y: leadLossFactor?.apartments?.toFixed(2), name: "Apartments" },
            { y: leadLossFactor?.rooms?.toFixed(2), name: "Rooms" },
            { y: leadLossFactor?.penthouses?.toFixed(2), name: "Penthouses" }
        ];
        console.log(lossDataPoints, 'lossDataPoints');

        this.leadLossFactors = {
            animationEnabled: true,
            data: [{
                type: "pie",
                startAngle: -90,
                indexLabel: "{name}: {y}",
                yValueFormatString: "#,###.##'%'",
                dataPoints: lossDataPoints?.filter(item => parseFloat(item.y) !== 0)
            }]
        }
    }


    leadModel() {
        const dialogRef = this.dialog.open(LeadDetail, {
            width: '800px',
            data: {
                leads: [],
                show_filter: ''
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }




}


@Component({
    selector: 'lead-details-model',
    templateUrl: './lead-details-model.html',
    styleUrls: ['./dashboard.component.scss']
})
export class LeadDetail {
    tokenId = this.common.mycookie.bearertoken;
    branch_list = [];
    changeBranch = '';
    team_list = [];
    team_member = [];
    team_id = '';
    member_id = '';
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<LeadDetail>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        public dialog: MatDialog,
        private common: CommonService) {
    }

    ngOnInit() {
        this.getBranch();
        this.leadModels();
    }




    getBranch() {
        const postdatet = {
            'api_token': this.tokenId,
        }
        this.dataService.create(postdatet, 'sys-branch-list')
            .subscribe(
                data => {
                    if (data.response === 200) {
                        this.branch_list = data.branch;
                        if (data.branch.length > 0) {
                            this.changeBranch = data.branch[0].id;
                            this.onBranch(this.changeBranch)
                        }
                    } else if (data.response === 400) {
                        this.branch_list = [];
                    }
                },
                (error: AppError) => {
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error; }
                });
    }

    onBranch(event) {
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
                        if (data.list.length > 0) {
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
        if (event) {
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

    clickMemberData(event) {
        this.member_id = event ? event : '';
        this.leadModels();
    }

    leadModels() {
        const postdate = {
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
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error };
                });
    }


}