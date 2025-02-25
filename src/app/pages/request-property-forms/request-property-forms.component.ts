import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CommonService} from '../../services/common.service';
import {DataService} from '../../services/data.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AppError} from '../../core_classes/app-error';
import {BadInput} from '../../core_classes/bad-input';

export interface DialogData {
  id: string,
  name: string,
  email: string,
  phone: string,
  location: string,
  additionalInfo: string,
  status: string,
  operation: string
}
@Component({
  selector: 'app-request-property-forms',
  templateUrl: './request-property-forms.component.html',
  styleUrls: ['./request-property-forms.component.scss']
})
export class RequestPropertyFormsComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  erroeMsg = '';
  totalrow = 0;
  itemPerPage = 10;
  pagereqest = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection=[];
  dataNotFound = '';


  constructor(private fb: FormBuilder,
              private common: CommonService,
              private dataService: DataService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.common.aClickedEvent
      .subscribe((data:string) => {
        console.log('Event message from Component A: ' + data);
        this.showList();
      });

  }

  permission(type) {
    return this.common.permission('request-property-forms',type);
  }

  openRedModel(RequestPropertyForms) {
    const dialogRef = this.dialog.open( ReadRequestPropertyForms, {
      width: '1000px',
      data: {
        id: RequestPropertyForms.id,
        name: RequestPropertyForms.name,
        email: RequestPropertyForms.email,
        phone: RequestPropertyForms.phone,
        location: RequestPropertyForms.location,
        additionalInfo: RequestPropertyForms.additionalInfo,
        api_token: this.tokenId,
        operation: 'Read',
        status: RequestPropertyForms.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }


  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pagereqest)) + i;
  }

  showList() {
    let orderBy: string;
    if (this.dataOrderBy === true) {
      orderBy = 'DESC';
    } else {
      orderBy = 'ASC';
    }
    const postdatet = {
      'api_token': this.tokenId,
      'rowperpage': this.itemPerPage,
      'pagereqest':  this.pagereqest,
      'order': orderBy,
      'columns': this.sortColumn,
      'search': this.searchValues
    }
    this.get_list(postdatet);
  }

  pageEvent(event){
    this.pagereqest=event.pageIndex;
    this.itemPerPage=event.pageSize;
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
    this.pagereqest = 0;
    this.showList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pagereqest = 0;
    this.showList();
  }

  get_list(postdate) {
    this.dataService.create(postdate, 'request-property-forms-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.collection = data.list;
            this.totalrow = data.totalCount;
            this.dataNotFound = '';
          } else if (data.response === 400) {
            this.collection = data.list;
            this.dataNotFound = data.message;
          }
        },
        (error: AppError) => {
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }

  deleteModel(ctg) {
    const dialogRef = this.dialog.open( DeleteRequestPropertyForms, {
      data: {
        id: ctg.id,
        name: ctg.name,
        email:ctg.email,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }
}

@Component({
  selector: 'read-request-property-forms-model',
  templateUrl: './read-request-property-forms-model.html',
  styleUrls: ['./request-property-forms.component.scss']
})
export class ReadRequestPropertyForms {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadRequestPropertyForms>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }
}

@Component({
  selector: 'delete-request-property-forms-modal',
  templateUrl: './delete-request-property-forms-model.html',
  styleUrls: ['./request-property-forms.component.scss']
})
export class DeleteRequestPropertyForms {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteRequestPropertyForms>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'request-property-forms-delete')
      .subscribe(data => {
          if (data.response === 200) {
            this.dialogRef.close();
            this.common.openTost('success','SUCCESS',data.message);
            this.common.AClicked('Component A is clicked!!');
            // tslint:disable-next-line: max-line-length
          } else if (data.response === 400) {
            this.common.openTost('warning','WARNING',data.message);
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
