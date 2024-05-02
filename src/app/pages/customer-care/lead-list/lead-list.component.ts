import { Component, ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';


@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
})
export class LeadListComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  collection = [];
  totalrow = 0;
  itemPerPage = 10;
  public pageNumber: number = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100, 200, 300, 500];
  dataOrderBy = 'asc';
  sortColumn = 'id';
  pageBuffer = false;
  filter = '';
  branch_list =[];
  changeBranch = '';
  search = '';
  location = '';
  location_list = [];
  date_to_date ='';

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.getBranch();
    this.locationList();
    this.common.aClickedEvent
    .subscribe((data: string) => {
      this.showList();
    });

  }

  permission(type) {
    return this.common.permission('customer-care/lead-list', type);
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
            this.showList();
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
    this.showList();
  }
  locationList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/all-location-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.location_list = data.list;
          } else {
            this.location_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }
  onChangeDateRange(result: Date[]){
    if(result.length > 0){
      this.date_to_date = formatDate(result[0], 'Y-MM-d', 'en-US') +','+ formatDate(result[1], 'Y-MM-d', 'en-US');
    }else{
      this.date_to_date ='';
    }
    this.showList();
  }
  onChangePerPage(item) {
    this.itemPerPage = item;
    this.pageNumber = 1;
    this.showList();
  }
  onChangeOrderBy(order) {
    this.dataOrderBy = order?order:'asc';
    this.pageNumber = 1;
    this.showList();
  }
  pageEvent(event) {
    this.pageNumber = event.pageIndex;
    this.itemPerPage = event.pageSize;
    this.showList();
  }
  leadFilter(event) {
    this.filter = event?event:'';
    this.pageNumber = 1;
    this.showList();
  }
  onChangeSearch(event) {
    this.search = event?event:'';
    this.pageNumber = 1;
    this.showList();
  }
  onChangeLocation(event) {
    this.location = event?event:'';
    this.pageNumber = 1;
    this.showList();
  }

  showList() {
       const curl = "?"
         + "per_page=" + this.itemPerPage
         + "&sort_by=" + this.dataOrderBy
         + "&sort_column=" +  this.sortColumn
         + "&page=" + this.pageNumber
         + "&api_token=" +  this.tokenId
         + "&filter=" + this.filter
         + "&branch_id=" + this.changeBranch
         + "&search=" + this.search
         + "&location=" + this.location
         + "&date_to_date=" + this.date_to_date;
       this.get_list(curl);
  }

  get_list(curl) {
    this.pageBuffer = true;
    if(this.changeBranch){
      this.dataService.getAll('customer-care/lead-list/' + curl)
      .subscribe(async(data) => {
          this.pageBuffer = false;
          if (data.code === 200) {
            this.collection = await data.list.data;
            this.totalrow = await data.list.total;
          } else if (data.response === 400) {
            this.collection = [];
            this.totalrow = await data.list.total;
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
          } else { throw error; }
        });
    }else{
      this.pageBuffer = true;
    }
  
  }


  leadNoGenerate(lead: number) {
    return String(lead).padStart(6, '0');
  }


  detailsModel(lead) {
    this.pageBuffer = true;
    const postdate = {
      'api_token': this.tokenId,
      'lead_id': lead.id
    };
    this.dataService.create(postdate, 'common/lead-details')
      .subscribe(
        async(data) => {
          if (data.response === 200) {
            await this.common.leadDetailsModel(lead, data.details, data.process, data.process_start);
            this.pageBuffer = false;
          } else if (data.response === 400) {
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }


}



