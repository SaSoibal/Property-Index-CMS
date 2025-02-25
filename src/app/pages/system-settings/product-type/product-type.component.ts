import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';

export interface DialogData {
  row_id: string;
  name: string;
  type_option: string;
  product_category: string;
  status: string;
  operation: string;
}

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss']
})
export class BuyingIntentComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  erroeMsg = '';
  totalrow = 0;
  itemPerPage = 10;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection = [];
  dataNotFound = '';
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.common.aClickedBuyingIntentEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
    });

  }

  permission(type) {
    return this.common.permission('system-settings/additional-setting', type);
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateProductType, {
      width: '500px',
      data: {
        name: '',
        type_option: '',
        product_category: '',
        api_token: this.tokenId,
        operation: 'create',
        status: true,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
    });
  }


  openEditModel(type) {
    const dialogRef = this.dialog.open( CreateProductType, {
      width: '500px',
      data: {
        row_id: type.id,
        name: type.name,
        product_category: type.product_category,
        type_option: type.type_option,
        api_token: this.tokenId,
        operation: 'update',
        status: type.status == 1? true : false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
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
      + "&page=" + this.pageNumber + "";
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
      this.dataService.getAll('product-type-list' + postdate)
        .subscribe(async(res) => {
        if (res.response === 200) {
          this.collection =  await res.list.data;
          this.totalrow =  await res.list.total;
        } else if (res.response === 404) {
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

  deleteModel(type) {
    const dialogRef = this.dialog.open( DeleteProductType, {
      data: {
        row_id: type.id,
        name: type.name,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }


}


@Component({
  selector: 'app-create-product-type-model',
  templateUrl: './create-product-type-model.html',
  styleUrls: ['./product-type.component.scss']
})
export class CreateProductType {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateProductType>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'create-product-type')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS', data.message);
        this.common.aClickedBuyingIntentEvent.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 400) {
        this.common.openTost('warning','WARNING', data.message);
      }
    },
    (error: AppError) => {
      this.common.onMainEvent.emit(false);
      this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
      } else { throw error}
    });
  }
}

@Component({
  selector: 'delete-product-type-model',
  templateUrl: './delete-product-type-model.html',
  styleUrls: ['./product-type.component.scss']
})
export class DeleteProductType {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteProductType>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'delete-product-type')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS', data.message);
        this.common.aClickedBuyingIntentEvent.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 400) {
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


