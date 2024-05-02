import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { DataService } from '../../../../services/data.service';
import { BadInput } from '../../../../core_classes/bad-input';
import { AppError } from '../../../../core_classes/app-error';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  property_id: number;
  details: any;
  api_token: string;
  operation: string;
}
@Component({
  selector: 'app-qc-property-pending-list',
  templateUrl: './qc-property-pending-list.component.html',
  styleUrls: ['./qc-property-pending-list.component.scss']
})
export class QcPropertyPendingListComponent implements OnInit {
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
  productStatus = 0;
  pageBuffer = false;

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
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
    return this.common.permission('data-collector/qc-property-list', type);
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
    this.dataService.getAll('data-collector/list' + postdate)
      .subscribe(async(res) => {
          this.pageBuffer = false;
          if (res.code === 200) {
            this.collection =  await res.list.data;
            this.totalrow =  await res.list.total;
          } else if (res.code === 404) {
            this.collection = [];
            this.totalrow = 0;
            this.common.openTost('error','ERROR', res.message);
          }
        },
        (error: AppError) => {
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }

  openRedModel(property) {
    console.log(property);
    const dialogRef = this.dialog.open( QcPendingModel, {
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

  opendeleteModel(property) {
    const dialogRef = this.dialog.open( QcPendingDeleteModel, {
      data: {
        property_id: property.id,
        api_token: this.tokenId,
        operation: 'Delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

}
@Component({
  selector: 'qc-pending',
  templateUrl: './qc-pending-modal.html',
  styleUrls: ['./qc-property-pending-list.component.scss']
})
export class QcPendingModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken ;
  constructor(public dialogRef: MatDialogRef<QcPendingModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }

  onClick(status, id: number) {
    const inputData = {
      'api_token': this.tokenId,
      'status': status,
      'id': id,
    };
    this.dataService.create(inputData, 'data-collector/action')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.dialogRef.close();
            this.common.openTost('success','SUCCESS', data.message);
            this.common.AClicked('Component A is clicked!!');
          } else if (data.code === 400) {
            this.common.openTost('warning','WARNING', data.message);
          } else if (data.code === 404) {
            this.common.openTost('warning','WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }

}

@Component({
  selector: 'qc-pending-delete',
  templateUrl: './delete-qc-model.html',
  styleUrls: ['./qc-property-pending-list.component.scss']
})
export class QcPendingDeleteModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;

  constructor(public dialogRef: MatDialogRef<QcPendingDeleteModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }

  onClick() {
    const inputData = {
      'api_token': this.tokenId,
      'id': this.data.property_id,
    };
    this.dataService.create(inputData, 'data-collector/delete')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.dialogRef.close();
            this.common.openTost('success','SUCCESS', data.message);
            this.common.AClicked('Component A is clicked!!');
          } else if (data.code === 400) {
            this.common.openTost('warning','WARNING', data.message);
          } else if (data.code === 404) {
            this.common.openTost('warning','WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }
}
