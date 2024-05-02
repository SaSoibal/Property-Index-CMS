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
  district_list: any,
  users_list: any,
  branch_id: string,
  name: string,
  district:number,
  city:number,
  area:number,
  address: string,
  manager_id: number,
  active: boolean,
  status: string,
  operation: string
}

@Component({
  selector: 'app-branch-manage',
  templateUrl: './branch-manage.component.html',
  styleUrls: ['./branch-manage.component.scss']
})
export class BranchManageComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'uploads/';
  erroeMsg = '';
  district_list = [];
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
 
  constructor(private fb: FormBuilder, private common: CommonService, private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showuserList();
    this.getAdditional();

    this.common.aClickedBranchEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showuserList();
      this.getAdditional();
    });

  }

  getAdditional() {
    const postdatet = {
      'api_token': this.tokenId,
    }
    this.dataService.create(postdatet, 'get-branch-additional')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.district_list = data.district;
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
  
  permission(type) {
    return this.common.permission('administrator/branch-manage',type);
  }


  createModel() {
    const dialogRef = this.dialog.open( CreateBranch, {
      width: '500px',
      data: {
        district_list: this.district_list,
        users_list: this.users_list,
        name:'',
        district:'',
        city:'',
        area:'',
        address: '',
        manager_id:'',
        api_token: this.tokenId,
        operation: 'create',
        status: true,
        active: false
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log(result)
    });
  }


  openEditModel(branch) {
    const dialogRef = this.dialog.open( CreateBranch, {
      width: '500px',
      data: {
        district_list: this.district_list,
        users_list: this.users_list,
        branch_id:branch.id,
        name:branch.branch_name,
        district:branch.district_id,
        city:branch.city_id,
        area:branch.area_id,
        address:branch.address,
        manager_id:branch.manager_id,
        api_token: this.tokenId,
        operation: 'update',
        status: branch.status>0?true:false,
        active: branch.status>0?true:false
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
       this.get_branch_list(queryString);
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

  get_branch_list(postdate) {
    this.dataService.getAll('branch-list'+postdate)
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
    const dialogRef = this.dialog.open( DeleteBranch, {
      data: {
        branch_id: user.id,
        name: user.branch_name,
        api_token: this.tokenId,
        operation: 'delete',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

}





@Component({
  selector: 'create-branch-model',
  templateUrl: './create-branch-model.html',
  styleUrls: ['./branch-manage.component.scss']
})
export class CreateBranch {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'uploads/';
  city_list = [];
  area_list = [];
  passwordVisible =false;
  submitButton =false;
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<CreateBranch>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
      if(data.operation == 'update'){
        this.changeDistrict(data.district);
        this.changeCity(data.city);
      }
  }

  changeDistrict(event){
    const postdatet = {
      'api_token': this.tokenId,
      'district_id': event
    }
    this.dataService.create(postdatet, 'get-branch-city')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.city_list = data.city;
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

  changeCity(event){
    const postdatet = {
      'api_token': this.tokenId,
      'city_id': event
    }
    this.dataService.create(postdatet, 'get-branch-area')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.area_list = data.area;
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

  onClick(): void {
    this.submitButton =true;
    this.dataService.create(this.data, 'create-update-branch')
    .subscribe(data => {
      this.submitButton =false;
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedBranchEvent.emit('Component A is clicked!!');
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
  selector: 'delete-branch-modal',
  templateUrl: './delete-branch-model.html',
  styleUrls: ['./branch-manage.component.scss']
})
export class DeleteBranch {
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<DeleteBranch>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  onClick(): void {
    this.dataService.create(this.data, 'delete-branch')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success','SUCCESS',data.message);
        this.common.aClickedBranchEvent.emit('Component A is clicked!!');
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

