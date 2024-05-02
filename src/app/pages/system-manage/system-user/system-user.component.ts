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
  branch_id: number,
  user_id: number,
  name: string,
  email: string,
  password: string,
  phone: string,
  active: boolean,
  status: string,
  operation: string
}

@Component({
  selector: 'app-system-user',
  templateUrl: './system-user.component.html',
  styleUrls: ['./system-user.component.scss']
})
export class SystemUserComponent implements OnInit {
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
  roles_list = [];
  branch_list = [];
  changeBranch = '';
  pageBuffer = false;

  constructor(private fb: FormBuilder, private common: CommonService, private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showuserList();
    this.getBranch();
    this.common.aClickedSystemUserEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showuserList();
    });

  }

  getBranch(){
    const postdatet = {
      'api_token': this.tokenId,
    }
    this.dataService.create(postdatet, 'sys-branch-list')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.branch_list = data.branch;
          if(data.branch.length > 0){
            this.changeBranch=data.branch[0].id;
            this.onBranch(this.changeBranch);
          }
        } else if (data.response === 400) {
          this.branch_list =[];
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
        if (error instanceof BadInput) {
        } else { throw error };
      });
  }

  permission(type) {
    return this.common.permission('system-manage/system-user',type);
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateSysUser, {
      width: '500px',
      data: {
        branch_id:this.changeBranch,
        name: '',
        email: '',
        password:'',
        phone: '',
        api_token: this.tokenId,
        operation: 'create',
        status: true,
        active: true
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }


  openEditModel(user) {
    const dialogRef = this.dialog.open( CreateSysUser, {
      width: '500px',
      data: {
        branch_id: user.branch_id,
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

  onBranch(event){
    this.changeBranch = event
    this.pageNumber = 0;
    this.showuserList();
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
    + "&page=" + this.pageNumber
    + "&branch_id=" + this.changeBranch + "";
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
    this.pageBuffer = true;
    this.dataService.getAll('system-user-list'+postdate)
      .subscribe(async(res)=> {
        this.pageBuffer = false;
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
    const dialogRef = this.dialog.open( DeleteSysUser, {
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
    const data = {
      'api_token': this.tokenId,
      'user_id': user.id,
      'status': event ==true?'1':'0',
    }
    this.dataService.create(data, 'system-user-status-change')
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
  styleUrls: ['./system-user.component.scss']
})
export class CreateSysUser {
  passwordVisible =false;
  submitButton =false;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateSysUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.submitButton =true;
    this.dataService.create(this.data, 'system-create-update-user')
    .subscribe(data => {
      this.submitButton =false;
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedSystemUserEvent.emit('Component A is clicked!!');
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
  styleUrls: ['./system-user.component.scss']
})
export class DeleteSysUser {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteSysUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'delete-system-user')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedSystemUserEvent.emit('Component A is clicked!!');
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

