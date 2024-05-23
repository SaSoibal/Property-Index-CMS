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
  album_list: any,
  id: string,
  title_en: string,
  title_bn: string,
  album: number,
  old_image: string,
  status: string,
  operation: string
}
@Component({
  selector: 'app-about-us-gallery',
  templateUrl: './about-us-gallery.component.html',
  styleUrls: ['./about-us-gallery.component.scss']
})
export class AboutUsGalleryComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  album_list = [];
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
    this.albums();
    this.common.aClickedEvent
      .subscribe((data:string) => {
        console.log('Event message from Component A: ' + data);
        this.showList();
        this.albums();
      });

  }

  permission(type) {
    return this.common.permission('about-us/gallery',type);
  }


  albums() {
    const postData = {
      'api_token': this.tokenId
    };
    this.dataService.create(postData, 'get-gallery-album-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.album_list = data.list;
          } else if (data.response === 400) {
            this.album_list = data.list;
            console.log(this.album_list);
          }
        },
        (error: AppError) => {
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateAboutUsGallery, {
      width: '500px',
      data: {
        album_list: this.album_list,
        title_en: '',
        title_bn: '',
        description_en: '',
        description_bn: '',
        album: '',
        api_token: this.tokenId,
        operation: 'create',
        status: false,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  openRedModel(item) {
    const dialogRef = this.dialog.open( ReadAboutUsGallery, {
      width: '500px',
      data: {
        album_list: this.album_list,
        id: item.id,
        title_en: item.title_en,
        title_bn: item.title_bn,
        album: item.gallery_album_id,
        old_image:item.image,
        api_token: this.tokenId,
        operation: 'Read',
        status: item.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(item) {
    console.log(item);
    const dialogRef = this.dialog.open( CreateAboutUsGallery, {
      width: '500px',
      data: {
        album_list: this.album_list,
        id: item.id,
        title_en: item.title_en,
        title_bn: item.title_bn,
        album: item.gallery_album_id,
        old_image:item.image,
        api_token: this.tokenId,
        operation: 'update',
        status: item.status == 1?true:false,
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
    this.dataService.create(postdate, 'about-us-gallery-list')
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
    const dialogRef = this.dialog.open( DeleteAboutUsGallery, {
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
  selector: 'create-about-us-gallery-model',
  templateUrl: './create-about-us-gallery-model.html',
  styleUrls: ['./about-us-gallery.component.scss']
})
export class CreateAboutUsGallery {
  showData = 'EN';
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateAboutUsGallery>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
    console.log(this.data);
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
    this.dataService.create(this.data, 'about-us-gallery-create-update')
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
  selector: 'read-about-us-gallery-model',
  templateUrl: './read-about-us-gallery-model.html',
  styleUrls: ['./about-us-gallery.component.scss']
})
export class ReadAboutUsGallery {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadAboutUsGallery>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }
}

@Component({
  selector: 'delete-about-us-gallery-modal',
  templateUrl: './delete-about-us-gallery-model.html',
  styleUrls: ['./about-us-gallery.component.scss']
})
export class DeleteAboutUsGallery {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteAboutUsGallery>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'about-us-gallery-deletee')
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


