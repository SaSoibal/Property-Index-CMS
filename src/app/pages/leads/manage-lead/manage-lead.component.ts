import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import {AppError} from '../../../core_classes/app-error';
import {BadInput} from '../../../core_classes/bad-input';

@Component({
  selector: 'app-manage-lead',
  templateUrl: './manage-lead.component.html',
  styleUrls: ['./manage-lead.component.scss']
})
export class ManageLeadComponent implements OnInit {
  position: NzTabPosition = 'left';

  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  process_step = [];
  all_lead = 0;
  constructor(private fb: FormBuilder,
              private common: CommonService,
              private dataService: DataService
  ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.lead_process_list();
    this.common.aClickedEvent
      .subscribe((data: string) => {
        this.lead_process_list();
      });

  }

  permission(type) {
    return this.common.permission('leads/manage-leads', type);
  }
  lead_process_list() {
    const postdate = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdate, 'lead-manage/lead-step')
      .subscribe(async(data) => {
          if (data.response === 200) {
            this.process_step = await data.process_step;
            this.all_lead = 0;
            if (data.process_step.length > 0) {
              data.process_step.forEach(each => {
                this.all_lead += each.tasks_count;
              });
            }
          } else {
            this.process_step = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }



}

