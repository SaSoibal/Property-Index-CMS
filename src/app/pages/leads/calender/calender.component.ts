import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import { ActivatedRoute } from '@angular/router';

export interface DialogData {
  event: any;
}
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  pageBuffer = false;

  listDataMap;

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getReViewing();
    this.common.aClickedEvent
    .subscribe((data: string) => {
      this.getReViewing();
    });

  }
  permission(type) {
    return this.common.permission('leads/calender', type);
  }


  getReViewing() {
    this.pageBuffer = true;
    const postdate = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdate, 'calender/reviewing-details')
      .subscribe(
        async(data) => {
          if (data.response === 200) {
            this.listDataMap = data.list;
          } else if (data.response === 400) {
          }
          this.pageBuffer = false;
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  clickEvents(event) {
    const dialogRef = this.dialog.open( EventDetailsModel, {
      width: '700px',
      data: {
        event: event,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

}

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details-modal.html',
  styleUrls: ['./calender.component.scss']
})
export class EventDetailsModel {
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/property/';

  constructor(public dialogRef: MatDialogRef<EventDetailsModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData, private common: CommonService) {
  }

  leadNoGenerate(lead: number) {
    return String(lead).padStart(6, '0');
  }
}



