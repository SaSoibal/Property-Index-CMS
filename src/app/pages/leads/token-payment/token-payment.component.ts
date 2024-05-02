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
import {EventDetailsModel} from '../calender/calender.component';

export interface DialogData {
  event: any;
  lead_id: any;
}
@Component({
  selector: 'app-lead-list',
  templateUrl: './token-payment.component.html',
  styleUrls: ['./token-payment.component.scss']
})
export class TokenPaymentComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  today = new Date().toISOString().slice(0, 10);
  collection = [];
  totalrow = 0;
  itemPerPage = 10;
  public pageNumber: number = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100, 200, 300, 500];
  dataOrderBy = 'asc';
  sortColumn = 'id';
  pageBuffer = false;

  name = '';
  phone_no = '';
  email = '';
  occupation = '';
  location = '';
  minimum_budget = '';
  maximum_budget = '';
  minimum_size = '';
  maximum_size = '';
  lead_type = '';
  classification = '';
  select_source = '';
  product_type = 0;
  product = '';
  client_type = '';
  lead_id = '';
  stages = '';
  date_to_date = '';
  date = null;
  ranges: any;
  filter = '';
 
  lead_step = [];
  const_status = [];
  occupation_list = [];
  location_list = [];
  classification_list = [];
  select_source_list = [];
  client_type_list = [];

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.leadStep();
    this.leadStatus();
    this.occupationList();
    this.locationList();
    this.classificationList();
    this.sourceList();
    this.clientType();
  }

  permission(type) {
    return this.common.permission('leads/token-payment', type);
  }

  leadStep() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/lead-step')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.lead_step = data.list;
          } else {
            this.lead_step = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  leadStatus() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/lead-status')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.const_status = data.list;
          } else {
            this.const_status = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  occupationList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/occupation')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.occupation_list = data.list;
          } else {
            this.occupation_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
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
  classificationList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/classification')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.classification_list = data.list;
          } else {
            this.classification_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  sourceList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/select-source')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.select_source_list = data.list;
          } else {
            this.select_source_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  clientType() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/client-type')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.client_type_list = data.list;
          } else {
            this.client_type_list = [];
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

  clickSearch() {
    this.showList();
  }

  clickClear() {
    this.name = '';
    this.phone_no = '';
    this.email = '';
    this.occupation = '';
    this.location = '';
    this.minimum_budget = '';
    this.maximum_budget = '';
    this.minimum_size = '';
    this.maximum_size = '';
    this.lead_type = '';
    this.classification = '';
    this.select_source = '';
    this.product_type = 0;
    this.product = '';
    this.client_type = '';
    this.lead_id = '';
    this.stages = '';
    this.date_to_date = '';
    this.showList();
  }

  onChangeLeadType(type) {
    this.lead_type = type;
    this.pageNumber = 1;
  }
  onChangeLeadID(lead) {
    this.lead_id = lead;
    this.pageNumber = 1;
  }
  onChangeDateRange(result: Date[]) {
    if (result.length > 0) {
      this.date_to_date = formatDate(result[0], 'Y-MM-d', 'en-US') +','+ formatDate(result[1], 'Y-MM-d', 'en-US');
    } else {
      this.date_to_date = '';
    }
  }

  onChangeStages(stages) {
    this.stages = stages;
    this.pageNumber = 1;
  }
  onChangePerPage(item) {
    this.itemPerPage = item;
    this.pageNumber = 1;
  }
  onChangeSortColumn(item) {
    this.sortColumn = item;
    this.pageNumber = 1;
  }
  onChangeOrderBy(order) {
    this.dataOrderBy = order;
    this.pageNumber = 1;
  }

  pageEvent(event) {
    this.pageNumber = event.pageIndex;
    this.itemPerPage = event.pageSize;
    this.showList();
  }
  leadFilter(event) {
    this.filter = event;
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
       + "&name=" + this.name
       + "&phone_no=" + this.phone_no
       + "&email=" + this.email
       + "&occupation=" + this.occupation
       + "&location=" + this.location
       + "&minimum_budget=" + this.minimum_budget
       + "&maximum_budget=" + this.maximum_budget
       + "&minimum_size=" + this.minimum_size
       + "&maximum_size=" + this.maximum_size
       + "&lead_type=" + this.lead_type
       + "&classification=" + this.classification
       + "&select_source=" + this.select_source
       + "&product_type=" + this.product_type
       + "&product=" + this.product
       + "&client_type=" + this.client_type
       + "&lead_id=" + this.lead_id
       + "&stages=" + this.stages
       + "&filter=" + this.filter
       this.get_list(curl);
  }

  get_list(curl) {
    this.pageBuffer = true;
    this.dataService.getAll('token-payment/index/' + curl)
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

  viewTokenProperty(leads) {
    this.pageBuffer = true;
    const postdate = {
      'api_token': this.tokenId,
      'lead_id': leads.id
    };
    this.dataService.create(postdate, 'token-payment/property-list')
      .subscribe(
        async(data) => {
          if (data.response === 200) {
            this.openTokenDetails(leads,data.list);
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
  openTokenDetails(leads,event) {
    const dialogRef = this.dialog.open( TokenDetailsModel, {
      width: '800px',
      data: {
        lead_id: leads.id,
        event: event,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

}


@Component({
  selector: 'app-token-details',
  templateUrl: './property-details-modal.html',
  styleUrls: ['./token-payment.component.scss']
})
export class TokenDetailsModel {
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/property/';

  constructor(public dialogRef: MatDialogRef<TokenDetailsModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData, private common: CommonService) {
  }

  leadNoGenerate(lead: number) {
    return String(lead).padStart(6, '0');
  }
}



