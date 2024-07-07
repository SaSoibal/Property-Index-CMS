import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from '../../../services/common.service';
import {DataService} from '../../../services/data.service';
import {AppError} from '../../../core_classes/app-error';
import {BadInput} from '../../../core_classes/bad-input';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  id: string,
  title_en: string,
  title_bn: string,
  category_en: string,
  category_bn: string,
  description_en: string,
  description_bn: string,
  deadline: string,
  old_image: string,
  status: string,
  operation: string
}
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
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
    return this.common.permission('career/job',type);
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateJobs, {
      width: '1000px',
      data: {
        title_en: '',
        title_bn: '',
        category_en: '',
        category_bn: '',
        description_en: '',
        description_bn: '',
        deadline: '',
        api_token: this.tokenId,
        operation: 'create',
        status: true,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  openRedModel(Jobs) {
    const dialogRef = this.dialog.open( ReadJobs, {
      width: '1000px',
      data: {
        id: Jobs.id,
        title_en: Jobs.title_en,
        title_bn: Jobs.title_bn,
        category_en: Jobs.category_en,
        category_bn: Jobs.category_bn,
        description_en: Jobs.description_en,
        description_bn: Jobs.description_bn,
        deadline: Jobs.deadline,
        old_image:Jobs.image,
        api_token: this.tokenId,
        operation: 'Read',
        status: Jobs.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(Jobs) {
    const dialogRef = this.dialog.open( CreateJobs, {
      width: '1000px',
      data: {
        id: Jobs.id,
        title_en: Jobs.title_en,
        title_bn: Jobs.title_bn,
        category_en: Jobs.category_en,
        category_bn: Jobs.category_bn,
        description_en: Jobs.description_en,
        description_bn: Jobs.description_bn,
        deadline: Jobs.deadline,
        old_image:Jobs.image,
        api_token: this.tokenId,
        operation: 'update',
        status: Jobs.status == 1?true:false,
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
    this.dataService.create(postdate, 'job-list')
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
    const dialogRef = this.dialog.open( DeleteJobs, {
      data: {
        id: ctg.id,
        title_en: ctg.title_en,
        old_image:ctg.image,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }
}

@Component({
  selector: 'create-jobs-model',
  templateUrl: './create-jobs-model.html',
  styleUrls: ['./jobs.component.scss']
})
export class CreateJobs {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  deadline = '';
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateJobs>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
    if(this.data.operation == 'update'){
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
  RemoveImage(){
    this.SelectedFile = null;
    this.ChangeImg = false;
    this.ImageFile = this.defaultImage;
  }
  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onClick(): void {
    this.data['image'] = this.SelectedFile;
    this.dataService.create(this.data, 'job-create-update')
      .subscribe(data => {

          console.log(this.data,'data.response');
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
  selector: 'read-jobs-model',
  templateUrl: './read-jobs-model.html',
  styleUrls: ['./jobs.component.scss']
})
export class ReadJobs {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadJobs>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }
}

@Component({
  selector: 'delete-jobs-modal',
  templateUrl: './delete-jobs-model.html',
  styleUrls: ['./jobs.component.scss']
})
export class DeleteJobs {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteJobs>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'job-delete')
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
