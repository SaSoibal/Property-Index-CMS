import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';

export interface DialogData {
  row_id: string,
  rating: string,
  status: string,
  operation: string
}

@Component({
  selector: 'app-client-rating',
  templateUrl: './client-rating.component.html',
  styleUrls: ['./client-rating.component.scss']
})
export class ClientRatingComponent implements OnInit {
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
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.common.aClickedClientRatingEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
    });

  }

  permission(type) {
    return this.common.permission('system-settings/additional-setting',type);
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateClientRating, {
      width: '500px',
      data: {
        rating: '',
        api_token: this.tokenId,
        operation: 'create',
        status: true,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }


  openEditModel(type) {
    const dialogRef = this.dialog.open( CreateClientRating, {
      width: '500px',
      data: {
        row_id: type.id,
        rating: type.rating,
        api_token: this.tokenId,
        operation: 'update',
        status: type.status == 1?true:false,
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
    this.dataService.create(postdate, 'client-rating-list')
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

  deleteModel(type) {
    const dialogRef = this.dialog.open( DeleteClientRating, {
      data: {
        row_id: type.id,
        rating: type.rating,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }


}


@Component({
  selector: 'app-create-client-rating-model',
  templateUrl: './create-client-rating-model.html',
  styleUrls: ['./client-rating.component.scss']
})
export class CreateClientRating {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateClientRating>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'client-rating')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedClientRatingEvent.emit('Component A is clicked!!');
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

@Component({
  selector: 'delete-client-rating-model',
  templateUrl: './delete-client-rating-model.html',
  styleUrls: ['./client-rating.component.scss']
})
export class DeleteClientRating {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteClientRating>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'client-rating-delete')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedClientRatingEvent.emit('Component A is clicked!!');
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


