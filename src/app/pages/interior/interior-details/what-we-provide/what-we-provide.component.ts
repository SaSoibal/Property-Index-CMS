import { Component, OnInit, Inject } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../../../services/common.service';
import { DataService } from '../../../../services/data.service';
import { BadInput } from '../../../../core_classes/bad-input';
import { AppError } from '../../../../core_classes/app-error';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
export interface DialogData {
  cs_id: string;
  title_en: string;
  title_bn: string;
  description_en: string;
  description_bn: string;
  old_image: string;
  status: string;
  operation: string;
}

@Component({
  selector: 'app-what-we-provide',
  templateUrl: './what-we-provide.component.html',
  styleUrls: ['./what-we-provide.component.scss']
})
export class WhatWeProvideComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  slug = this.activatedRoute.snapshot.params.slug;
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
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.common.aClickWhatWeProvide
    .subscribe((data: string) => {
      this.showList();
    });

  }

  permission(type) {
    return this.common.permission('interior/interior-list', type);
  }

  createModel() {
    const dialogRef = this.dialog.open( CreateWhatWeProvide, {
      width: '900px',
      data: {
        title_en: '',
        title_bn: '',
        description_en: '',
        description_bn: '',
        api_token: this.tokenId,
        slug: this.slug,
        operation: 'create',
        status: true,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
    });
  }

  openRedModel(cs) {
    const dialogRef = this.dialog.open( ReadWhatWeProvide, {
      width: '900px',
      data: {
        cs_id: cs.id,
        title_en: cs.title_en,
        title_bn: cs.title_bn,
        description_en: cs.description_en,
        description_bn: cs.description_bn,
        old_image: cs.thumbnail,
        api_token: this.tokenId,
        slug: this.slug,
        operation: 'Read',
        status: cs.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(cs) {
    const dialogRef = this.dialog.open( CreateWhatWeProvide, {
      width: '900px',
      data: {
        cs_id: cs.id,
        title_en: cs.title_en,
        title_bn: cs.title_bn,
        description_en: cs.description_en,
        description_bn: cs.description_bn,
        old_image: cs.thumbnail,
        api_token: this.tokenId,
        slug: this.slug,
        operation: 'update',
        status: cs.status == 1?true:false,
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
      + "&page=" + this.pageNumber
      + "&slug=" + this.slug + "";
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
    this.dataService.getAll('we-provide-list' + postdate)
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


  deleteModel(cs) {
    const dialogRef = this.dialog.open( DeleteWhatWeProvide, {
      data: {
        cs_id: cs.id,
        title_en: cs.title_en,
        old_image: cs.thumbnail,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }



}

@Component({
  selector: 'create-we-provide-model',
  templateUrl: './create-model.html',
  styleUrls: ['./what-we-provide.component.scss']
})
export class CreateWhatWeProvide {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateWhatWeProvide>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService, private sanitizer: DomSanitizer) {
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
    this.dataService.create(this.data, 'we-provide-create-update')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.aClickWhatWeProvide.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 401) {
        this.common.openTost('warning', 'WARNING', data.password);
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
  selector: 'read-we-provide-model',
  templateUrl: './read-model.html',
  styleUrls: ['./what-we-provide.component.scss']
})
export class ReadWhatWeProvide {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadWhatWeProvide>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }
}

@Component({
  selector: 'delete-we-provide-modal',
  templateUrl: './delete-model.html',
  styleUrls: ['./what-we-provide.component.scss']
})
export class DeleteWhatWeProvide {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteWhatWeProvide>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'we-provide-delete')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.aClickWhatWeProvide.emit('Component A is clicked!!');
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

