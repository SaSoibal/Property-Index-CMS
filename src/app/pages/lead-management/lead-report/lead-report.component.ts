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

export interface DialogData {
  step: number,
  branch_id: number,
  team_name: string,
  member_name: string,
  team_id: number,
  member_id: number,
  leadfilter: string,
  operation: string
}

@Component({
  selector: 'app-lead-report',
  templateUrl: './lead-report.component.html',
  styleUrls: ['./lead-report.component.scss']
})
export class LeadReportComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  erroeMsg = '';
  totalrow = 0;
  itemPerPage = 10;
  pagereqest = 1;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  public searchValues: string = '';
  collection=[];
  dataNotFound = '';
  pageBuffer = false;
  date_to_date ='';
  branch_list =[];
  changeBranch = '';
  leadfilter = '';
  team_list = [];
  team_member = [];
  team_id = '';
  member_id = '';

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
    this.common.aClickedEvent
    .subscribe((data:string) => {
      this.showList();
    });
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
            this.onBranch(this.changeBranch);
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
    this.team_id = '';
    this.member_id = '';
    this.changeBranch = event?event:'';
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
              this.showList();
              this.teamWiseMember(data.list[0].id);
            } 
          } else {
            this.team_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });

  }

  teamWiseMember(event) {
    this.team_id = event?event:'';
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
      this.showList();
  }

  
  permission(type) {
    return this.common.permission('lead-manage/lead-re-assign',type);
  }

  clickMemberData(event){
    this.member_id = event?event:'';
    this.showList();
  }

  getSL(i: number) {
    return (Number(this.itemPerPage) * (Number(this.pagereqest) - 1)) + i
  }

  leadFilter(event) {
    this.leadfilter = event?event:'';
    this.pagereqest = 1;
    this.showList();
  }
  
  onChangeDateRange(result: Date[]){
    if(result.length > 0){
      this.date_to_date = formatDate(result[0], 'Y-MM-d', 'en-US') +','+ formatDate(result[1], 'Y-MM-d', 'en-US');
    }else{
      this.date_to_date ='';
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
         + "&page=" + this.pagereqest 
         + "&branch_id=" + this.changeBranch 
         + "&lead_filter=" +  this.leadfilter
         + "&team_id=" +  this.team_id
         + "&member_id=" +  this.member_id
         + "&date_to_date=" +  this.date_to_date
         + "&api_token=" +  this.tokenId
       this.get_list(curl);
  } 

  pageEvent(event){
    this.pagereqest = event.pageIndex+1;
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
    this.pagereqest = 1;
    this.showList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pagereqest = 1;
    this.showList();
  }

  get_list(curl) {
    if(this.changeBranch){
      this.pageBuffer = true;
      this.dataService.getAll('get-lead-report/'+curl)
      .subscribe(async(data)=> {
          this.pageBuffer = false;
          if (data.response === 200) {
            this.collection = await data.list.data;
            this.totalrow = await data.list.total;
            this.dataNotFound = '';
          } else if (data.response === 400) {
            this.collection = [];
            this.totalrow = 0;
            this.dataNotFound = data.message;
          }
        },
        (error: AppError) => {
          this.common.openTost('error','ERROR','Please try again later');
        if (error instanceof BadInput) {
          } else { throw error };
        });
    }
  }

  leadNoGenerate(lead:number){
    return String(lead).padStart(6, '0')
  }

  clickCountForDetails(leads,step){
    const dialogRef = this.dialog.open( StepWiseLeadModel, {
      width: '1000px',
      data: {
        step: step,
        team_name: leads.teams?leads.teams?.name:'',
        member_name: leads.member?leads.member.name:'',
        branch_id: this.changeBranch,
        team_id: leads.team_setup_id,
        member_id: leads.systemuser_id,
        leadfilter: this.leadfilter,
        operation: 'List'
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }
}

@Component({
  selector: 'report-details-model',
  templateUrl: './report-details-model.html',
  styleUrls: ['./lead-report.component.scss']
})
export class StepWiseLeadModel implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  pageBuffer = false;
  collection = [];
  totalrow = 0;
  search = '';
  date_to_date ='';
  itemPerPage = 10;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  pagereqest = 1;
  today = new Date().toISOString().slice(0, 10);
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<StepWiseLeadModel>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }
  ngOnInit() {
    this.get_list();
  }
  leadNoGenerate(lead: number) {
    return String(lead).padStart(6, '0');
  }

  onChangeSearch(event) {
    this.search = event?event:'';
    this.pagereqest = 1;
    this.get_list();
  }
  pageEvent(event){
    this.pagereqest = event.pageIndex+1;
    this.itemPerPage = event.pageSize;
    this.get_list();
  }
  get_list() {
    const curl = "?"
    + "step=" + this.data.step
    + "&branch_id=" + this.data.branch_id
    + "&team_id=" + this.data.team_id
    + "&member_id=" + this.data.member_id
    + "&lead_filter=" + this.data.leadfilter
    + "&search=" + this.search
    + "&per_page=" +  this.itemPerPage
    + "&page=" + this.pagereqest 
    + "&api_token=" +  this.tokenId;
    this.pageBuffer = true;
    this.dataService.getAll('get-step-wise-lead-report/'+curl)
    .subscribe(async(data)=> {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.collection = await data.list.data;
          this.totalrow = await data.list.total;
        } else if (data.response === 400) {
          this.collection = [];
          this.totalrow = 0;
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }

}
