import { Component, OnInit, Inject } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from './../../../core_classes/bad-input';
import { AppError } from './../../../core_classes/app-error';

export interface DialogData {
  user_id: string,
  name: string,
  email: string,
  password: string,
  phone: string,
  active: boolean,
  status: string,
  operation: string
}

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'uploads/';
  erroeMsg = '';

  totalrow = 0;
  itemPerPage = 10;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection=[];
  dataNotFound = '';
 
  constructor(private fb: FormBuilder, private common: CommonService, private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showuserList();

    this.common.aClickedEventUser
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showuserList();
    });

  }
  
  permission(type) {
    return this.common.permission('administrator/user-manage',type);
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateUser, {
      width: '500px',
      data: {
        name: '',
        email: '',
        password:'',
        phone: '',
        api_token: this.tokenId,
        operation: 'create',
        status: false,
        active: false
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }


  openEditModel(user) {
    const dialogRef = this.dialog.open( CreateUser, {
      width: '500px',
      data: {
        user_id: user.id,
        name: user.name,
        email:user.email,
        password:user.password_hint,
        phone: user.phone,
        api_token: this.tokenId,
        operation: 'update',
        status: user.status>0?true:false,
        active: true
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  showuserList() {
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
       this.get_user_list(queryString);
  }

  pageEvent(event){
    this.pageNumber=event.pageIndex;
    this.itemPerPage=event.pageSize;
    this.showuserList();
  }
  
  sort(column: string) {
    if (this.sortColumn === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.sortColumn = column;
    }
    this.showuserList();
  }

  filter(value: string) {
    this.searchValues = value;
    this.pageNumber = 0;
    this.showuserList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageNumber = 0;
    this.showuserList();
  }

  get_user_list(postdate) {
    this.dataService.getAll('user-list'+postdate)
      .subscribe(async(res)=> {
        if (res.code === 200) {
          this.collection = await res.list.data;
          this.totalrow = await res.list.total;
          this.dataNotFound = '';
        } else if (res.response === 404) {
          this.dataNotFound = 'Data Not Found...';
          this.common.openTost('error','ERROR',res.message);
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }

  deleteuserModel(user) {
    const dialogRef = this.dialog.open( DeleteUser, {
      data: {
        user_id: user.id,
        name: user.name,
        email:user.email,
        phone: user.phone,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  changeStatus(event,user){
    console.log(event,'event');
    console.log(user.id,'event');
    const data = {
      'api_token': this.tokenId,
      'user_id': user.id,
      'status': event ==true?'1':'0',
    }
    this.dataService.create(data, 'user-status-change')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.common.openTost('success','SUCCESS',data.message);
        } else if (data.response === 400) {
          this.common.openTost('warning','WARNING',data.message);
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }


}





@Component({
  selector: 'create-user-model',
  templateUrl: './create-user-model.html',
  styleUrls: ['./user-manage.component.scss']
})
export class CreateUser {
  passwordVisible =false;
  submitButton =false;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.submitButton =true;
    this.dataService.create(this.data, 'create-update-user')
    .subscribe(data => {
      this.submitButton =false;
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedEventUser.emit('Component A is clicked!!');
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
  selector: 'delete-user-modal',
  templateUrl: './delete-user-model.html',
  styleUrls: ['./user-manage.component.scss']
})
export class DeleteUser {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'delete-user')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedEventUser.emit('Component A is clicked!!');
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

