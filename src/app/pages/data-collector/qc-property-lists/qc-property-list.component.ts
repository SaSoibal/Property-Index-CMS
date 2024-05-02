import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
@Component({
  selector: 'app-dc-form',
  templateUrl: './qc-property-list.component.html',
  styleUrls: ['./qc-property-list.component.scss']
})
export class QcPropertyListComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  pending_count = 0;
  reject_count = 0;
  pageBuffer = true;
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.get_count();
    this.common.aClickedEvent
    .subscribe((data: string) => {
      this.get_count();
    });

  }

  permission(type) {
    return this.common.permission('data-collector/qc-property-list', type);
  }
  dcPermission(type) {
    return this.common.permission('data-collector/dc-form', type);
  }

  get_count() {
    this.pageBuffer = true;
    const getData = "?"
      + "api_token=" + this.tokenId;
    this.dataService.getAll('data-collector/count' + getData)
      .subscribe(async(res) => {
          if (res.code === 200) {
            this.pending_count =  await res.pending_count;
            this.reject_count =  await res.reject_count;
          } else if (res.code === 404) {
            this.pending_count = 0;
            this.reject_count = 0;
            this.common.openTost('error','ERROR', res.message);
          }
          this.pageBuffer = false;
        },
        (error: AppError) => {
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }

}
