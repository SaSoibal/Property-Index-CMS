import { Component, OnInit, Inject } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';

export interface DialogData {
  all_area_list: any,
  area_id: '',
  option_id: '',
  area_name: string,
  area_name_bn: string,
  option_name: string,
  option_name_bn: string,
  description_en: string,
  description_bn: string,
  old_image: string,
  status: string,
  operation: string
}

@Component({
  selector: 'app-area-manage',
  templateUrl: './area-manage.component.html',
  styleUrls: ['./area-manage.component.scss']
})
export class AreaManageComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  all_area_list = [];
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
  sortArea = '';

  constructor(private fb: FormBuilder, 
    private common: CommonService, 
    private dataService: DataService, 
    public dialog: MatDialog) { }

  ngOnInit() {
    this.common.checkCookie();
    this.area_list();
    this.showList();
    this.common.aClickedEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.area_list();
      this.showList();
    });

  }
  
  permission(type) {
    return this.common.permission('area-guide/area-details',type);
  }

  area_list() {
    const postData = {
      'api_token': this.tokenId
    };
    this.dataService.create(postData, 'manage-area-list')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.all_area_list = data.list;
        } else if (data.response === 400) {
          this.all_area_list = data.list;
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateArea, {
      width: '1000px',
      data: {
        all_area_list: this.all_area_list,
        area_id: '',
        option_id: '',
        description_en: '',
        description_bn: '',
        api_token: this.tokenId,
        operation: 'create',
        status: false,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  openRedModel(area) {
    const dialogRef = this.dialog.open( ReadArea, {
      width: '900px',
      data: {
        all_area_list: this.all_area_list,
        id: area.id,
        area_name: area.area_name,
        option_name: area.option_name,
        description_en: area.description_en,
        description_bn: area.description_bn,
        old_image:area.image,
        api_token: this.tokenId,
        operation: 'Read',
        status: area.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(area) {
    const dialogRef = this.dialog.open( CreateArea, {
      width: '900px',
      data: {
        all_area_list: this.all_area_list,
        id: area.id,
        area_id: area.area_id,
        option_id: area.option_id,
        area_name: area.area_name,
        area_name_bn: area.area_name_bn,
        option_name: area.option_name,
        option_name_bn: area.option_name_bn,
        description_en: area.description_en,
        description_bn: area.description_bn,
        old_image:area.image,
        api_token: this.tokenId,
        operation: 'update',
        status: area.status == 1?true:false,
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
         'search': this.searchValues,
         'sort_area': this.sortArea
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

  sortAreaList(event) {
    this.sortArea = event;
    this.showList();
  }

  get_list(postdate) {
    this.dataService.create(postdate, 'manage-details-list')
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
        console.log(data.list);
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }

  deleteModel(area) {
    const dialogRef = this.dialog.open( DeleteArea, {
      data: {
        id: area.id,
        area_name: area.area_name,
        option_name: area.option_name,
        old_image:area.image,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }



}





@Component({
  selector: 'create-area-model',
  templateUrl: './create-area-model.html',
  styleUrls: ['./area-manage.component.scss']
})
export class CreateArea {
  tokenId = this.common.mycookie.bearertoken ;
  option_list = [];
  showData = 'EN';
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateArea>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
      if(this.data.operation == 'update'){
        this.ImageFile = this.rootUrl + this.data.old_image;
        this.showData = 'EN';
      }
  }

  changeArea(event){
       this.data.option_id = '';
       const postData = {
        'api_token': this.tokenId,
        'area_id': event
      };
      this.dataService.create(postData, 'manage-area-options')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.option_list = data.list;
          } else if (data.response === 400) {
            this.option_list = data.list;
          }
        },
        (error: AppError) => {
          this.common.openTost('error','ERROR','Please try again later');
        if (error instanceof BadInput) {
          } else { throw error };
        });
  } 

  changeLanguage(event){
    if(event == true){
      this.showData = 'BN';
    }else{
      this.showData = 'EN';
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
  RemoveImage(){
    this.SelectedFile = null;
    this.ChangeImg = false;
    this.ImageFile = this.defaultImage;
  }

  onClick(): void {
    this.data['image'] = this.SelectedFile;
    this.dataService.create(this.data, 'manage-create-update')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.AClicked('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 401) {
        this.common.openTost('warning','WARNING',data.password);
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
  selector: 'read-area-model',
  templateUrl: './read-area-model.html',
  styleUrls: ['./area-manage.component.scss']
})
export class ReadArea {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadArea>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }
}

@Component({
  selector: 'delete-area-modal',
  templateUrl: './delete-area-model.html',
  styleUrls: ['./area-manage.component.scss']
})
export class DeleteArea {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteArea>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'manage-area-delete')
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

