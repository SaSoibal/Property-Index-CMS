import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import {AppError} from '../../core_classes/app-error';
import {BadInput} from '../../core_classes/bad-input';

@Component({
  selector: 'app-banner-section',
  templateUrl: './lone-calculate-instruction.component.html',
  styleUrls: ['./lone-calculate-instruction.component.scss']
})
export class LoneCalculateInstructionComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  createLoneForm!: FormGroup;
  disabledSubmitBtn = false;


  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getData();
    this.common.onLoneCalculateEvent
    .subscribe((data: string) => {
      this.getData();
    });
    this.createLoneForm = this.fb.group({
      description_en: [null, [Validators.required]],
      description_bn: [null, [Validators.required]],
    });

  }

  permission(type) {
    return this.common.permission('lone/instruction', type);
  }

  getData() {
    const inputData = {
      'api_token': this.tokenId,
    };
    this.dataService.create(inputData, 'lone/instruction/list')
      .subscribe(async(data) => {
          if (data.response === 200) {
            this.createLoneForm.patchValue({
              'description_en': data.list.description_en,
              'description_bn': data.list.description_bn,
            });
          } else if (data.response === 404) {
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  submitLoneForm(): void {
    if (this.createLoneForm.valid) {
      this.disabledSubmitBtn = true;
      const inputData = {
        'api_token': this.tokenId,
        'description_en': this.createLoneForm.value.description_en,
        'description_bn': this.createLoneForm.value.description_bn,
      };
      this.dataService.create(inputData, 'lone/instruction/store')
        .subscribe(data => {
            if (data.response === 200) {
              this.common.openTost('success', 'SUCCESS', data.message);
              this.common.onLoneCalculateEvent.emit('Component A is clicked!!');
            } else if (data.response === 400) {
              this.common.openTost('warning', 'WARNING', data.message);
            }
          },
          (error: AppError) => {
            this.common.openTost('error', 'ERROR', 'Please try again later');
            if (error instanceof BadInput) {
            } else { throw error; }
          });
    } else {
          Object.values(this.createLoneForm.controls).forEach(control => {
          if (control.invalid) {
                  control.markAsDirty();
                  control.updateValueAndValidity({ onlySelf: true });
              }
          });
      }
  }

}



