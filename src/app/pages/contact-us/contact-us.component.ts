import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from '../../services/common.service';
import {DataService} from '../../services/data.service';
import {AppError} from '../../core_classes/app-error';
import {BadInput} from '../../core_classes/bad-input';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken;
  rootUrl = this.common.rootUrl + 'public/uploads/';
  createForm!: FormGroup;
  disabledSubmitBtn = false;
  showData = 'EN';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  constructor(private fb: FormBuilder,
              private common: CommonService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.common.checkCookie();
    this.getData();
    this.common.onLoneCalculateEvent
      .subscribe((data: string) => {
        this.getData();
      });
    this.createForm = this.fb.group({
      operation: ['create', ''],
      address_en: ['', ''],
      address_bn: ['', '']
    });

  }

  permission(type) {
    return this.common.permission('lone/instruction', type);
  }

  getData() {
    const inputData = {
      'api_token': this.tokenId,
    };

    this.dataService.create(inputData, 'get-contact-page')
      .subscribe(async (data) => {
          if (data.response === 200) {
            const contactData = data.data;

            this.createForm.patchValue({
              id: contactData.id ? contactData.id : '0',
              operation: contactData.id ? 'update' : 'create',
              address_en: contactData.address_en,
              address_bn: contactData.address_bn
            });


            console.log(this.createForm);

          } else if (data.response === 404) {
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        });
  }

  onClick(): void {
    this.createForm['image'] = this.SelectedFile;
    this.dataService.create(this.createForm, 'blog-create-update')
      .subscribe(data => {
          if (data.response === 200) {
            this.common.openTost('success', 'SUCCESS', data.message);
            this.common.AClicked('Component A is clicked!!');
            // tslint:disable-next-line: max-line-length
          } else if (data.response === 401) {
            this.common.openTost('warning', 'WARNING', data.password);
          } else if (data.response === 400) {
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
          ;
        });
  }

  submitForm(): void {
    if (this.createForm.valid) {
      // this.disabledSubmitBtn = true;
      const inputData = {
        'id': this.createForm.value.id,
        'operation': this.createForm.value.operation,
        'api_token': this.tokenId,
        'address_en': this.createForm.value.address_en,
        'address_bn': this.createForm.value.address_bn
      };

      console.log(inputData, 'inputData');

      this.dataService.create(inputData, 'submit-contact-page')
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
            } else {
              throw error;
            }
          });
    } else {
      Object.values(this.createForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

}
