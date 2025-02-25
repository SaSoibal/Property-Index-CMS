import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppError } from 'src/app/core_classes/app-error';
import { BadInput } from 'src/app/core_classes/bad-input';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-loan-apply',
    templateUrl: './loan-apply.component.html',
    styleUrls: ['./loan-apply.component.scss']
})
export class LoanApplyComponent implements OnInit {

    tokenId = this.common.mycookie.bearertoken;
    rootUrl = this.common.rootUrl + 'public/uploads/';
    erroeMsg = '';
    totalrow = 0;
    itemPerPage = 10;
    pageNumber = 0;
    pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
    dataOrderBy = true;
    sortColumn = 'id';
    searchValues: String = '';
    collection = [];
    dataNotFound = '';


    constructor (
        private fb: FormBuilder,
        private common: CommonService,
        private dataService: DataService
    ) { }

    ngOnInit() {
        this.common.checkCookie();
        this.showList();
        this.common.aClickedInterior
            .subscribe((data: string) => {
                this.showList();
            });

    }

    permission(type) {
        return this.common.permission('loan/benefits', type);
    }

    getSL(i) {
        return (Number(this.itemPerPage) * Number(this.pageNumber)) + i;
    }

    showList() {
        let orderBy: string;
        if (this.dataOrderBy === true) {
            orderBy = 'DESC';
        } else {
            orderBy = 'ASC';
        }
        const queryString = "?"
            + "api_token=" + this.tokenId
            + "&search=" + this.searchValues
            + "&sort_column=" + this.sortColumn
            + "&sort_by=" + orderBy
            + "&per_page=" + this.itemPerPage
            + "&page=" + this.pageNumber + "";
        this.get_list(queryString);
    }

    pageEvent(event) {
        this.pageNumber = event.pageIndex;
        this.itemPerPage = event.pageSize;
        this.showList();
    }

    sort(column: string) {
        if (this.sortColumn === column) {
            this.dataOrderBy = !this.dataOrderBy;
        } else {
            this.sortColumn = column;
        }
        this.showList();
    }

    filter(value: string) {
        this.searchValues = value;
        this.pageNumber = 0;
        this.showList();
    }

    clearFilter() {
        this.searchValues = '';
        this.pageNumber = 0;
        this.showList();
    }

    get_list(postdate) {
        this.dataService.getAll('loan-apply-list' + postdate)
            .subscribe(async (res) => {
                if (res.response === 200) {
                    this.collection = await res.list.data;
                    this.totalrow = await res.list.total;
                } else if (res.response === 404) {
                    this.collection = [];
                    this.totalrow = 0;
                    this.common.openTost('error', 'ERROR', res.message);
                }
            },
                (error: AppError) => {
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error; }
                });
    }

}
