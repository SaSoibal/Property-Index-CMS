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
  album_id: string,
  title_en: string,
  title_bn: string,
  status: string,
  operation: string
}

@Component({
  selector: 'app-about-us-gallery-album',
  templateUrl: './about-us-gallery-album.component.html',
  styleUrls: ['./about-us-gallery-album.component.scss']
})
export class AboutUsGalleryAlbumComponent implements OnInit {
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
    return this.common.permission('about-us/gallery-album',type);
  }

  createModel() {
    const dialogRef = this.dialog.open( CreateGalleryAlbum, {
      width: '500px',
      data: {
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

  openRedModel(album) {
    const dialogRef = this.dialog.open( ReadGalleryAlbum, {
      width: '500px',
      data: {
        album_id: album.id,
        title_en: album.title_en,
        title_bn: album.title_bn,
        api_token: this.tokenId,
        operation: 'Read',
        status: album.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(album) {
    const dialogRef = this.dialog.open( CreateGalleryAlbum, {
      width: '500px',
      data: {
        album_id: album.id,
        title_en: album.title_en,
        title_bn: album.title_bn,
        api_token: this.tokenId,
        operation: 'update',
        status: album.status == 1?true:false,
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
    this.dataService.create(postdate, 'about-us-gallery-album-list')
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

  deleteModel(album) {
    const dialogRef = this.dialog.open( DeleteGalleryAlbum, {
      data: {
        album_id: album.id,
        title_en: album.title_en,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }



}





@Component({
  selector: 'create-about-us-gallery-album-model',
  templateUrl: './create-about-us-gallery-album-model.html',
  styleUrls: ['./about-us-gallery-album.component.scss']
})
export class CreateGalleryAlbum {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateGalleryAlbum>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {}

  onClick(): void {
    this.dataService.create(this.data, 'about-us-gallery-album-create-update')
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
  selector: 'read-about-us-gallery-album-model',
  templateUrl: './read-about-us-gallery-album-model.html',
  styleUrls: ['./about-us-gallery-album.component.scss']
})
export class ReadGalleryAlbum {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadGalleryAlbum>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }
}

@Component({
  selector: 'delete-about-us-gallery-album-modal',
  templateUrl: './delete-about-us-gallery-album-model.html',
  styleUrls: ['./about-us-gallery-album.component.scss']
})
export class DeleteGalleryAlbum {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteGalleryAlbum>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'about-us-gallery-album-delete')
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

