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
  interior_id: string;
  title_en: string;
  title_bn: string;
  subtitle_en: string;
  subtitle_bn: string;
  old_thumbnail: string;
  status: string;
  operation: string;
}

@Component({
  selector: 'app-guide-list',
  templateUrl: './interior-list.component.html',
  styleUrls: ['./interior-list.component.scss']
})
export class InteriorListComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  category_list = [];
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
    public dialog: MatDialog) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.common.aClickedInterior
    .subscribe((data:string) => {
      this.showList();
    });

  }

  permission(type) {
    return this.common.permission('buy-sell-guide/guide-list',type);
  }



  createModel() {
    const dialogRef = this.dialog.open( CreateInterior, {
      width: '600px',
      data: {
        title_en: '',
        title_bn: '',
        subtitle_en: '',
        subtitle_bn: '',
        api_token: this.tokenId,
        operation: 'create',
        status: true,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
    });
  }

  openRedModel(interior) {
    const dialogRef = this.dialog.open( ReadInterior, {
      width: '800px',
      data: {
        interior_id: interior.id,
        title_en: interior.title_en,
        title_bn: interior.title_bn,
        subtitle_en: interior.subtitle_en,
        subtitle_bn: interior.subtitle_bn,
        old_thumbnail: interior.thumbnail,
        api_token: this.tokenId,
        operation: 'Read',
        status: interior.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(interior) {
    const dialogRef = this.dialog.open( CreateInterior, {
      width: '600px',
      data: {
        interior_id: interior.id,
        title_en: interior.title_en,
        title_bn: interior.title_bn,
        subtitle_en: interior.subtitle_en,
        subtitle_bn: interior.subtitle_bn,
        old_thumbnail: interior.thumbnail,
        api_token: this.tokenId,
        operation: 'update',
        status: interior.status == 1?true:false,
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
    this.dataService.getAll('interior-list' + postdate)
      .subscribe(async(res) => {
          if (res.response === 200) {
            this.collection =  await res.list.data;
            this.totalrow =  await res.list.total;
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

  deleteModel(interior) {
    const dialogRef = this.dialog.open( DeleteInterior, {
      data: {
        interior_id: interior.id,
        title_en: interior.title_en,
        old_thumbnail: interior.thumbnail,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }



}





@Component({
  selector: 'create-interior-list-model',
  templateUrl: './create-interior-list-model.html',
  styleUrls: ['./interior-list.component.scss']
})
export class CreateInterior {
  showData = 'EN';
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';

  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;

  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateInterior>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
      if (this.data.operation == 'update') {
        this.ImageFile = this.rootUrl + this.data.old_thumbnail;
      }
  }


  // tslint:disable-next-line: typedef thumb
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
    this.data['thumbnail'] = this.SelectedFile;
    this.dataService.create(this.data, 'interior-create-update')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.aClickedInterior.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 401) {
        this.common.openTost('warning', 'WARNING', data.password);
      } else if (data.response === 400) {
        this.common.openTost('warning', 'WARNING', data.message);
      }
    },
    (error: AppError) => {
      this.common.openTost('error', 'ERROR', 'Please try again later');
    if (error instanceof BadInput) {
      } else { throw error; }
    });
  }
}

@Component({
  selector: 'read-interior-list-model',
  templateUrl: './read-interior-list-model.html',
  styleUrls: ['./interior-list.component.scss']
})
export class ReadInterior {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadInterior>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }
}

@Component({
  selector: 'delete-interior-list-modal',
  templateUrl: './delete-interior-list-model.html',
  styleUrls: ['./interior-list.component.scss']
})
export class DeleteInterior {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteInterior>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'interior-delete')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.aClickedInterior.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 400) {
        this.common.openTost('warning', 'WARNING', data.message);
      }
    },
    (error: AppError) => {
      this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
      } else { throw error; }
    });
  }
}

