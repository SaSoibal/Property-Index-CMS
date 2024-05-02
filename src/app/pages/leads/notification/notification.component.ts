import { Component, ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
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

export interface DialogData {
  type: string;
  team: number;
  user: number;
  title: string;
  description: string;
  save_type: string;
}
@Component({
  selector: 'app-lead-list',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  team_member = [];
  collection = [];
  totalrow = 0;
  itemPerPage = 10;
  public pageNumber: number = 1;
  pageSizeOptions: number[] = [10, 25, 50, 100, 200, 300, 500];
  dataOrderBy = 'asc';
  sortColumn = 'id';
  pageBuffer = false;
  filter = '';
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.teamList();
    this.showList();
    this.common.aClickedEvent
    .subscribe((data: string) => {
      console.log('Event message from Component A: ' + data);
      this.showList();
    });

  }

  teamList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/team-list')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.team_member = data.list;
          } else {
            this.team_member = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  permission(type) {
    return this.common.permission('leads/notification', type);
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  clickSearch() {
    this.showList();
  }

  onChangePerPage(item) {
    this.itemPerPage = item;
    this.pageNumber = 1;
  }
  onChangeSortColumn(item) {
    this.sortColumn = item;
    this.pageNumber = 1;
  }
  onChangeOrderBy(order) {
    this.dataOrderBy = order;
    this.pageNumber = 1;
  }

  pageEvent(event) {
    this.pageNumber = event.pageIndex;
    this.itemPerPage = event.pageSize;
    this.showList();
  }
  leadFilter(event) {
    this.filter = event;
    this.pageNumber = 1;
    this.showList();
  }

  showList() {
       const curl = "?"
         + "per_page=" + this.itemPerPage
         + "&sort_by=" + this.dataOrderBy
         + "&sort_column=" +  this.sortColumn
         + "&page=" + this.pageNumber
         + "&api_token=" +  this.tokenId
         + "&filter=" + this.filter;
       this.get_list(curl);
  }

  get_list(curl) {
    this.pageBuffer = true;
    this.dataService.getAll('share-lead/index/' + curl)
    .subscribe(async(data) => {
        this.pageBuffer = false;
        if (data.code === 200) {
          this.collection = await data.list.data;
          this.totalrow = await data.list.total;
        } else if (data.response === 400) {
          this.collection = [];
          this.totalrow = await data.list.total;
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });
  }


  openModel() {
    const dialogRef = this.dialog.open( NotificationModel, {
      width: '800px',
      data: {
        type: 'all',
        team: '',
        user: '',
        title: '',
        description: '',
        save_type: 'create',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }


}

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationModel {
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/property/';

  constructor(public dialogRef: MatDialogRef<NotificationModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData, private common: CommonService) {
  }

}



