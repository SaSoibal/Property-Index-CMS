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
  areas_list: any,
  area_id: string,
  list_id: string,
  title_en: string,
  title_bn: string,
  list_title_en: string,
  status: string,
  operation: string
}

@Component({
  selector: 'app-area-option',
  templateUrl: './area-option.component.html',
  styleUrls: ['./area-option.component.scss']
})
export class AreaOptionComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  erroeMsg = '';
  areas_list = [];
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
    this.showList();
    this.area_list();
    this.common.aClickedEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
      this.area_list();
    });

  }
  
  permission(type) {
    return this.common.permission('area-guide/area-option',type);
  }

  
  area_list() {
    const postData = {
      'api_token': this.tokenId
    };
    this.dataService.create(postData, 'get-area-list')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.areas_list = data.list;
        } else if (data.response === 400) {
          this.areas_list = data.list;
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateAreaOption, {
      width: '500px',
      data: {
        areas_list: this.areas_list,
        list_id: '',
        title_en: '',
        title_bn: '',
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
    const dialogRef = this.dialog.open( ReadAreaOption, {
      width: '500px',
      data: {
        area_id: area.id,
        title_en: area.title_en,
        title_bn: area.title_bn,
        list_title_en: area.list_title_en,
        api_token: this.tokenId,
        operation: 'Read',
        status: area.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(area) {
    const dialogRef = this.dialog.open( CreateAreaOption, {
      width: '500px',
      data: {
        area_id: area.id,
        areas_list: this.areas_list,
        list_id: area.area_list_id,
        title_en: area.title_en,
        title_bn: area.title_bn,
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

  clearFilter() {
    this.searchValues = '';
    this.pagereqest = 0;
    this.showList();
  }
  sortAreaList(event){
    this.sortArea = event;
    this.showList();
  }

  get_list(postdate) {
    this.dataService.create(postdate, 'area-option-list')
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

  deleteModel(area) {
    const dialogRef = this.dialog.open( DeleteAreaOption, {
      data: {
        area_id: area.id,
        title_en: area.title_en,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }
}


@Component({
  selector: 'create-area-option-model',
  templateUrl: './create-area-option-model.html',
  styleUrls: ['./area-option.component.scss']
})
export class CreateAreaOption {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateAreaOption>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {}

  onClick(): void {
    this.dataService.create(this.data, 'area-option')
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
  selector: 'read-area-option-model',
  templateUrl: './read-area-option-model.html',
  styleUrls: ['./area-option.component.scss']
})
export class ReadAreaOption {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadAreaOption>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }
}

@Component({
  selector: 'delete-area-option-modal',
  templateUrl: './delete-area-option-model.html',
  styleUrls: ['./area-option.component.scss']
})
export class DeleteAreaOption {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteAreaOption>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'area-option-delete')
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

