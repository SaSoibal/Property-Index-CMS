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
  category_list: any,
  blog_id: string,
  title_en: string,
  title_bn: string,
  description_en: string,
  description_bn: string,
  category: number,
  old_image: string,
  status: string,
  operation: string
}

@Component({
  selector: 'app-blog-manage',
  templateUrl: './blog-manage.component.html',
  styleUrls: ['./blog-manage.component.scss']
})
export class BlogManageComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  category_list = [];
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
    this.categories();
    this.common.aClickedEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
      this.categories();
    });

  }
  
  permission(type) {
    return this.common.permission('blog/banner-manage',type);
  }

  
  categories() {
    const postData = {
      'api_token': this.tokenId
    };
    this.dataService.create(postData, 'get-blog-category')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.category_list = data.list;
        } else if (data.response === 400) {
          this.category_list = data.list;
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateBlog, {
      width: '1000px',
      data: {
        category_list: this.category_list,
        title_en: '',
        title_bn: '',
        description_en: '',
        description_bn: '',
        category: '',
        api_token: this.tokenId,
        operation: 'create',
        status: false,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  openRedModel(blog) {
    const dialogRef = this.dialog.open( ReadBlog, {
      width: '1000px',
      data: {
        category_list: this.category_list,
        blog_id: blog.id,
        title_en: blog.title_en,
        title_bn: blog.title_bn,
        description_en: blog.description_en,
        description_bn: blog.description_bn,
        category: blog.category_en,
        old_image:blog.image,
        api_token: this.tokenId,
        operation: 'Read',
        status: blog.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(blog) {
    const dialogRef = this.dialog.open( CreateBlog, {
      width: '1000px',
      data: {
        category_list: this.category_list,
        blog_id: blog.id,
        title_en: blog.title_en,
        title_bn: blog.title_bn,
        description_en: blog.description_en,
        description_bn: blog.description_bn,
        category: blog.category,
        old_image:blog.image,
        api_token: this.tokenId,
        operation: 'update',
        status: blog.status == 1?true:false,
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
    this.dataService.create(postdate, 'blog-list')
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
    const dialogRef = this.dialog.open( DeleteBlog, {
      data: {
        blog_id: ctg.id,
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
  selector: 'create-blog-model',
  templateUrl: './create-blog-model.html',
  styleUrls: ['./blog-manage.component.scss']
})
export class CreateBlog {
  showData = 'EN';
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateBlog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
      if(this.data.operation == 'update'){
        this.ImageFile = this.rootUrl + this.data.old_image;
      }
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
    this.dataService.create(this.data, 'blog-create-update')
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
  selector: 'read-blog-model',
  templateUrl: './read-blog-model.html',
  styleUrls: ['./blog-manage.component.scss']
})
export class ReadBlog {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadBlog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }
}

@Component({
  selector: 'delete-blog-modal',
  templateUrl: './delete-blog-model.html',
  styleUrls: ['./blog-manage.component.scss']
})
export class DeleteBlog {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteBlog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'blog-delete')
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

