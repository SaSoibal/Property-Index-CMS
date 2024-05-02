import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { DataService } from '../../../../services/data.service';
import { BadInput } from '../../../../core_classes/bad-input';
import { AppError } from '../../../../core_classes/app-error';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

export interface DialogData {
  pid: number;
  property_id: number;
  details: any;
  feature: any;
  price_contact: any;
  other: any;
  api_token: string;
  operation: string;
}
@Component({
  selector: 'app-qc-rent-property-pending-list',
  templateUrl: './qc-rent-property-pending-list.component.html',
  styleUrls: ['./qc-rent-property-pending-list.component.scss']
})
export class FSQcRentPendingListComponent implements OnInit {
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
  // status 1 is use for pending property
  pageBuffer = false;

  branch_list =[];
  team_list =[];
  team_member = [];
  changeBranch = '';
  team_id = '';
  member_id = '';

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getBranch();
    this.showList();
    this.common.aClickedEvent
    .subscribe((data: string) => {
      this.showList();
    });

  }

    // branch wise data start
    getBranch(){
      const postdatet = {
        'api_token': this.tokenId,
      }
      this.dataService.create(postdatet, 'sys-branch-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.branch_list = data.branch;
            this.changeBranch = data.branch[0].id;
            this.onBranch(this.changeBranch);
            this.showList();
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
              if(data.list.length == 1){
                this.team_id = data.list[0].id;
                this.teamWiseMember(data.list[0].id)
              }  
              this.showList();
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
      this.team_member = [];
      this.team_id = event?event:'';
      this.member_id = '';
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
                if(data.team_member.length == 1){
                  this.member_id = data.team_member[0].systemuser_id;
                }  
                this.showList();
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
      this.showList();
    }
    // branch wise data end

  permission(type) {
    return this.common.permission('property-management/qc-property-list', type);
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
      + "&branch_id=" + this.changeBranch
      + "&team_id=" + this.team_id
      + "&allocated_to=" + this.member_id
      + "&status=" + this.productStatus  + "";
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
    this.dataService.getAll('for-rent-property/list' + postdate)
      .subscribe(async(res) => {
          this.pageBuffer = false;
          if (res.code === 200) {
            this.collection =  await res.list.data;
            this.totalrow =  await res.list.total;
          } else if (res.code === 400) {
            this.collection = [];
            this.totalrow = 0;
          } else if (res.code === 404) {
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

  openRedModel(property) {
    const queryString = "?"
      + "api_token=" + this.tokenId
      + "&pid=" + property.id;
    this.pageBuffer = true;
    this.dataService.getAll('for-rent-property/details' + queryString)
      .subscribe(async(res) => {
          this.pageBuffer = false;
          if (res.code === 200) {
            this.detailsModel(property, res.details);
          } else if (res.code === 404) {
            this.common.openTost('error', 'ERROR', res.message);
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });

  }
  detailsModel(property, details) {
    if (details?.price_contact?.agreement_upload) {
      details.price_contact.agreement_upload = JSON.parse(details.price_contact.agreement_upload);
    }
    const dialogRef = this.dialog.open( QcRentPendingModel, {
      width: '800px',
      data: {
        property_id: property.id,
        details : property,
        feature : details.feature,
        price_contact : details.price_contact,
        other : details.other,
        api_token: this.tokenId,
        operation: 'Action',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  opendeleteModel(property) {
    const dialogRef = this.dialog.open( QcRentPendingDeleteModel, {
      data: {
        pid: property.id,
        property_id: property.property_id,
        api_token: this.tokenId,
        operation: 'Delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

}
@Component({
  selector: 'app-qc-rent-pending',
  templateUrl: './qc-rent-pending-modal.html',
  styleUrls: ['./qc-rent-property-pending-list.component.scss']
})
export class QcRentPendingModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(public dialogRef: MatDialogRef<QcRentPendingModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService, public sanitizer: DomSanitizer,
              private common: CommonService) {
  }

  getFileType(imgVdo) {
    const img_vdo = imgVdo.url.split('.').pop();
    if (img_vdo === 'jpeg') {
      return 'image';
    } else if (img_vdo === 'jpg') {
      return 'image';
    }else if (img_vdo === 'png') {
      return 'image';
    } else if (img_vdo === 'mov') {
      return 'video';
    } else if (img_vdo === 'mp4') {
      return 'video';
    } else if (img_vdo === '3gp') {
      return 'video';
    } else if (img_vdo === 'ogg') {
      return 'video';
    } else {
      return '';
    }
  }

  onClick(status, id: number) {
    const inputData = {
      'api_token': this.tokenId,
      'status': status,
      'id': id,
    };
    this.dataService.create(inputData, 'for-rent-property/action')
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

@Component({
  selector: 'app-qc-rent-pending-delete',
  templateUrl: './delete-rent-qc-model.html',
  styleUrls: ['./qc-rent-property-pending-list.component.scss']
})
export class QcRentPendingDeleteModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;

  constructor(public dialogRef: MatDialogRef<QcRentPendingDeleteModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }

  onClick() {
    const inputData = {
      'api_token': this.tokenId,
      'id': this.data.pid,
      'property_id': this.data.property_id,
    };
    this.dataService.create(inputData, 'for-rent-property/delete')
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
