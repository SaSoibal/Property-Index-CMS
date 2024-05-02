import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { DataService } from '../../../../services/data.service';
import {AppError} from '../../../../core_classes/app-error';
import {BadInput} from '../../../../core_classes/bad-input';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-just-a-call',
  templateUrl: './just-a-call-away.component.html',
  styleUrls: ['./just-a-call-away.component.scss']
})
export class JustACallAwayComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  createJustCallForm!: FormGroup;
  disabledSubmitBtn = false;
  slug = this.activatedRoute.snapshot.params.slug;


  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getData();
    this.common.onJustACallAway
    .subscribe((data: string) => {
      this.getData();
    });
    this.createJustCallForm = this.fb.group({
      details_en: [null, [Validators.required]],
      details_bn: [null],
      phone_no: [null, [Validators.required]],
      slug: this.slug,
    });

  }

  permission(type) {
    return this.common.permission('interior/interior-list', type);
  }

  getData() {
    const inputData = {
      'api_token': this.tokenId,
      'slug': this.slug,
    };
    this.dataService.create(inputData, 'interior/just-a-call-away/list')
      .subscribe(async(data) => {
          if (data.response === 200) {
            this.createJustCallForm.patchValue({
              'details_en': data.list.details_en,
              'details_bn': data.list.details_bn,
              'phone_no': data.list.phone_no
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

  submitJustCallForm(): void {
    if (this.createJustCallForm.valid) {
      const inputData = {
        'api_token': this.tokenId,
        'details_en': this.createJustCallForm.value.details_en,
        'details_bn': this.createJustCallForm.value.details_bn,
        'phone_no': this.createJustCallForm.value.phone_no,
        'slug': this.createJustCallForm.value.slug,
      };
      this.dataService.create(inputData, 'interior/just-a-call-away/store')
        .subscribe(data => {
            if (data.response === 200) {
              this.common.openTost('success', 'SUCCESS', data.message);
              this.common.onJustACallAway.emit('Component A is clicked!!');
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
          Object.values(this.createJustCallForm.controls).forEach(control => {
          if (control.invalid) {
                  control.markAsDirty();
                  control.updateValueAndValidity({ onlySelf: true });
              }
          });
      }
  }

}



