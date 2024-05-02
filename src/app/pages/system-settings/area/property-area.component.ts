import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl,Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';

export interface DialogData {
  row_id: string,
  city_id: string,
  area_name: string,
  area_name_bn: string,
  status: string,
  old_image: string;
  operation: string,
  city_list: any
}

@Component({
  selector: 'app-property-area',
  templateUrl: './property-area.component.html',
  styleUrls: ['./property-area.component.scss']
})
export class PropertyAreaComponent implements OnInit {
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
  collection=[];
  citylist=[];
  dataNotFound = '';
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.city_list();
    this.common.aClickedAreaEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
      this.city_list();
    });

  }

  permission(type) {
    return this.common.permission('administrator/setting',type);
  }

  city_list() {
    const postdate={
      'api_token': this.tokenId,
    }
    this.dataService.create(postdate, 'active-city-list')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.citylist = data.list;
        } else if (data.response === 400) {
          this.citylist = [];
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }

  createModel() {
    const dialogRef = this.dialog.open( CreatePropertyArea, {
      width: '500px',
      data: {
        city_list: this.citylist,
        area_name: '',
        area_name_bn: '',
        city_id: '',
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
    const dialogRef = this.dialog.open( CreatePropertyArea, {
      width: '500px',
      data: {
        city_list: this.citylist,
        row_id: type.id,
        area_name: type.area_name,
        area_name_bn: type.area_name_bn,
        city_id: type.city_id,
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
    this.pageNumber=event.pageIndex;
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
    this.pageNumber = 0;
    this.showList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageNumber = 0;
    this.showList();
  }

  get_list(postdate) {
      this.dataService.getAll('property-area-list' + postdate)
      .subscribe(async(res) => {
          if (res.code === 200) {
            this.collection = await res.list.data;
            this.totalrow = await res.list.total;
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
    const dialogRef = this.dialog.open( DeletePropertyArea, {
      data: {
        row_id: type.id,
        area_name: type.area_name,
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
  selector: 'app-create-property-area-model',
  templateUrl: './create-property-area-model.html',
  styleUrls: ['./property-area.component.scss']
})
export class CreatePropertyArea {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreatePropertyArea>,
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
    this.dataService.create(this.data, 'property-area')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedAreaEvent.emit('Component A is clicked!!');
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
  selector: 'delete-property-area-model',
  templateUrl: './delete-property-area-model.html',
  styleUrls: ['./property-area.component.scss']
})
export class DeletePropertyArea {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeletePropertyArea>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'property-area-delete')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedAreaEvent.emit('Component A is clicked!!');
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


