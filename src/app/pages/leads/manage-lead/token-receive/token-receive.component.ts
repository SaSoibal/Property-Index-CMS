import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from '../../../../services/data.service';
import { BadInput } from '../../../../core_classes/bad-input';
import { AppError } from '../../../../core_classes/app-error';

export interface DialogData {
  tenants_id: string;
  name: string;
  status: string;
  operation: string;
}

@Component({
  selector: 'app-token-receive',
  templateUrl: './token-receive.component.html',
  styleUrls: ['./token-receive.component.scss']
})
export class TokenReceiveComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  today = new Date().toISOString().slice(0, 10);
  erroeMsg = '';
  totalrow = 0;
  itemPerPage = 10;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection = [];
  pageBuffer = false;
  dataNotFound = '';
  step = 8;

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.common.aClickedEvent
    .subscribe((data: string) => {
      this.showList();
    });

  }
  permission(type) {
    return this.common.permission('leads/manage-leads', type);
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  leadNoGenerate(lead: number) {
    return String(lead).padStart(6, '0');
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
      + "&page=" + this.pageNumber
      + "&step=" + this.step + "";
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
    this.pageBuffer = true;
    this.dataService.getAll('lead-manage/all-lead' + postdate)
      .subscribe(async(res) => {
          if (res.response === 200) {
            this.collection = await res.list.data;
            console.log(this.collection);
            this.totalrow = await res.list.total;
          } else if (res.response === 400) {
            this.collection = [];
            this.totalrow = 0;
          }
          this.pageBuffer = false;
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
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



