import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';

export interface DialogData {
  districtlist: any;
  row_id: string;
  district_id: number;
  city: string;
  city_bn: string;
  old_image: string;
  status: string;
  operation: string;
}

@Component({
  selector: 'app-property-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  erroeMsg = '';
  districtlist = [];
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
    this.district_list();
    this.common.aClickedCityEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
      this.district_list();
    });

  }

  permission(type) {
    return this.common.permission('administrator/setting',type);
  }

  district_list() {
    const postdate = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdate, 'active-district-list')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.districtlist = data.list;
        } else if (data.response === 400) {
          this.districtlist = [];
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });
  }



  createModel() {
    const dialogRef = this.dialog.open( CreateCity, {
      width: '500px',
      data: {
        districtlist:this.districtlist,
        district_id: '',
        city: '',
        city_bn: '',
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
    const dialogRef = this.dialog.open( CreateCity, {
      width: '500px',
      data: {
        districtlist:this.districtlist,
        row_id: type.id,
        district_id: type.district_id,
        city: type.city,
        city_bn: type.city_bn,
        old_image: type.image,
        api_token: this.tokenId,
        operation: 'update',
        status: type.status == 1?true:false,
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

  pageEvent(event){
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
    this.dataService.getAll('property-city-list'+ postdate)
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
    const dialogRef = this.dialog.open( DeleteCity, {
      data: {
        row_id: type.id,
        city: type.city,
        old_image: type.image,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }


}


@Component({
  selector: 'app-create-city-model',
  templateUrl: './create-city-model.html',
  styleUrls: ['./city.component.scss']
})
export class CreateCity {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateCity>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
    if (this.data.operation == 'update') {
      this.ImageFile = this.rootUrl + this.data.old_image;
    }
  }
  // tslint:disable-next-line: typedef
  Changed(fileInput) {
    const pre = this;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        pre.ImageFile = e.target.result;
        pre.SelectedFile = e.target.result;
        pre.ChangeImg = true;
        pre.selectImg = false;
      },
        reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  // tslint:disable-next-line: typedef
  RemoveImage() {
    this.SelectedFile = null;
    this.ChangeImg = false;
    this.ImageFile = this.defaultImage;
  }

  onClick(): void {
    this.data['image'] = this.SelectedFile;
    this.dataService.create(this.data, 'property-city')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.aClickedCityEvent.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 400) {
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
  selector: 'delete-city-model',
  templateUrl: './delete-city-model.html',
  styleUrls: ['./city.component.scss']
})
export class DeleteCity {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteCity>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'property-city-delete')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.aClickedCityEvent.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 400) {
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


