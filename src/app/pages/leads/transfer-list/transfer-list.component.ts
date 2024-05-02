import { Component,ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';


export interface DialogData {
  checked_all_count:number;
  selected_lead:any;
  note: string;
  operation: string;
  user_details:any;
}

export interface DialogDetails {
  lead_id: number,
  task_name:string;
  created_date:string;
  phone_no:string;
  phone_code:any;
  client_details:any;
  lead_process:any;
  opportunity:any;
  lead_details:any;
  process:any;
  process_start:any;
}

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  user_type;
  erroeMsg = '';
  totalrow = 0;
  itemPerPage = 10;
  public pageNumber: number = 1;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  public searchValues: string = '';
  collection=[];
  dataNotFound = '';
  today = new Date().toISOString().slice(0, 10);
  checked_all= false;
  checked_all_count =0;
  selected_lead=[];
  date_to_date = '';
  pageBuffer = false;

  constructor(private fb: FormBuilder, 
    private common: CommonService, 
    private dataService: DataService, 
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.common.aClickedEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
    });

  }

  clickCheckedAll(event){
    this.checked_all_count = 0
    this.collection.forEach(element => {
      element.checked = event;
      if(element.checked == true){
        this.checked_all_count = 1; 
      }
    });
  }

  singleChecked(event){
    this.checked_all_count = 0
    this.collection.forEach(element => {
      if(element.checked == true){
        this.checked_all_count = 1; 
      }
    });
  }

  
  permission(type) {
    return this.common.permission('leads/transfer-list',type);
  }

 
  getCount(count){
    return count;
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
       const curl = "?"
         + "search=" + this.searchValues
         + "&per_page=" +  this.itemPerPage
         + "&sort_by=" + orderBy
         + "&sort_column=" +  this.sortColumn
         + "&page=" + this.pageNumber 
         + "&date_to_date=" +  this.date_to_date
         + "&api_token=" +  this.tokenId
       this.get_list(curl);
  } 

  pageEvent(event){
    this.pageNumber = event.pageIndex + 1;
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
    this.pageNumber = 1;
    this.showList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageNumber = 1;
    this.showList();
  }
  onChangeDateRange(result: Date[]){
    if(result.length > 0){
      this.date_to_date = formatDate(result[0], 'Y-MM-d', 'en-US') +','+ formatDate(result[1], 'Y-MM-d', 'en-US');
    }else{
      this.date_to_date ='';
    }
    this.showList();
  }
  get_list(curl) {
    this.pageBuffer = true;
    this.dataService.getAll('lead-transfer-list/'+curl)
    .subscribe(async(data)=> {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.collection = await data.list.data;
          this.collection.forEach(element => {
            element.checked = false;
          });
          this.totalrow = await data.list.total;
          this.dataNotFound = '';
        } else if (data.response === 400) {
          this.collection = [];
          this.totalrow = await data.list.total;
          this.dataNotFound = data.message;
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }


  leadNoGenerate(lead:number){
    return String(lead).padStart(6, '0')
  }


  approveTransfer(){
    this.selected_lead = [];
    this.collection.forEach(element => {
      if(element.checked==true){
        this.selected_lead.push(element.tasks);
      }
    });
    const dialogRef = this.dialog.open( TransferApproveModel, {
      width: '400px',
      data: {
        selected_lead:this.selected_lead,
        note:'',
        api_token: this.tokenId,
        operation: 'Submit',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  detailsModel(lead){
    this.pageBuffer = true;
    const postdate={
      'api_token': this.tokenId,
      'lead_id': lead.id
    }
    this.dataService.create(postdate, 'list-lead-details')
    .subscribe(
      async(data) => {  
        if (data.response === 200) {
          await this.ClientDetailsData(lead,data.details,data.process,data.process_start);
          this.pageBuffer = false;
        } else if (data.response === 400) {
        }
      },
      (error: AppError) => {
        this.common.openTost('error','ERROR','Please try again later');
      if (error instanceof BadInput) {
        } else { throw error };
      });
  }
  
  ClientDetailsData(lead,details,process,process_start) {
    const dialogRef = this.dialog.open( TransferLeadsDetails, {
      width: '100%',
      data: {
        lead_id: String(lead.id).padStart(6, '0'),
        task_name: details.task_name?details.task_name.step:'',
        created_date: details.created_at,
        phone_code: details.phone_code,
        phone_no: details.phone_no,
        client_details: details.client_information,
        lead_process: process,
        opportunity: details.lead_opportunity,
        lead_details: details.leads_details,
        process_start: process_start,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  userDetails(user_id) {
    this.pageBuffer = true;
    const postdate={
      'api_token': this.tokenId,
      'user_id': user_id
    }
    this.dataService.create(postdate, 'transfer-user-details')
    .subscribe(
      async(data) => {  
        if (data.response === 200) {
            const dialogRef = this.dialog.open( TransferUserDetails, {
              width: '400px',
              data: {
                user_details : await data.user
              }
            });
            dialogRef.afterClosed().subscribe( result => {
            });
          this.pageBuffer = false;
        } else if (data.response === 400) {
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
  selector: 'transfer-approve-model',
  templateUrl: './transfer-approve-model.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferApproveModel {
  tokenId = this.common.mycookie.bearertoken ;

  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<TransferApproveModel>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

  leadNoGenerate(lead:number){
    return String(lead).padStart(6, '0')
  }

  onClick(): void {
    const dataList = {
        selected_lead:this.data.selected_lead,
        note:this.data.note,
        api_token: this.tokenId,
        operation: this.data.operation,
    }

    this.dataService.create(dataList, 'transfer-approve')
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



@Component({
  selector: 'leads-details-model',
  templateUrl: './leads-details-model.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferLeadsDetails {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/leads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<TransferLeadsDetails>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDetails,
    private dataService: DataService,
    private common: CommonService) {
  }

  setData = '';
  getData(event){
    this.setData = event;
  }
}

@Component({
  selector: 'leads-user-model',
  templateUrl: './leads-user-model.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferUserDetails {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/leads/';
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<TransferUserDetails>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
  }

}



