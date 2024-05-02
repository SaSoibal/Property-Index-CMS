import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from './../../../core_classes/bad-input';
import { AppError } from './../../../core_classes/app-error';

export interface DialogData {
  users_list:any[],
  roles_list:any[],
  id: string,
  user_id: string,
  role_id: string,
  log_list:any,
  active: boolean,
  status: string,
  operation: string
}

@Component({
  selector: 'assign-user-role',
  templateUrl: './assign-user-role.component.html',
  styleUrls: ['./assign-user-role.component.scss']
})
export class AssignUserRoleComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken;
  roles_list = [];
  users_list = [];
  totalrow = 0;
  itemPerPage = 10;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection=[];
  dataNotFound = '';

  constructor(
    private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.common.checkCookie();
    this.userRoleList();
    this.getActiveRoleUsers();
    this.common.aClickedAssignEvent
    .subscribe((data:string) => {
      this.userRoleList();
      this.getActiveRoleUsers();
    });
  }

  permission(type) {
    return this.common.permission('administrator/assign-role', type);
  }

  getActiveRoleUsers() {
    const postdatet = {
      'api_token': this.tokenId,
    }
    this.dataService.create(postdatet, 'active-roles-users')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.roles_list = data.roles;
          this.users_list = data.users;
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

  createModel(){
    const dialogRef = this.dialog.open( AssignUserRoles, {
      width: '500px',
      data: {
        roles_list: this.roles_list,
        users_list: this.users_list,
        user_id: '',
        role_id:'',
        'api_token': this.tokenId,
        operation: 'create',
        status: false,
        active: false
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  openEditModel(comp){
    const postdatet = {
      'api_token': this.tokenId,
      'user_id': comp.user_id,
      'role_id': comp.role_id,
    }
    this.dataService.create(postdatet, 'assign-user-log')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.editModel(comp,data.logs)
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
        if (error instanceof BadInput) {
        } else { throw error };
      });
  }

  editModel(comp,logs){
    const dialogRef = this.dialog.open( AssignUserRoles, {
      width: '500px',
      data: {
        id:comp.id,
        roles_list: this.roles_list,
        users_list: this.users_list,
        user_id:comp.user_id,
        role_id:comp.role_id,
        log_list:logs,
        'api_token': this.tokenId,
        operation: 'update',
        status:comp.status>0?true:false,
        active: true
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  openDeleteModel(comp){
    const dialogRef = this.dialog.open( DeleteAssignUser, {
      width: '300px',
      data: {
        id:comp.id,
        roles_list: this.roles_list,
        users_list: this.users_list,
        user_id:comp.name,
        role_id:comp.role_name,
        'api_token': this.tokenId,
        operation: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  userRoleList() {
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
      this.user_role_list(queryString);
  }

  pageEvent(event){
    this.pageNumber=event.pageIndex;
    this.itemPerPage=event.pageSize;
    this.userRoleList();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.sortColumn = column;
    }
    this.userRoleList();
  }

  filter(value: string) {
    this.searchValues = value;
    this.pageNumber = 0;
    this.userRoleList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageNumber = 0;
    this.userRoleList();
  }

  user_role_list(postdate) {
    this.dataService.getAll('user-role-list'+postdate)
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
}

@Component({
  selector: 'assign-user-role-modal',
  templateUrl: './assign-user-role-modal.html',
  styleUrls: ['./assign-user-role.component.scss']
})
export class AssignUserRoles {
  tokenId = this.common.mycookie.bearertoken;
  users_list = [];
  roles_list = [];

  constructor(
    public dialogRef: MatDialogRef<AssignUserRoles>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) { }

  onClick(): void {
    console.log(this.data)
    this.dataService.create(this.data, 'assign-user-role')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedAssignEvent.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 401) {
        this.common.openTost('warning','WARNING',data.message);
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
  selector: 'delete-assign-model',
  templateUrl: './delete-assign-model.html',
  styleUrls: ['./assign-user-role.component.scss']
})
export class DeleteAssignUser {
  tokenId = this.common.mycookie.bearertoken;
  constructor(public dialogRef: MatDialogRef<DeleteAssignUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }


  onClick(): void {
    let postdata = this.data;
    this.dataService.create(postdata, 'delete-user-roles')
    .subscribe(
     data => {
           if (data.response === 200) {
             this.dialogRef.close();
             this.common.aClickedAssignEvent.emit('Component A is clicked!!');
               this.common.openTost('success','SUCCESS',data.message);
             }
            if (data.response === 400) {
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
