import { Component,ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-deal-list',
  templateUrl: './close-leadcomponent.html',
  styleUrls: ['./close-leadcomponent.scss']
})
export class CloseLeadcomponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // process_step = [];
  task_type_list = [];
  total_team_list = [];
  classification = [];
  lead_source_list = [];
  allocated_user_list = [];
  projects_list = [];
  project_type_list = [];
  product_type_list = [];
  client_type_list = [];

  user_type;
  erroeMsg = '';
  totalrow = 0;
  itemPerPage = 10;
  public pageNumber: number = 1;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  public searchValues: string = '';
  collection=[];
  dataNotFound = '';
  today = new Date().toISOString().slice(0, 10);
  selected_date = '';
  selected_date_type = 'only';
  taskStep = 1;
  day_wise_counting = '';
  filter_type = '';
  selectedLeadType ='';
  classifications ='';
  selectedSource = '';
  allocatedUser = '';
  projects = '';
  project_type = '';
  showProjectAndType = 0;
  product_type = '';
  budget_pre = '';
  min_size = '';
  max_size = '';
  showBedBath= 0;
  sizeTypeName= '';
  beds = '';
  baths = '';
  client_types = '';
  date_to_date = '';
  deal_status = 0;
  pageBuffer = false;
  deal_close_type = '';

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.lead_process_list();
    this.common.aClickedEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
      this.lead_process_list();
    });

  }

  permission(type) {
    return this.common.permission('leads/close-leads', type);
  }

  lead_process_list() {
    const postdate = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdate, 'close-lead/process')
    .subscribe(async(data) => {
        if (data.response === 200) {
          this.task_type_list = await data.task_type;
          this.total_team_list = await data.team_list;
          this.classification = await data.classification;
          this.lead_source_list = await data.lead_source;
          this.allocated_user_list = await data.allocated_user;
          this.projects_list = await data.projects;
          this.project_type_list = await data.project_type;
          this.product_type_list = await data.product_type;
          this.client_type_list = await data.client_type;
          this.user_type = data.user_type;
        } else if (data.response === 400) {
          this.task_type_list = [];
          this.total_team_list = [];
          this.classification = [];
          this.lead_source_list = [];
          this.allocated_user_list = [];
          this.projects_list = [];
          this.project_type_list = [];
          this.client_type_list = [];
          this.user_type = [];
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

  getCount(count){
    return count;
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  dealStatusFilter(event){
    this.deal_status = event;
    this.showList();
  }

  leadTypefilter(value: string) {
    if (value == '0') {
      this.selectedLeadType = value;
      this.showProjectAndType = 1;
    } else if (value == '1') {
      this.selectedLeadType = value;
      this.showProjectAndType = 0;
    } else {
      this.selectedLeadType = '';
      this.showProjectAndType = 0;
    }
    this.pageNumber = 1;
    this.showList();
  }
  classificationfilter(value: string) {
    this.classifications = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  sourcefilter(value: string) {
    this.selectedSource = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  allocatedUserfilter(value: string) {
    this.allocatedUser = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  projectsfilter(value: string) {
    this.projects = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  projectTypefilter(value: string) {
    if (value) {
      var type = this.project_type_list.find(x => x.id == value);
      if (type) {
        if (type.options == 'flat') {
          this.showBedBath = 1;
        }else{
          this.showBedBath = 0
        }
      } else {
        this.showBedBath = 0;
      }
    } else {
      this.showBedBath = 0;
    }
    this.project_type = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }

  productTypefilter(value: string) {
    if(value){
      var type = this.product_type_list.find(x => x.id == value);
      if (type) {
        if (type.type_option == 'flat') {
          this.sizeTypeName = '(Sft)';
        }
        if (type.type_option == 'land') {
          this.sizeTypeName = '(Katha)';
        }
      } else {
        this.sizeTypeName = '';
      }
    } else {
      this.sizeTypeName = '';
    }
    this.product_type = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  bedsfilter(value: string) {
    this.beds = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  bathsfilter(value: string) {
    this.baths = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  clientTypefilter(value: string) {
    this.client_types = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  dealCloseType(value: string) {
    this.deal_close_type = value ? value : '';
    this.pageNumber = 1;
    this.showList();
  }
  onChangeDateRange(result: Date[]){
    if(result.length > 0){
      this.date_to_date = formatDate(result[0], 'Y-MM-d', 'en-US') +','+ formatDate(result[1], 'Y-MM-d', 'en-US');
    }else{
      this.date_to_date = '';
    }
    this.showList();
  }

  showList() {
    let orderBy: string;
    if (this.dataOrderBy === true) {
      orderBy = 'DESC';
    } else {
      orderBy = 'ASC';
    }
       const curl = "?"
         + "search=" + this.searchValues
         + "&per_page=" +  this.itemPerPage
         + "&sort_by=" + orderBy
         + "&sort_column=" +  this.sortColumn
         + "&page=" + this.pageNumber
         + "&api_token=" +  this.tokenId
         + "&lead_type=" + this.selectedLeadType
         + "&classification=" + this.classifications
         + "&lead_source=" + this.selectedSource
         + "&allocated_user=" + this.allocatedUser
         + "&projects=" + this.projects
         + "&project_type=" + this.project_type
         + "&product_type=" + this.product_type
         + "&budget_pre=" + this.budget_pre
         + "&min_size=" + this.min_size
         + "&max_size=" + this.max_size
         + "&beds=" + this.beds
         + "&baths=" + this.baths
         + "&client_type=" + this.client_types
         + "&date_to_date=" + this.date_to_date
         + "&deal_status=" + this.deal_status
         + "&deal_close_type=" + this.deal_close_type;
       this.get_list(curl);
  }

  pageEvent(event){
    this.pageNumber = event.pageIndex + 1;
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
    this.pageNumber = 1;
    this.showList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageNumber = 1;
    this.showList();
  }

  get_list(curl) {
    this.pageBuffer = true;
    this.dataService.getAll('close-lead/index' + curl)
    .subscribe(async(data) => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.collection = await data.list.data;
          this.totalrow = await data.list.total;
          this.dataNotFound = '';
        } else if (data.response === 400) {
          this.collection = [];
          this.totalrow = await data.list.total;
          this.dataNotFound = data.message;
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



}







