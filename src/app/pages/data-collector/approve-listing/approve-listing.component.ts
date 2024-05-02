import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  property_id: number;
  details: any;
  branch_list: any;
  branch_id:number,
  team_id:number,
  team_manager:string,
  manager_id:number,
  user_id:number,
  note:string;
  api_token: string;
  operation: string;
}
@Component({
  selector: 'app-dc-form',
  templateUrl: './approve-listing.component.html',
  styleUrls: ['./approve-listing.component.scss']
})
export class ApproveListingComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  totalrow = 0;
  itemPerPage = 10;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection = [];
  productStatus = 1;
  pageBuffer = false;
  branch_list =[];
  constructor(private fb: FormBuilder,
              private common: CommonService,
              private dataService: DataService,
              public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.getBranch();
    this.common.aClickedEvent
      .subscribe((data: string) => {
        this.showList();
        this.getBranch();
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


  permission(type) {
    return this.common.permission('data-collector/qc-property-list', type);
  }
  dcPermission(type) {
    return this.common.permission('data-collector/dc-form', type);
  }

  changeList(status: number) {
    this.productStatus = status;
    this.showList();
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
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
      + "&status=" + this.productStatus;
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
    this.dataService.getAll('data-collector/list' + postdate)
      .subscribe(async(res) => {
          if (res.code === 200) {
            this.collection =  await res.list.data;
            this.totalrow =  await res.list.total;
          } else if (res.code === 404) {
            this.collection = [];
            this.totalrow = 0;
            this.common.openTost('error','ERROR', res.message);
          }
          this.pageBuffer = false;
        },
        (error: AppError) => {
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }

  openRedModel(property) {
    const dialogRef = this.dialog.open( QcApproveModel, {
      width: '600px',
      data: {
        property_id: property.id,
        details : property,
        api_token: this.tokenId,
        operation: 'Submit',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openAllocateModel(property) {
    const dialogRef = this.dialog.open( ApproveAllocateModel, {
      width: '900px',
      data: {
        property_id: property.id,
        details : property,
        branch_list:this.branch_list,
        branch_id:'',
        team_id:'',
        team_manager:'',
        manager_id:'',
        user_id:'',
        note:'',
        api_token: this.tokenId,
        operation: 'Submit',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }
}

@Component({
  selector: 'qc-approve',
  templateUrl: './qc-approve-modal.html',
  styleUrls: ['./approve-listing.component.scss']
})
export class QcApproveModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;

  constructor(public dialogRef: MatDialogRef<QcApproveModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }
}

@Component({
  selector: 'assign-approve-modal',
  templateUrl: './assign-approve-modal.html',
  styleUrls: ['./approve-listing.component.scss']
})
export class ApproveAllocateModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  team_list = [];
  team_member = [];
  constructor(public dialogRef: MatDialogRef<ApproveAllocateModel>,
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

  onClick(){
    const inputData = {
      'api_token': this.tokenId,
      'property_id': this.data.property_id,
      'branch_id': this.data.branch_id,
      'team_id': this.data.team_id,
      'manager_id': this.data.manager_id,
      'allocated_to': this.data.user_id,
    };
    this.dataService.create(inputData, 'data-collector/assign-property')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.dialogRef.close();
            this.common.openTost('success', 'SUCCESS', data.message);
            this.common.AClicked('Component A is clicked!!');
          } else if (data.code === 400) {
            this.common.openTost('warning', 'WARNING', data.message);
          } else if (data.code === 404) {
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
}
