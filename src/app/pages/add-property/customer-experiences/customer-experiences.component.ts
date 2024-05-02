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
import { DomSanitizer } from '@angular/platform-browser'; 

export interface DialogData {
  cs_id: string,
  title_en: string,
  title_bn: string,
  video_url: string,
  old_image: string,
  status: string,
  operation: string
}

@Component({
  selector: 'app-customer-experiences',
  templateUrl: './customer-experiences.component.html',
  styleUrls: ['./customer-experiences.component.scss']
})
export class CustomerExperiencesComponent implements OnInit {
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
    return this.common.permission('ap/customer-experiences',type);
  }

  createModel() {
    const dialogRef = this.dialog.open( CreateCustomerExp, {
      width: '900px',
      data: {
        title_en: '',
        title_bn: '',
        video_url: '',
        api_token: this.tokenId,
        operation: 'create',
        status: false,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  openRedModel(cs) {
    const dialogRef = this.dialog.open( ReadCustomerExp, {
      width: '900px',
      data: {
        cs_id: cs.id,
        title_en: cs.title_en,
        title_bn: cs.title_bn,
        video_url: cs.video_url,
        old_image:cs.image,
        api_token: this.tokenId,
        operation: 'Read',
        status: cs.status == 1?true:false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openEditModel(cs) {
    const dialogRef = this.dialog.open( CreateCustomerExp, {
      width: '900px',
      data: {
        cs_id: cs.id,
        title_en: cs.title_en,
        title_bn: cs.title_bn,
        video_url: cs.video_url,
        old_image:cs.image,
        api_token: this.tokenId,
        operation: 'update',
        status: cs.status == 1?true:false,
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
    this.dataService.create(postdate, 'ap-cusexp-list')
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

  deleteModel(cs) {
    const dialogRef = this.dialog.open( DeleteCustomerExp, {
      data: {
        cs_id: cs.id,
        title_en: cs.title_en,
        old_image:cs.image,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }



}

@Component({
  selector: 'create-model',
  templateUrl: './create-model.html',
  styleUrls: ['./customer-experiences.component.scss']
})
export class CreateCustomerExp {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateCustomerExp>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService,private sanitizer: DomSanitizer) {
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

  onClick(): void {
    this.data['image'] = this.SelectedFile;
    this.dataService.create(this.data, 'ap-cusexp-add-update')
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
  selector: 'read-model',
  templateUrl: './read-model.html',
  styleUrls: ['./customer-experiences.component.scss']
})
export class ReadCustomerExp {
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ReadCustomerExp>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }
}

@Component({
  selector: 'delete-modal',
  templateUrl: './delete-model.html',
  styleUrls: ['./customer-experiences.component.scss']
})
export class DeleteCustomerExp {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteCustomerExp>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'ap-cusexp-delete')
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

