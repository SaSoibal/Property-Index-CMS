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
  user_id: number,
  department_list:any;
  users_lists:any;
  name: string,
  department_id: number,
  team_manager: number,
  team_member: any,
  status: string,
  operation: string,
  details: any,
}

@Component({
  selector: 'app-team-setup',
  templateUrl: './team-setup.component.html',
  styleUrls: ['./team-setup.component.scss']
})
export class TeamSetupComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'uploads/';
  erroeMsg = '';
  department_list = [];
  users_lists = [];
  totalrow = 0;
  itemPerPage = 10;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection=[];
  dataNotFound = '';
  branch_list = [];
  changeBranch = '';
  pageBuffer = false;

  constructor(private fb: FormBuilder, private common: CommonService, private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showuserList();
    this.getBranch();
    this.additional();
    this.common.aClickedTeamManageEvent
    .subscribe((data: string) => {
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
          if(data.branch.length > 0) {
            this.changeBranch = data.branch[0].id;
            this.onBranch(this.changeBranch);
          }
          this.additional();
        } else if (data.response === 400) {
          this.branch_list =[];
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

  permission(type) {
    return this.common.permission('system-manage/team-setup',type);
  }

  additional() {
    const post = {
      'api_token': this.tokenId,
      'branch_id': this.changeBranch
    }
    this.dataService.create(post, 'get-additional-data')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.department_list = data.department;
          this.users_lists = data.user_list;
        } else if (data.response === 400) {
          this.department_list = [];
          this.users_lists = [];
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateTeamSetup, {
      width: '500px',
      data: {
        branch_id: this.changeBranch,
        department_list:this.department_list,
        users_lists:this.users_lists,
        name: '',
        department_id: '',
        team_manager: '',
        team_member:[],
        api_token: this.tokenId,
        operation: 'create',
        status: true,
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result);
    });
  }


  openEditModel(row) {
    const member_list = [];
    row.member_list.forEach(itm => {
      member_list.push(itm.systemuser_id);
    });
    console.log(member_list,'row');
    const dialogRef = this.dialog.open( CreateTeamSetup, {
      width: '500px',
      data: {
        row_id: row.id,
        branch_id: this.changeBranch,
        department_list: this.department_list,
        users_lists: this.users_lists,
        name: row.name,
        department_id: row.department_id,
        team_manager: row.team_manager,
        team_member: member_list,
        api_token: this.tokenId,
        operation: 'update',
        status: row.status == 1 ? true : false,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openViewModel(row) {
    const data = {
      'api_token': this.tokenId,
      'row_id': row.id,
    }
    this.dataService.create(data, 'team-setup-details')
    .subscribe(
      data => {
        if (data.response === 200) {
          const dialogRef = this.dialog.open( ViewTeam, {
            width: '500px',
            data: {
              details: data.details,
              operation: 'details',
            }
          });
          dialogRef.afterClosed().subscribe( result => {
          });
        } else if (data.response === 400) {

        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });


  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  onBranch(event){
    this.changeBranch = event
    this.pageNumber = 0;
    this.showuserList();
    this.additional()
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
       this.get_team_list(queryString);
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

  get_team_list(postdate) {
    this.pageBuffer = true;
    this.dataService.getAll('team-setup-list'+postdate)
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
    const dialogRef = this.dialog.open( DeleteTeamSetup, {
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



}





@Component({
  selector: 'create-team-setup-model',
  templateUrl: './create-team-setup-model.html',
  styleUrls: ['./team-setup.component.scss']
})
export class CreateTeamSetup {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateTeamSetup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'create-update-team')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedTeamManageEvent.emit('Component A is clicked!!');
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

@Component({
  selector: 'view-team-setup-model',
  templateUrl: './view-team-setup-model.html',
  styleUrls: ['./team-setup.component.scss']
})
export class ViewTeam {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<ViewTeam>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }
}

@Component({
  selector: 'delete-team-setup-model',
  templateUrl: './delete-team-setup-model.html',
  styleUrls: ['./team-setup.component.scss']
})
export class DeleteTeamSetup {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteTeamSetup>,
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
        this.common.aClickedTeamManageEvent.emit('Component A is clicked!!');
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

