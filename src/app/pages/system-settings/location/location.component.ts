import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';

export interface DialogData {
  area_list: any;
  area: string;
  location_id: string;
  location: string;
  road_no: string;
  status: string;
  operation: string;
}

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  erroeMsg = '';
  area_list = [];
  totalrow = 0;
  itemPerPage = 10;
  pagereqest = 0;
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
    this.getArea();
    this.common.aClickedLocationEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
    });

  }

  permission(type) {
    return this.common.permission('system-settings/additional-setting',type);
  }

  getArea() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/area-list')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.area_list = data.list;
          } else {
            this.area_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  createModel() {
    const dialogRef = this.dialog.open( Location, {
      width: '500px',
      data: {
        area_list: this.area_list,
        location: '',
        road_no: '',
        area: '',
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
    const dialogRef = this.dialog.open( Location, {
      width: '500px',
      data: {
        area_list: this.area_list,
        location_id: type.id,
        location: type.location,
        road_no: type.road_no,
        area: type.area_id,
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
    const queryString = "?"
      + "api_token=" + this.tokenId
      + "&search=" + this.searchValues
      + "&sort_column=" + this.sortColumn
      + "&sort_by=" + orderBy
      + "&per_page=" + this.itemPerPage
      + "&page=" + this.pagereqest + "";
    this.get_list(queryString);
  }

  pageEvent(event) {
    this.pagereqest = event.pageIndex;
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
    this.pagereqest = 0;
    this.showList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pagereqest = 0;
    this.showList();
  }

  get_list(postdate) {
    this.dataService.getAll('location-list' + postdate)
      .subscribe(async(res) => {
          if (res.code === 200) {
            this.collection = await res.list.data;
            this.totalrow = await res.list.total;
          } else if (res.response === 404) {
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

  deleteModel(type) {
    const dialogRef = this.dialog.open( DeleteLocation, {
      data: {
        location_id: type.id,
        location: type.location,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }


}


@Component({
  selector: 'app-location-model',
  templateUrl: './location-model.html',
  styleUrls: ['./location.component.scss']
})
export class Location {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<Location>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'location')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedLocationEvent.emit('Component A is clicked!!');
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
  selector: 'delete-location-model',
  templateUrl: './delete-location-model.html',
  styleUrls: ['./location.component.scss']
})
export class DeleteLocation {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteLocation>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'location-delete')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedLocationEvent.emit('Component A is clicked!!');
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


