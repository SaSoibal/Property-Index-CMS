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
  branch_id: number,
  role_id: string,
  role_name: string,
  status: string,
  pagelist: any,
  accounttype: string;
  operation: string;
  api_token: string;
  active: string;
}

@Component({
  selector: 'app-system-role',
  templateUrl: './system-role.component.html',
  styleUrls: ['./system-role.component.scss']
})
export class SystemRoleComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken;
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
  // tslint:disable-next-line: max-line-length
  constructor(
    private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showRoleList();
    this.getBranch();
    this.common.onClickSystemRoleEvent
      .subscribe((data: string) => {
        this.showRoleList();
      });
  }

  permission(type) {
    return this.common.permission('system-manage/system-role', type);
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
            this.getRole();
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

  getRole() {
    const postdatet = {
      'api_token': this.tokenId,
      'branch_id': this.changeBranch
    }
    this.dataService.create(postdatet, 'get-branch-role')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.roles_list = data.role_list;
        } else if (data.response === 400) {
          this.roles_list =[];
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
        if (error instanceof BadInput) {
        } else { throw error };
      });
  }

  createModel() {
    this.roles_list.forEach(element => {
      element.pageaccess=false;
      element.action=false;
      element.count_sub=this.getsubmenue(element.module_id).length
    });
    const dialogRef = this.dialog.open(CreateSystemRole, {
      width: '800px',
      data: {
        branch_id:this.changeBranch,
        role_name: '',
        pagelist: this.roles_list,
        status: 1,
        api_token: this.tokenId,
        operation: 'create',
        active: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  openEditModel(role) {
    const postdatet = {
      'api_token': this.tokenId,
      'role_id': role.id
    }
    this.dataService.create(postdatet, 'system-role-access-list')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.editMode(role,data.list);
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

  editMode(role,access){
    this.roles_list.forEach(element => {
       const elem = access.find(x => x.module_id == element.id);
      if(elem){
        element.pageaccess=true,
        element.action=elem.action
      }else{
        element.pageaccess=false;
        element.action=false;
      }
        element.count_sub=this.getsubmenue(element.module_id).length
      });
      const dialogRef = this.dialog.open(CreateSystemRole, {
        width: '800px',
        data: {
          branch_id:role.branch_id,
          role_id: role.id,
          role_name: role.role_name,
          api_token: this.tokenId,
          pagelist: this.roles_list,
          operation: 'update',
          status: role.status == '1'?true:false,
          active: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
  }
  openDeleteModel(roles){
    const dialogRef = this.dialog.open( DeleteSystemRole, {
      width: '300px',
      data: {
        id:roles.id,
        role_name: roles.role_name,
        'api_token': this.tokenId,
        operation: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }

  getsubmenue(mainmenu_id) {
      var submenue = [];
      if (this.roles_list != null) {
        this.roles_list.find((element: any) => {
        if ( element.parent_id ===  mainmenu_id) {
          let obj = {path: '', title: '', icon: '', id: ''}
          obj.path = element.slug;
          obj.title =  element.module_name;
          obj.icon = element.mat_icon,
          obj.id = element.module_id
          if (element.module_id) {
            submenue.push(obj)
          }
          return false
        }

      })
    }
    return submenue
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  showRoleList() {
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
    + "&branch_id=" + this.changeBranch  + "";
       this.get_role_list(queryString);
  }

  onBranch(event){
    this.changeBranch = event
    this.pageNumber = 0;
    this.showRoleList();
    this.getRole();
  }

  pageEvent(event){
    this.pageNumber=event.pageIndex;
    this.itemPerPage=event.pageSize;
    this.showRoleList();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.sortColumn = column;
    }
    this.showRoleList();
  }

  filter(value: string) {
    this.searchValues = value;
    this.pageNumber = 0;
    this.showRoleList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageNumber = 0;
    this.showRoleList();
  }

  get_role_list(postdate) {
    this.pageBuffer = true;
    this.dataService.getAll('system-role-list'+postdate)
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

}

@Component({
  selector: 'create-model',
  templateUrl: './create-model.html',
    styleUrls: ['./system-role.component.scss']
})
export class CreateSystemRole {
  checkpageBool = false
  submitButton = false;
  constructor(public dialogRef: MatDialogRef<CreateSystemRole>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) { }

  onClick(): void {
    this.submitButton = true;
    this.dataService.create(this.data, 'system_role_create_update')
      .subscribe(
        data => {
          this.submitButton = false;
          if (data.response === 200) {
            this.dialogRef.close();
            this.common.openTost('success','SUCCESS',data.message);
            this.common.onClickSystemRoleEvent.emit('Component A is clicked!!');
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

  chakAllPage() {
    this.checkpageBool = !this.checkpageBool;
    console.log(this.checkpageBool);
    this.data.pagelist.find((element, index) => {
      if (this.checkpageBool === true) {
        element.pageaccess = true;
      } else {
        element.pageaccess = false;
      }

    })
  }
}



@Component({
  selector: 'delete-role-model',
  templateUrl: './delete-role-model.html',
  styleUrls: ['./system-role.component.scss']
})
export class DeleteSystemRole {
  tokenId = this.common.mycookie.bearertoken;
  constructor(public dialogRef: MatDialogRef<DeleteSystemRole>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    let postdata = this.data;
    this.dataService.create(postdata, 'delete-system-role')
    .subscribe(
     data => {
           if (data.response === 200) {
               this.dialogRef.close();
               this.common.onClickSystemRoleEvent.emit('Component A is clicked!!');
               this.common.openTost('success', 'SUCCESS', data.message);
             }
            if (data.response === 400) {
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
