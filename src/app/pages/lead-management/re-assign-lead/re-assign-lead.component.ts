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
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';


export interface DialogData {
  selected_lead:any,
  branch_list:any,
  assign_user:any,
  branch_id:number,
  team_id:number,
  team_manager:string,
  manager_id:number,
  user_id:number,
  note:string,
  operation: string;
}


@Component({
  selector: 'app-re-assign-lead',
  templateUrl: './re-assign-lead.component.html',
  styleUrls: ['./re-assign-lead.component.scss']
})
export class ReAssignLeadComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
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
  pageBuffer = false;
  checked_all= false;
  date_to_date ='';
  checked_all_count =0;

  selected_lead=[];
  team_list = [];
  filter_type = '';
  manager_id ='';
  team_member_id = '';
  reassign = '';
  branch_list =[];
  changeBranch = '';
  team_id = '';
  member_id = '';
  team_member = [];

  constructor(private fb: FormBuilder, 
    private common: CommonService, 
    private dataService: DataService, 
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getBranch();
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
          } else {
            this.team_list = [];
          }
          this.showList();
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
      
  }

  teamWiseMember(event) {
    this.team_member = [];
    this.member_id = '';
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

  assignModel() {
    this.selected_lead = [];
    this.collection.forEach(element => {
      if(element.checked==true){
        this.selected_lead.push(element.tasks);
      }
    });
    const dialogRef = this.dialog.open( ReAssignModel, {
      width: '500px',
      data: {
        selected_lead: this.selected_lead,
        branch_list: this.branch_list,
        branch_id:'',
        team_id:'',
        team_manager:'',
        manager_id:'',
        user_id:'',
        note:'',
        api_token: this.tokenId,
        operation: 'Submit'
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      this.showList();
    });
  }

  clickCheckedAll(event){
    this.checked_all_count = 0
    this.collection.forEach(element => {
      element.checked = event;
      if(element.checked == true){
        this.checked_all_count = 1; 
      }
    });
  }

  singleChecked(event){
    this.checked_all_count = 0
    this.collection.forEach(element => {
      if(element.checked == true){
        this.checked_all_count = 1; 
      }
    });
  }


  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  onChangeReassign(event){
    this.reassign = event;
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
         + "&date_to_date=" +  this.date_to_date
         + "&api_token=" +  this.tokenId
         + "&branch_id=" +  this.changeBranch
         + "&team_id=" +  this.team_id
         + "&team_member_id=" +  this.member_id
         + "&reassign=" +  this.reassign;
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
  onChangeDateRange(result: Date[]){
    if(result.length > 0){
      this.date_to_date = formatDate(result[0], 'Y-MM-d', 'en-US') +','+ formatDate(result[1], 'Y-MM-d', 'en-US');
    }else{
      this.date_to_date ='';
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
    this.dataService.getAll('lead-re-assign-list/'+curl)
    .subscribe(async(data)=> {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.checked_all= false;
          this.collection = await data.list.data;
          this.collection.forEach(element => {
            element.checked = false;
          });
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

  leadNoGenerate(lead:number){
    return String(lead).padStart(6, '0')
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


@Component({
  selector: 're-assign-model',
  templateUrl: './re-assign-model.html',
  styleUrls: ['./re-assign-lead.component.scss']
})
export class ReAssignModel {
  tokenId = this.common.mycookie.bearertoken ;
  pageBuffer = false;
  team_list = [];
  team_member = [];
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReAssignModel>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  changeBranch(event){
    this.data.team_id = 0;
    this.team_list = [];
    this.data.manager_id = 0;
    this.data.team_manager = '';
    this.team_member = [];
    const postdatet = {
      'api_token': this.tokenId,
      'branch_id': event
    };
    this.dataService.create(postdatet, 'common/branch-wise-team-list')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.team_list = data.list;
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
    if(event){
      this.data.manager_id = 0;
      this.data.team_manager = '';
      this.team_member = [];
      const postdatet = {
        'api_token': this.tokenId,
        'team_id': event,
      };
      this.dataService.create(postdatet, 'common/team-member')
        .subscribe(
          data => {
            if (data.response === 200) {
              this.data.manager_id = data?.team_manager?.id;
              this.data.team_manager = data?.team_manager?.name;
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
  }


  onClick(): void {
    const dataList = {
        api_token: this.tokenId,
        selected_lead:this.data.selected_lead,
        branch_id:this.data.branch_id,
        team_id:this.data.team_id,
        manager_id:this.data.manager_id,
        user_id:this.data.user_id,
        note:this.data.note,
        operation: this.data.operation,
    }
    this.pageBuffer = true;
    this.dataService.create(dataList, 're-assign-lead')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 400) {
        this.common.openTost('warning','WARNING',data.message);
      }
      this.pageBuffer = false;
    },
    (error: AppError) => {
      this.common.onMainEvent.emit(false);
      this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
      } else { throw error };
    });
  }
}

